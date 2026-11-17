// Forwards a visit ping from the site to a Discord webhook.
// Set DISCORD_WEBHOOK_URL in Netlify: Site configuration > Environment variables.

const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom|uptime/i;

export default async (req, context) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return new Response('Not configured', { status: 500 });

  const ua = req.headers.get('user-agent') ?? 'unknown';
  if (BOT_UA.test(ua)) return new Response(null, { status: 204 });

  let body = {};
  try {
    body = await req.json();
  } catch {}

  const geo = context.geo ?? {};
  const location =
    [geo.city, geo.subdivision?.name, geo.country?.name].filter(Boolean).join(', ') || 'unknown';
  const clip = (s, n = 200) => String(s ?? '').slice(0, n) || 'direct';

  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [
        {
          title: 'New portfolio visit',
          color: 0x5865f2,
          fields: [
            { name: 'Page', value: clip(body.path, 100), inline: true },
            { name: 'Location', value: location, inline: true },
            { name: 'Referrer', value: clip(body.referrer) },
            { name: 'Device', value: clip(ua) },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });

  return new Response(null, { status: 204 });
};

export const config = { path: '/api/visit' };
