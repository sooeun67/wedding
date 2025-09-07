import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 쿠키에서 토큰 가져오기
    const tokenCookie = request.cookies.get('google_tokens');
    
    if (!tokenCookie) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const tokens = JSON.parse(tokenCookie.value);
    
    if (!tokens.access_token) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다' },
        { status: 401 }
      );
    }
    
    // FormData에서 파일 가져오기
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '파일이 필요합니다' },
        { status: 400 }
      );
    }

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 10MB를 초과할 수 없습니다' },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '이미지 파일만 업로드 가능합니다' },
        { status: 400 }
      );
    }

    // Google Photos에 업로드
    const arrayBuffer = await file.arrayBuffer();
    
    // 1단계: 업로드 URL 요청
    const uploadResponse = await fetch('https://photoslibrary.googleapis.com/v1/uploads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/octet-stream',
        'X-Goog-Upload-Protocol': 'raw',
        'X-Goog-Upload-File-Name': file.name
      },
      body: arrayBuffer
    });
    
    if (!uploadResponse.ok) {
      throw new Error('업로드 URL 요청에 실패했습니다');
    }
    
    const uploadToken = await uploadResponse.text();
    
    // 2단계: 미디어 아이템 생성
    const createResponse = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newMediaItems: [{
          description: `결혼식 사진 - ${new Date().toLocaleDateString()}`,
          simpleMediaItem: {
            uploadToken: uploadToken
          }
        }]
      })
    });
    
    if (!createResponse.ok) {
      throw new Error('미디어 아이템 생성에 실패했습니다');
    }
    
    const result = await createResponse.json();
    
    return NextResponse.json({
      success: true,
      data: result,
      message: '사진이 성공적으로 업로드되었습니다'
    });

  } catch (error) {
    console.error('업로드 오류:', error);
    return NextResponse.json(
      { error: '업로드 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
