/*
  Runtime config for AI Resume Screener frontend.
  - local  → direct n8n webhook-test (localhost)
  - prod   → Netlify Function proxy
  - test   → optional override
*/
(function () {
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  const qpEnv = (getQueryParam('env') || '').toLowerCase();
  const defaultEnv =
    location.protocol === 'file:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1'
      ? 'local'
      : 'prod';

  const env = ['local', 'prod', 'test'].includes(qpEnv) ? qpEnv : defaultEnv;

  // 🔹 URLs per environment
  const urls = {
    // LOCAL → direct n8n test webhook
    local: '://localhost:5678/webhook-test/ai-resume-upload',

    // PROD → Netlify Function proxy
    prod: `${location.origin}/.netlify/functions/upload`,

    // Optional
    test: 'YOUR_KEY_VALUE',
  };

  // Allow override: ?webhook=https://example.com/hook
  const override = getQueryParam('webhook');
  const webhookUrl = override || urls[env];

  window.APP_CONFIG = {
    env,
    urls,
    webhookUrl,
  };

  console.log('[APP_CONFIG]', window.APP_CONFIG);
})();
