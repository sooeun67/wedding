import { NextRequest, NextResponse } from 'next/server';
import { oauth2Client } from '../../../src/lib/google-auth';

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
      const { tokens } = await oauth2Client.getToken(code);
      
      // 토큰을 쿠키에 저장 (보안상 암호화 권장)
      const response = NextResponse.redirect(new URL('/?auth=success', request.url));
      
      // 토큰을 쿠키에 저장
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
