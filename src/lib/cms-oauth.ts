const GITHUB_PROVIDER = 'github'

const STATE_COOKIE_NAME = 'decap-cms-github-oauth-state'
const STATE_COOKIE_MAX_AGE = 60 * 10

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderPage(script: string, message: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>GHAFRA CMS Authentication</title>
  </head>
  <body>
    <p>${escapeHtml(message)}</p>
    <script>
${script}
    </script>
  </body>
</html>`
}

export function getCmsOAuthConfig(requestUrl: string) {
  const clientId = process.env.CMS_GITHUB_CLIENT_ID
  const clientSecret = process.env.CMS_GITHUB_CLIENT_SECRET
  const callbackUrl =
    process.env.CMS_OAUTH_CALLBACK_URL ??
    new URL('/api/cms/oauth/callback', requestUrl).toString()

  if (!clientId) {
    throw new Error('Missing CMS_GITHUB_CLIENT_ID environment variable.')
  }

  if (!clientSecret) {
    throw new Error('Missing CMS_GITHUB_CLIENT_SECRET environment variable.')
  }

  return {
    clientId,
    clientSecret,
    callbackUrl,
  }
}

export function getAuthorizeRouteHtml(authorizeUrl: string) {
  const script = `const authorizeUrl = ${JSON.stringify(authorizeUrl)};
const handshakeMessage = ${JSON.stringify(`authorizing:${GITHUB_PROVIDER}`)};
let hasRedirected = false;

function redirectToProvider() {
  if (hasRedirected) {
    return;
  }

  hasRedirected = true;
  window.location.replace(authorizeUrl);
}

if (!window.opener) {
  document.body.innerHTML = '<p>Unable to reach the Decap CMS window. Close this popup and try again.</p>';
} else {
  const fallbackTimer = window.setTimeout(redirectToProvider, 1500);

  window.addEventListener(
    'message',
    event => {
      if (event.data !== handshakeMessage) {
        return;
      }

      window.clearTimeout(fallbackTimer);
      redirectToProvider();
    },
    { once: true },
  );

  window.opener.postMessage(handshakeMessage, '*');
}`

  return renderPage(script, 'Connecting to GitHub for Decap CMS login...')
}

export function getCallbackRouteHtml(result: { token?: string; error?: string }) {
  const message = result.error
    ? `authorization:${GITHUB_PROVIDER}:error:${JSON.stringify({ message: result.error })}`
    : `authorization:${GITHUB_PROVIDER}:success:${JSON.stringify({ token: result.token })}`

  const script = `const message = ${JSON.stringify(message)};

if (window.opener) {
  window.opener.postMessage(message, '*');
  window.close();
}

document.body.innerHTML = '<p>You can close this window and return to the CMS.</p>';`

  return renderPage(script, 'Finalizing GitHub authentication...')
}

export { GITHUB_PROVIDER, STATE_COOKIE_MAX_AGE, STATE_COOKIE_NAME }