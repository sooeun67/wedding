import { google } from 'googleapis';

// OAuth 2.0 클라이언트 설정
export const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
);

// Google OAuth 인증 URL 생성
export const getAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/photoslibrary.appendonly', // 사진 업로드만
    'https://www.googleapis.com/auth/userinfo.profile', // 기본 프로필 정보
    'https://www.googleapis.com/auth/userinfo.email' // 이메일 정보
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent' // 사용자에게 권한 요청
  });
};

// 토큰으로 사용자 정보 가져오기
export const getUserInfo = async (tokens: any) => {
  oauth2Client.setCredentials(tokens);
  
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();
  
  return userInfo.data;
};

// Google Photos API 클라이언트 생성
export const getPhotosClient = (tokens: any) => {
  oauth2Client.setCredentials(tokens);
  return google.photoslibrary({ version: 'v1', auth: oauth2Client });
};

// 토큰 갱신
export const refreshToken = async (refreshToken: string) => {
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });
  
  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials;
};
