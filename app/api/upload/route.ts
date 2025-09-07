import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

export async function POST(request: NextRequest) {
  try {
    // FormData에서 파일 가져오기
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '파일이 필요합니다' },
        { status: 400 }
      );
    }

    // 파일 크기 제한 (100MB - Google Drive 최대 크기)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기가 너무 큽니다. 100MB 이하로 업로드해주세요.' },
        { status: 400 }
      );
    }

    // 파일 타입 검증 (이미지 + 동영상)
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: '사진 또는 동영상 파일만 업로드 가능합니다' },
        { status: 400 }
      );
    }

    // Google Drive API 인증 설정
    const auth = new GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`
      },
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });

    // Google Drive 클라이언트 생성
    const drive = google.drive({ version: 'v3', auth });

    // 파일을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Google Drive에 파일 업로드
    const fileMetadata = {
      name: `${Date.now()}_${file.name}`,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID || '']
    };

    const media = {
      mimeType: file.type,
      body: buffer
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,name,webViewLink,size'
    });

    if (!response.data.id) {
      throw new Error('파일 업로드에 실패했습니다');
    }

    return NextResponse.json({
      success: true,
      message: '사진이 성공적으로 업로드되었습니다! 감사합니다.',
      fileName: file.name,
      fileSize: file.size,
      fileType: isImage ? 'image' : 'video',
      uploadTime: new Date().toISOString(),
      driveFileId: response.data.id,
      driveFileUrl: response.data.webViewLink,
      driveFileName: response.data.name
    });

  } catch (error) {
    console.error('업로드 오류:', error);
    return NextResponse.json(
      { error: '업로드 중 오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}