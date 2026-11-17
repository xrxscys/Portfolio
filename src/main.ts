import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

trackVisit();

// Pings the Netlify function once per browser session (skipped on localhost).
function trackVisit() {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;
  try {
    if (sessionStorage.getItem('visit-tracked')) return;
    sessionStorage.setItem('visit-tracked', '1');
  } catch {}
  fetch('/api/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: location.pathname, referrer: document.referrer }),
    keepalive: true,
  }).catch(() => {});
}
