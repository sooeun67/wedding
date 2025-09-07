import { NextRequest, NextResponse } from 'next/server';
import { getUserInfo } from '../../../src/lib/google-auth';

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
    
    // 토큰이 유효한지 확인하고 사용자 정보 가져오기
    const userInfo = await getUserInfo(tokens);
    
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
