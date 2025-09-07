import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // 사용자가 권한을 거부한 경우
  if (error) {
    console.error('OAuth 오류:', error);
    return NextResponse.redirect(new URL('/?error=auth_denied', request.url));
  }

  if (code) {
    try {
      // 인증 코드로 토큰 교환
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || ''
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('토큰 교환에 실패했습니다');
      }

      const tokens = await tokenResponse.json();
      
      // 토큰을 쿠키에 저장
      const response = NextResponse.redirect(new URL('/?auth=success', request.url));
      
      response.cookies.set('google_tokens', JSON.stringify(tokens), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7일
      });
      
      return response;
    } catch (error) {
      console.error('OAuth 토큰 교환 오류:', error);
      return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
    }
  }

  return NextResponse.redirect(new URL('/?error=no_code', request.url));
}
