import { jsonResponse, PagesContext, verifyAdminPassword } from './_auth';

interface UploadRequestBody {
  name?: unknown;
  mimeType?: unknown;
  dataUrl?: unknown;
}

const ALLOWED_DATA_URL_PREFIX =
  /^data:(image\/(png|jpeg|jpg|webp|gif|svg\+xml)|application\/pdf);base64,/i;
const MAX_UPLOAD_DATA_URL_LENGTH = 8 * 1024 * 1024;
const CLOUDINARY_FOLDER = 'jmmes-portal';

function sanitizePublicId(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^/.]+$/, '');
  const normalized = withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return normalized || 'media';
}

async function sha1Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-1', bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const authError = verifyAdminPassword(context.request, context.env);
  if (authError) {
    return authError;
  }

  const cloudName =
    typeof context.env.CLOUDINARY_CLOUD_NAME === 'string'
      ? context.env.CLOUDINARY_CLOUD_NAME.trim()
      : '';
  const apiKey =
    typeof context.env.CLOUDINARY_API_KEY === 'string'
      ? context.env.CLOUDINARY_API_KEY.trim()
      : '';
  const apiSecret =
    typeof context.env.CLOUDINARY_API_SECRET === 'string'
      ? context.env.CLOUDINARY_API_SECRET.trim()
      : '';

  if (!cloudName || !apiKey || !apiSecret) {
    return jsonResponse(
      {
        error:
          'Cloudinary is not configured on the server. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Cloudflare Pages environment variables.',
      },
      503
    );
  }

  let body: UploadRequestBody;
  try {
    body = (await context.request.json()) as UploadRequestBody;
  } catch {
    return jsonResponse({ error: 'Invalid JSON upload payload.' }, 400);
  }

  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 200) : 'upload';
  const rawMimeType = typeof body?.mimeType === 'string' ? body.mimeType.trim() : '';
  const dataUrl = typeof body?.dataUrl === 'string' ? body.dataUrl.trim() : '';

  const prefixMatch = ALLOWED_DATA_URL_PREFIX.exec(dataUrl);
  if (!dataUrl || !prefixMatch) {
    return jsonResponse(
      { error: 'Invalid file format. Only image and PDF data uploads are permitted.' },
      400
    );
  }

  if (dataUrl.length > MAX_UPLOAD_DATA_URL_LENGTH) {
    return jsonResponse({ error: 'Uploaded file exceeds maximum allowed size.' }, 413);
  }

  const detectedMimeType = prefixMatch[1].toLowerCase();
  const resolvedMimeType = rawMimeType || detectedMimeType;
  const isPdf = detectedMimeType === 'application/pdf';
  const isSvg = detectedMimeType === 'image/svg+xml';

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const uniqueSuffix = crypto.randomUUID().slice(0, 8);
  const basePublicId = `${sanitizePublicId(name)}-${timestamp}-${uniqueSuffix}`;
  const publicId = isPdf ? `${basePublicId}.pdf` : basePublicId;

  // Cloudinary signed upload parameters (alphabetical order by key)
  const paramsToSign = `folder=${CLOUDINARY_FOLDER}&public_id=${publicId}&timestamp=${timestamp}`;
  const signature = await sha1Hex(`${paramsToSign}${apiSecret}`);

  const formData = new FormData();
  formData.append('file', dataUrl);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('folder', CLOUDINARY_FOLDER);
  formData.append('public_id', publicId);
  formData.append('signature', signature);

  const resourceType = isPdf ? 'raw' : 'image';
  const uploadUrl = `https://api.cloudinary.com/v1_1/${encodeURIComponent(
    cloudName
  )}/${resourceType}/upload`;

  let cloudinaryRes: Response;
  try {
    cloudinaryRes = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });
  } catch {
    return jsonResponse({ error: 'Unable to reach Cloudinary upload service.' }, 502);
  }

  let cloudinaryBody: { secure_url?: unknown; error?: { message?: unknown } } = {};
  try {
    cloudinaryBody = (await cloudinaryRes.json()) as {
      secure_url?: unknown;
      error?: { message?: unknown };
    };
  } catch {
    // non-JSON response
  }

  const secureUrl =
    typeof cloudinaryBody?.secure_url === 'string' ? cloudinaryBody.secure_url : '';

  if (!cloudinaryRes.ok || !secureUrl) {
    const errMsg =
      typeof cloudinaryBody?.error?.message === 'string' &&
      cloudinaryBody.error.message.trim()
        ? cloudinaryBody.error.message.trim()
        : 'Cloudinary upload failed.';
    return jsonResponse({ error: errMsg }, 502);
  }

  // Inject f_auto,q_auto delivery optimization for raster images
  const finalUrl =
    !isPdf && !isSvg && secureUrl.includes('/image/upload/')
      ? secureUrl.replace('/image/upload/', '/image/upload/f_auto,q_auto/')
      : secureUrl;

  return jsonResponse(
    {
      ok: true,
      url: finalUrl,
      name: name || 'upload',
      mimeType: resolvedMimeType,
    },
    200
  );
}

export async function onRequestDelete(context: PagesContext): Promise<Response> {
  const authError = verifyAdminPassword(context.request, context.env);
  if (authError) {
    return authError;
  }
  return jsonResponse({ ok: true }, 200);
}
