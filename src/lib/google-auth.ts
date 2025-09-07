// 클라이언트 사이드에서만 사용할 수 있는 Google OAuth 유틸리티

// Google OAuth 인증 URL 생성
export const getAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
  
  const scopes = [
    'https://www.googleapis.com/auth/photoslibrary.appendonly', // 사진 업로드만
    'https://www.googleapis.com/auth/userinfo.profile', // 기본 프로필 정보
    'https://www.googleapis.com/auth/userinfo.email' // 이메일 정보
  ];

  const params = new URLSearchParams({
    client_id: clientId || '',
    redirect_uri: redirectUri || '',
    response_type: 'code',
    scope: scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// 토큰으로 사용자 정보 가져오기 (클라이언트 사이드)
export const getUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('사용자 정보를 가져올 수 없습니다');
    }
    
    return await response.json();
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    throw error;
  }
};

// 토큰 갱신 (클라이언트 사이드)
export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });
    
    if (!response.ok) {
      throw new Error('토큰 갱신에 실패했습니다');
    }
    
    return await response.json();
  } catch (error) {
    console.error('토큰 갱신 오류:', error);
    throw error;
  }
};
