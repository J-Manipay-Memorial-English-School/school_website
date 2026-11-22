import { jsonResponse, PagesContext, verifyAdminPassword } from './_auth';

const KV_SCHOOL_DATA_KEY = 'jmmes_school_data_v1';

export async function onRequestGet(context: PagesContext): Promise<Response> {
  if (!context.env.SCHOOL_KV) {
    return jsonResponse({ data: null, persistence: 'client-fallback' }, 200);
  }

  try {
    const raw = await context.env.SCHOOL_KV.get(KV_SCHOOL_DATA_KEY);
    if (!raw) {
      return jsonResponse({ data: null, persistence: 'kv' }, 200);
    }
    const parsed = JSON.parse(raw) as unknown;
    return jsonResponse({ data: parsed, persistence: 'kv' }, 200);
  } catch {
    return jsonResponse({ error: 'Failed to read school data from storage.' }, 500);
  }
}

async function handleSave(context: PagesContext): Promise<Response> {
  const authError = verifyAdminPassword(context.request, context.env);
  if (authError) {
    return authError;
  }

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON request body.' }, 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonResponse({ error: 'School data payload must be a JSON object.' }, 400);
  }

  const payload = {
    ...(body as Record<string, unknown>),
    updatedAt: new Date().toISOString(),
  };

  if (context.env.SCHOOL_KV) {
    await context.env.SCHOOL_KV.put(KV_SCHOOL_DATA_KEY, JSON.stringify(payload));
  }

  return jsonResponse({ ok: true, data: payload }, 200);
}

export async function onRequestPut(context: PagesContext): Promise<Response> {
  return handleSave(context);
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  return handleSave(context);
}

export async function onRequestDelete(context: PagesContext): Promise<Response> {
  const authError = verifyAdminPassword(context.request, context.env);
  if (authError) {
    return authError;
  }

  if (context.env.SCHOOL_KV) {
    await context.env.SCHOOL_KV.delete(KV_SCHOOL_DATA_KEY);
  }

  return jsonResponse({ ok: true }, 200);
}
