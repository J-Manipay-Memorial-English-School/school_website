import 'dotenv/config';
import crypto from 'node:crypto';
import path from 'node:path';
import express, { NextFunction, Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';

const PORT = Number(process.env.PORT) || 3000;
const ALLOWED_DATA_URL_PREFIX =
  /^data:(image\/(png|jpeg|jpg|webp|gif|svg\+xml)|application\/pdf);base64,/i;
const MAX_UPLOAD_DATA_URL_LENGTH = 8 * 1024 * 1024;

let inMemorySchoolData: Record<string, unknown> | null = null;

function constantTimeEquals(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8');
  const bBuf = Buffer.from(b, 'utf8');
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function requireAdminPassword(req: Request, res: Response, next: NextFunction): void {
  const configuredPassword =
    typeof process.env.ADMIN_PASSWORD === 'string' ? process.env.ADMIN_PASSWORD : '';

  if (!configuredPassword) {
    res.status(503).json({
      authenticated: false,
      error:
        'Administrator password is not configured on the server. Set ADMIN_PASSWORD in environment variables.',
    });
    return;
  }

  const providedPassword = req.header('x-admin-password') ?? '';
  if (!providedPassword || !constantTimeEquals(providedPassword, configuredPassword)) {
    res.status(401).json({
      authenticated: false,
      error: 'Unauthorized: Invalid administrator password.',
    });
    return;
  }

  next();
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase())) {
      requireAdminPassword(req, res, next);
      return;
    }
    next();
  });

  app.post('/api/auth', (_req, res) => {
    res.status(200).json({ authenticated: true });
  });

  app.get('/api/school-data', (_req, res) => {
    res.status(200).json({
      data: inMemorySchoolData,
      persistence: inMemorySchoolData ? 'memory' : 'client-fallback',
    });
  });

  const handleSaveSchoolData = (req: Request, res: Response) => {
    const body = req.body as unknown;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'School data payload must be a JSON object.' });
      return;
    }
    const payload: Record<string, unknown> = {
      ...(body as Record<string, unknown>),
      updatedAt: new Date().toISOString(),
    };
    inMemorySchoolData = payload;
    res.status(200).json({ ok: true, data: payload });
  };

  app.put('/api/school-data', handleSaveSchoolData);
  app.post('/api/school-data', handleSaveSchoolData);

  app.delete('/api/school-data', (_req, res) => {
    inMemorySchoolData = null;
    res.status(200).json({ ok: true });
  });

  app.post('/api/upload', async (req, res) => {
    const body = req.body as {
      name?: unknown;
      mimeType?: unknown;
      dataUrl?: unknown;
    };

    const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 200) : 'upload';
    const rawMimeType = typeof body?.mimeType === 'string' ? body.mimeType.trim() : '';
    const dataUrl = typeof body?.dataUrl === 'string' ? body.dataUrl.trim() : '';

    const prefixMatch = ALLOWED_DATA_URL_PREFIX.exec(dataUrl);
    if (!dataUrl || !prefixMatch) {
      res.status(400).json({
        error: 'Invalid file format. Only image and PDF data uploads are permitted.',
      });
      return;
    }

    if (dataUrl.length > MAX_UPLOAD_DATA_URL_LENGTH) {
      res.status(413).json({ error: 'Uploaded file exceeds maximum allowed size.' });
      return;
    }

    const detectedMimeType = prefixMatch[1].toLowerCase();
    const resolvedMimeType = rawMimeType || detectedMimeType;
    const isPdf = detectedMimeType === 'application/pdf';
    const isSvg = detectedMimeType === 'image/svg+xml';

    const cloudName =
      typeof process.env.CLOUDINARY_CLOUD_NAME === 'string'
        ? process.env.CLOUDINARY_CLOUD_NAME.trim()
        : '';
    const apiKey =
      typeof process.env.CLOUDINARY_API_KEY === 'string'
        ? process.env.CLOUDINARY_API_KEY.trim()
        : '';
    const apiSecret =
      typeof process.env.CLOUDINARY_API_SECRET === 'string'
        ? process.env.CLOUDINARY_API_SECRET.trim()
        : '';

    if (!cloudName || !apiKey || !apiSecret) {
      res.status(200).json({
        ok: true,
        url: dataUrl,
        name: name || 'upload',
        mimeType: resolvedMimeType,
      });
      return;
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const sanitized =
      name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'media';
    const uniqueSuffix = crypto.randomUUID().slice(0, 8);
    const publicId = isPdf
      ? `${sanitized}-${timestamp}-${uniqueSuffix}.pdf`
      : `${sanitized}-${timestamp}-${uniqueSuffix}`;
    const folder = 'jmmes-portal';
    const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash('sha1')
      .update(`${paramsToSign}${apiSecret}`)
      .digest('hex');

    const formData = new FormData();
    formData.append('file', dataUrl);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('folder', folder);
    formData.append('public_id', publicId);
    formData.append('signature', signature);

    const resourceType = isPdf ? 'raw' : 'image';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${encodeURIComponent(
      cloudName
    )}/${resourceType}/upload`;

    try {
      const cloudinaryRes = await fetch(uploadUrl, { method: 'POST', body: formData });
      const cloudinaryBody = (await cloudinaryRes.json()) as {
        secure_url?: unknown;
        error?: { message?: unknown };
      };
      const secureUrl =
        typeof cloudinaryBody?.secure_url === 'string' ? cloudinaryBody.secure_url : '';

      if (!cloudinaryRes.ok || !secureUrl) {
        const errMsg =
          typeof cloudinaryBody?.error?.message === 'string' &&
          cloudinaryBody.error.message.trim()
            ? cloudinaryBody.error.message.trim()
            : 'Cloudinary upload failed.';
        res.status(502).json({ error: errMsg });
        return;
      }

      const finalUrl =
        !isPdf && !isSvg && secureUrl.includes('/image/upload/')
          ? secureUrl.replace('/image/upload/', '/image/upload/f_auto,q_auto/')
          : secureUrl;

      res.status(200).json({
        ok: true,
        url: finalUrl,
        name: name || 'upload',
        mimeType: resolvedMimeType,
      });
    } catch {
      res.status(502).json({ error: 'Unable to reach Cloudinary upload service.' });
    }
  });

  app.delete('/api/upload', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

void startServer();
