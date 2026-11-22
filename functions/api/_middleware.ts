import { PagesContext, verifyAdminPassword } from './_auth';

const PROTECTED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export async function onRequest(context: PagesContext): Promise<Response> {
  const method = context.request.method.toUpperCase();

  if (PROTECTED_METHODS.has(method)) {
    const authError = verifyAdminPassword(context.request, context.env);
    if (authError) {
      return authError;
    }
  }

  return context.next();
}
