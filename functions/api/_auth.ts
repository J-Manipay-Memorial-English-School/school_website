export interface KVNamespaceLike {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string) => Promise<void>;
  delete: (key: string) => Promise<void>;
}

export interface PagesEnv {
  ADMIN_PASSWORD?: string;
  SCHOOL_KV?: KVNamespaceLike;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
}

export interface PagesContext {
  request: Request;
  env: PagesEnv;
  next: () => Promise<Response>;
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function constantTimeEquals(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  const maxLen = Math.max(aBytes.length, bBytes.length);

  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < maxLen; i += 1) {
    const aVal = i < aBytes.length ? aBytes[i] : 0;
    const bVal = i < bBytes.length ? bBytes[i] : 0;
    diff |= aVal ^ bVal;
  }
  return diff === 0;
}

export function verifyAdminPassword(request: Request, env: PagesEnv): Response | null {
  const configuredPassword = typeof env.ADMIN_PASSWORD === 'string' ? env.ADMIN_PASSWORD : '';
  if (!configuredPassword) {
    return jsonResponse(
      {
        authenticated: false,
        error:
          'Administrator password is not configured on the server. Set ADMIN_PASSWORD in Cloudflare Pages environment secrets.',
      },
      503
    );
  }

  const providedPassword = request.headers.get('x-admin-password') ?? '';
  if (!providedPassword || !constantTimeEquals(providedPassword, configuredPassword)) {
    return jsonResponse(
      {
        authenticated: false,
        error: 'Unauthorized: Invalid administrator password.',
      },
      401
    );
  }

  return null;
}
