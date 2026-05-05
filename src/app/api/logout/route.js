import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })

    response.cookies.set('auth_token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Logout failed:', error)

    return NextResponse.json(
      { success: false, message: 'Logout failed' },
      { status: 500 }
    )
  }
}