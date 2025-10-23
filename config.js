/*
  Runtime config for AI Resume Screener frontend.
  - Picks webhook URL by env (local|prod|test)
  - Supports overrides via query params: ?env=prod&webhook=https%3A%2F%2Fexample.com%2Fhook
  - Safe for commit: placeholders are YOUR_KEY_VALUE.
*/
(function () {
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  // Decide env: query param wins; else localhost/file -> local; otherwise prod
  const qpEnv = (getQueryParam('env') || '').toLowerCase();
  const defaultEnv = (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:')
    ? 'local'
    : 'prod';
  const env = ['local', 'prod', 'test'].includes(qpEnv) ? qpEnv : defaultEnv;

  // Define URLs (fill these with real values locally using the helper script)
  const urls = {
    local: 'YOUR_KEY_VALUE',
    prod: 'https://ai-resume-screener-production.up.railway.app/webhook/ai-resume-upload',
    test: 'YOUR_KEY_VALUE',
  };

  // Allow a full override via ?webhook=<url>
  const override = getQueryParam('webhook');
  const webhookUrl = override || urls[env];

  window.APP_CONFIG = {
    env,
    urls,
    webhookUrl,
  };
})();
