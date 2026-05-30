import { randomBytes } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

const STATE_COOKIE = 'decap_oauth_state'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID

  if (!clientId) {
    return new NextResponse('Missing GITHUB_CLIENT_ID environment variable.', {
      status: 500,
    })
  }

  const state = randomBytes(16).toString('hex')
  const redirectUri = `${request.nextUrl.origin}/api/callback`
  const scope = process.env.GITHUB_OAUTH_SCOPE || 'repo,user'

  const authUrl = new URL('https://github.com/login/oauth/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', scope)
  authUrl.searchParams.set('state', state)

  const response = NextResponse.redirect(authUrl)
  response.cookies.set({
    name: STATE_COOKIE,
    value: state,
    httpOnly: true,
    secure: request.nextUrl.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  })

  return response
}
