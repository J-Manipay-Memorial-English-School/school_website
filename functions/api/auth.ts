import { jsonResponse, PagesContext, verifyAdminPassword } from './_auth';

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const authError = verifyAdminPassword(context.request, context.env);
  if (authError) {
    return authError;
  }
  return jsonResponse({ authenticated: true }, 200);
}

export async function onRequestGet(): Promise<Response> {
  return jsonResponse(
    { authenticated: false, error: 'Method Not Allowed. Send POST with x-admin-password header.' },
    405
  );
}
