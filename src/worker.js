// Granny Flat Checklist — payment gate
//
// Serves the static site and, when the paywall is switched on, requires a
// paid access pass for every stage except Siting.
//
// Settings (Cloudflare dashboard → Workers & Pages → grannyflatchecklist →
// Settings → Variables and secrets):
//   PAYWALL            "on" to require payment. Anything else leaves every stage open.
//   STRIPE_SECRET_KEY  Stripe secret key (sk_test_… while testing, sk_live_… when live).
//   ACCESS_SECRET      Any long random string. Used to sign access passes. Never share it.
//
// Access passes are signed cookies, so no customer data is stored on our side.
// After paying, the buyer also gets a personal link to unlock other devices.

const STAGES = {
  'foundations':   'Milestone 2 — Foundations',
  'concrete-slab': 'Milestone 3 — Concrete slab',
  'framing':       'Milestone 4 — Framing',
  'cavity-wrap':   'Milestone 5 — Cavity & wrap',
  'cladding':      'Milestone 6 — Cladding',
  'preline':       'Milestone 7 — Preline & insulation',
  'postline':      'Milestone 8 — Postline',
  'final':         'Milestone 9 — Final',
};
const PRICE_STAGE = 7900;   // NZD cents
const PRICE_ALL = 55000;
const COOKIE = 'gfc_access';
const PASS_DAYS = 365 * 3;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/api/checkout') return checkout(url, env);
    if (path === '/api/success') return success(url, request, env);
    if (path === '/api/unlock') return unlock(url, request, env);
    if (path === '/api/access') return accessInfo(request, env);

    const stage = stageFromPath(path);
    if (stage && env.PAYWALL === 'on') {
      const pass = await readPass(request, env);
      if (!pass || !(pass.s.includes('all') || pass.s.includes(stage))) {
        return Response.redirect(url.origin + '/buy.html?stage=' + stage, 302);
      }
    }
    return env.ASSETS.fetch(request);
  },
};

function stageFromPath(path) {
  const slug = path.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '');
  return Object.prototype.hasOwnProperty.call(STAGES, slug) ? slug : null;
}

/* ---------- Stripe ---------- */

async function stripe(env, method, endpoint, params) {
  const res = await fetch('https://api.stripe.com/v1/' + endpoint, {
    method,
    headers: {
      Authorization: 'Bearer ' + env.STRIPE_SECRET_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params ? new URLSearchParams(params) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data.error && data.error.message) || 'Stripe error');
  return data;
}

async function checkout(url, env) {
  const stage = url.searchParams.get('stage');
  const all = stage === 'all';
  if (!all && !STAGES[stage]) return text('Unknown stage', 400);
  if (!env.STRIPE_SECRET_KEY || !env.ACCESS_SECRET) return text('Payments are not set up yet.', 503);

  const name = all ? 'Granny Flat Checklist — All stages' : 'Granny Flat Checklist — ' + STAGES[stage];
  try {
    const session = await stripe(env, 'POST', 'checkout/sessions', {
      mode: 'payment',
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': 'nzd',
      'line_items[0][price_data][unit_amount]': String(all ? PRICE_ALL : PRICE_STAGE),
      'line_items[0][price_data][product_data][name]': name,
      'metadata[stage]': all ? 'all' : stage,
      success_url: url.origin + '/api/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: url.origin + '/buy.html?stage=' + (all ? 'foundations' : stage),
    });
    return Response.redirect(session.url, 303);
  } catch (e) {
    return text('Sorry, the payment page could not be opened: ' + e.message, 502);
  }
}

async function success(url, request, env) {
  const id = url.searchParams.get('session_id') || '';
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return text('Missing payment reference', 400);
  let session;
  try { session = await stripe(env, 'GET', 'checkout/sessions/' + encodeURIComponent(id)); }
  catch (e) { return text('Sorry, the payment could not be confirmed: ' + e.message, 502); }
  if (session.payment_status !== 'paid') return text('This payment has not been completed.', 402);

  const bought = session.metadata && session.metadata.stage;
  if (bought !== 'all' && !STAGES[bought]) return text('Unknown stage on this payment', 400);
  const existing = await readPass(request, env);
  const stages = mergeStages(existing ? existing.s : [], [bought]);
  const token = await sign({ s: stages, e: Date.now() + PASS_DAYS * 864e5 }, env);
  const dest = url.origin + '/buy.html?paid=' + bought + '&key=' + encodeURIComponent(token);
  return redirectWithPass(dest, token);
}

async function unlock(url, request, env) {
  const incoming = await verify(url.searchParams.get('key') || '', env);
  if (!incoming) return text('This unlock link is not valid or has expired.', 400);
  const existing = await readPass(request, env);
  const stages = mergeStages(existing ? existing.s : [], incoming.s);
  const token = await sign({ s: stages, e: Math.max(incoming.e, existing ? existing.e : 0) }, env);
  return redirectWithPass(url.origin + '/', token);
}

async function accessInfo(request, env) {
  const pass = env.PAYWALL === 'on' ? await readPass(request, env) : null;
  return new Response(JSON.stringify({ paywall: env.PAYWALL === 'on', stages: pass ? pass.s : [] }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

/* ---------- Access passes ---------- */

function mergeStages(a, b) { const s = new Set([...a, ...b]); return s.has('all') ? ['all'] : [...s]; }

function redirectWithPass(dest, token) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: dest,
      'Set-Cookie': COOKIE + '=' + token + '; Path=/; Max-Age=' + PASS_DAYS * 86400 + '; Secure; HttpOnly; SameSite=Lax',
      'Cache-Control': 'no-store',
    },
  });
}

async function readPass(request, env) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)'));
  return m ? verify(m[1], env) : null;
}

const enc = new TextEncoder();
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

async function key(env) {
  return crypto.subtle.importKey('raw', enc.encode(env.ACCESS_SECRET || ''), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
async function sign(payload, env) {
  const body = b64u(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign('HMAC', await key(env), enc.encode(body));
  return body + '.' + b64u(sig);
}
async function verify(token, env) {
  if (!env.ACCESS_SECRET) return null;
  const [body, sig] = String(token).split('.');
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', await key(env), unb64u(sig), enc.encode(body));
    if (!ok) return null;
    const p = JSON.parse(new TextDecoder().decode(unb64u(body)));
    return p && Array.isArray(p.s) && p.e > Date.now() ? p : null;
  } catch (e) { return null; }
}

function text(msg, status) {
  return new Response(msg, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
}
