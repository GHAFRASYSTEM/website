import { NextRequest, NextResponse } from 'next/server'

const STATE_COOKIE = 'decap_oauth_state'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function renderPage({
  title,
  description,
  message,
}: {
  title: string
  description: string
  message?: string
}) {
  const script = message
    ? `
      <script>
        const sendMessage = () => {
          window.opener.postMessage(${JSON.stringify(message)}, '*')
          window.removeEventListener('message', sendMessage, false)
          window.setTimeout(() => window.close(), 100)
        }

        window.addEventListener('message', sendMessage, false)
        window.opener.postMessage('authorizing:github', '*')
      </script>
    `
    : ''

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    ${script}
  </head>
  <body style="font-family: Arial, sans-serif; padding: 24px; line-height: 1.5;">
    <p>${description}</p>
  </body>
</html>`
}

function htmlResponse(html: string, status = 200) {
  return new NextResponse(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  })
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return htmlResponse(
      renderPage({
        title: 'Missing GitHub OAuth configuration',
        description:
          'The CMS OAuth flow is not configured yet. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Vercel.',
      }),
      500,
    )
  }

  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const storedState = request.cookies.get(STATE_COOKIE)?.value

  if (!code || !state || !storedState || state !== storedState) {
    return htmlResponse(
      renderPage({
        title: 'GitHub authorization failed',
        description:
          'The OAuth state was invalid or missing. Please close this window and try again.',
      }),
      400,
    )
  }

  const tokenResponse = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${request.nextUrl.origin}/api/callback`,
        state,
      }),
      cache: 'no-store',
    },
  )

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string
    error?: string
    error_description?: string
  }

  if (!tokenResponse.ok || !tokenData.access_token) {
    const description =
      tokenData.error_description ||
      tokenData.error ||
      'GitHub did not return an access token.'

    return htmlResponse(
      renderPage({
        title: 'GitHub authorization failed',
        description,
      }),
      400,
    )
  }

  const response = htmlResponse(
    renderPage({
      title: 'Authorizing Decap CMS',
      description: 'Authorization complete. You can close this window.',
      message: `authorization:github:success:${JSON.stringify({ token: tokenData.access_token })}`,
    }),
  )

  response.cookies.set({
    name: STATE_COOKIE,
    value: '',
    httpOnly: true,
    secure: request.nextUrl.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}
