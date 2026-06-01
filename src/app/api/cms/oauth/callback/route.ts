import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

import { STATE_COOKIE_NAME, getCallbackRouteHtml, getCmsOAuthConfig } from '@/lib/cms-oauth'

export const dynamic = 'force-dynamic'

function htmlResponse(result: { token?: string; error?: string }, status = 200) {
  return new Response(getCallbackRouteHtml(result), {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const expectedState = cookieStore.get(STATE_COOKIE_NAME)?.value

  cookieStore.delete(STATE_COOKIE_NAME)

  const oauthError = request.nextUrl.searchParams.get('error')
  const oauthErrorDescription = request.nextUrl.searchParams.get('error_description')

  if (oauthError) {
    return htmlResponse(
      {
        error: oauthErrorDescription
          ? `${oauthError}: ${oauthErrorDescription}`
          : oauthError,
      },
      400,
    )
  }

  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')

  if (!code || !state) {
    return htmlResponse({ error: 'Missing OAuth code or state.' }, 400)
  }

  if (!expectedState || state !== expectedState) {
    return htmlResponse({ error: 'Invalid OAuth state.' }, 400)
  }

  let config

  try {
    config = getCmsOAuthConfig(request.url)
  } catch (error) {
    return htmlResponse(
      {
        error: error instanceof Error ? error.message : 'OAuth is misconfigured.',
      },
      500,
    )
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.callbackUrl,
      state,
    }),
    cache: 'no-store',
  })

  const tokenPayload = (await tokenResponse.json()) as {
    access_token?: string
    error?: string
    error_description?: string
  }

  if (!tokenResponse.ok || tokenPayload.error || !tokenPayload.access_token) {
    return htmlResponse(
      {
        error:
          tokenPayload.error_description ||
          tokenPayload.error ||
          'GitHub did not return an access token.',
      },
      400,
    )
  }

  return htmlResponse({ token: tokenPayload.access_token })
}