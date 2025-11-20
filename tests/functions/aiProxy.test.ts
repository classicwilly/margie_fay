import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Use dynamic import so we can toggle env vars before importing
const FUNCTIONS_PATH = '../../functions/index.js';

function makeReqRes(opts: { method?: string; headers?: Record<string, any>; body?: any } = {}) {
  let statusCode = 200;
  let payload: any = undefined;
  const headers = opts.headers || {};

  const req: any = {
    method: (opts.method || 'POST').toUpperCase(),
    headers,
    body: opts.body || {},
    header(name: string) {
      return headers[name] || headers[name.toLowerCase()];
    },
  };

  const res: any = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(bodyObj: any) {
      payload = bodyObj;
      return res;
    },
    send(bodyObj: any) {
      payload = bodyObj;
      return res;
    },
    _result() {
      return { status: statusCode, body: payload };
    },
  };

  return { req, res };
}

async function loadAiProxy(env: Record<string, string | undefined>) {
  for (const k of Object.keys(env)) {
    if (env[k] === undefined) delete process.env[k];
    else process.env[k] = env[k] as string;
  }
  // Clear cache
  try { delete require.cache[require.resolve(FUNCTIONS_PATH)]; } catch (e) {}
  const mod = await import(FUNCTIONS_PATH);
  return mod.aiProxy;
}

// mock firebase-related modules so importing functions/index.js does not require external installs
(vi as any).mock('firebase-functions', () => ({
  https: { onRequest: (handler: any) => handler },
  config: () => ({ ai: { allow_stub: 'true' } }),
}), { virtual: true });

(vi as any).mock('node-fetch', () => ({ default: () => ({ json: async () => ({ model: 'fake', text: 'fake' }) }) }), { virtual: true });

(vi as any).mock('firebase-admin', () => ({
  initializeApp: () => {},
  auth: () => ({ verifyIdToken: async (t: string) => ({ uid: t === 'faketoken' ? 'ok' : 'unknown' }) }),
  appCheck: () => ({ verifyToken: async () => ({}) }),
  firestore: () => ({ collection: () => ({ add: async () => ({}) }), FieldValue: { serverTimestamp: () => new Date() } }),
}), { virtual: true });

describe('aiProxy server stub', () => {
  const OLD_ENV = { ...process.env };

  beforeEach(() => {
    // default to test env so stub is allowed
    process.env.NODE_ENV = process.env.NODE_ENV || 'test';
    vi.resetModules();
  });

  afterEach(() => {
    Object.assign(process.env, OLD_ENV);
    vi.resetAllMocks();
  });

  it('returns canned stub JSON when PLAYWRIGHT_AI_STUB=true', async () => {
    const aiProxy = await loadAiProxy({ PLAYWRIGHT_AI_STUB: 'true', NODE_ENV: 'test' });
    const { req, res } = makeReqRes({ method: 'POST', body: { prompt: 'hello stub' } });
    await aiProxy(req, res);
    const r = res._result();
    expect(r.status).toBe(200);
    expect(r.body.model).toBe('stub-v1');
    expect(r.body.stub).toBe(true);
    expect(r.body.prompt).toBe('hello stub');
  });

  it('returns 405 on GET even in stub mode', async () => {
    const aiProxy = await loadAiProxy({ PLAYWRIGHT_AI_STUB: 'true', NODE_ENV: 'test' });
    const { req, res } = makeReqRes({ method: 'GET' });
    await aiProxy(req, res);
    const r = res._result();
    expect(r.status).toBe(405);
    expect(r.body.error).toBe('Method not allowed');
  });

  it('returns 401 when not stubbed and no auth header', async () => {
    const aiProxy = await loadAiProxy({ PLAYWRIGHT_AI_STUB: 'false', AI_STUB: 'false', NODE_ENV: 'test' });
    const { req, res } = makeReqRes({ method: 'POST' });
    await aiProxy(req, res);
    const r = res._result();
    expect(r.status).toBe(401);
    expect(r.body.error).toBe('Missing token');
  });
});
