import { NextRequest, NextResponse } from 'next/server';
import { uploadToGooglePhotos } from '../../../src/lib/google-photos';

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
    const result = await uploadToGooglePhotos(file, tokens);
    
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
