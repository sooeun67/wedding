import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 쿠키에서 토큰 가져오기
    const tokenCookie = request.cookies.get('google_tokens');
    
    if (!tokenCookie) {
      return NextResponse.json({
        authenticated: false,
        userInfo: null
      });
    }

    const tokens = JSON.parse(tokenCookie.value);
    
    if (!tokens.access_token) {
      return NextResponse.json({
        authenticated: false,
        userInfo: null
      });
    }
    
    // 사용자 정보 가져오기
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });
    
    if (!userInfoResponse.ok) {
      return NextResponse.json({
        authenticated: false,
        userInfo: null
      });
    }
    
    const userInfo = await userInfoResponse.json();
    
    return NextResponse.json({
      authenticated: true,
      userInfo: userInfo
    });

  } catch (error) {
    console.error('인증 상태 확인 오류:', error);
    return NextResponse.json({
      authenticated: false,
      userInfo: null
    });
  }
}
