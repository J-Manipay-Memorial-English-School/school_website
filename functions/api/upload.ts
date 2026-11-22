import { jsonResponse, PagesContext, verifyAdminPassword } from './_auth';

interface UploadRequestBody {
  name?: unknown;
  mimeType?: unknown;
  dataUrl?: unknown;
}

const ALLOWED_DATA_URL_PREFIX =
  /^data:(image\/(png|jpeg|jpg|webp|gif|svg\+xml)|application\/pdf);base64,/i;
const MAX_UPLOAD_DATA_URL_LENGTH = 8 * 1024 * 1024;

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const authError = verifyAdminPassword(context.request, context.env);
  if (authError) {
    return authError;
  }

  let body: UploadRequestBody;
  try {
    body = (await context.request.json()) as UploadRequestBody;
  } catch {
    return jsonResponse({ error: 'Invalid JSON upload payload.' }, 400);
  }

  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 200) : 'upload';
  const mimeType = typeof body?.mimeType === 'string' ? body.mimeType.trim() : '';
  const dataUrl = typeof body?.dataUrl === 'string' ? body.dataUrl.trim() : '';

  if (!dataUrl || !ALLOWED_DATA_URL_PREFIX.test(dataUrl)) {
    return jsonResponse(
      { error: 'Invalid file format. Only image and PDF data uploads are permitted.' },
      400
    );
  }

  if (dataUrl.length > MAX_UPLOAD_DATA_URL_LENGTH) {
    return jsonResponse({ error: 'Uploaded file exceeds maximum allowed size.' }, 413);
  }

  return jsonResponse(
    {
      ok: true,
      url: dataUrl,
      name: name || 'upload',
      mimeType: mimeType || 'application/octet-stream',
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
