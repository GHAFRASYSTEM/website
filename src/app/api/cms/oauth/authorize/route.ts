import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

import {
  GITHUB_PROVIDER,
  STATE_COOKIE_MAX_AGE,
  STATE_COOKIE_NAME,
  getAuthorizeRouteHtml,
  getCmsOAuthConfig,
} from '@/lib/cms-oauth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get('provider')

  if (provider && provider !== GITHUB_PROVIDER) {
    return new Response('Unsupported OAuth provider.', { status: 400 })
  }

  let config

  try {
    config = getCmsOAuthConfig(request.url)
  } catch (error) {
    return new Response(error instanceof Error ? error.message : 'OAuth is misconfigured.', {
      status: 500,
    })
  }

  const state = crypto.randomUUID()
  const scope = request.nextUrl.searchParams.get('scope') || 'repo'
  const authorizeUrl = new URL('https://github.com/login/oauth/authorize')

  authorizeUrl.searchParams.set('client_id', config.clientId)
  authorizeUrl.searchParams.set('redirect_uri', config.callbackUrl)
  authorizeUrl.searchParams.set('scope', scope)
  authorizeUrl.searchParams.set('state', state)

  const cookieStore = await cookies()
  cookieStore.set(STATE_COOKIE_NAME, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    path: '/api/cms/oauth',
    maxAge: STATE_COOKIE_MAX_AGE,
  })

  return new Response(getAuthorizeRouteHtml(authorizeUrl.toString()), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}