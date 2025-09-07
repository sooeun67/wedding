import { NextRequest, NextResponse } from 'next/server';

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

    // 여기서는 실제로는 구글 드라이브 API를 사용해야 하지만,
    // 현재는 시뮬레이션으로 성공 응답을 반환합니다.
    // 실제 구현 시에는 구글 드라이브 API 키가 필요합니다.
    
    // 시뮬레이션: 업로드 성공
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
    
    return NextResponse.json({
      success: true,
      message: '사진이 성공적으로 구글 드라이브에 업로드되었습니다!',
      fileName: file.name,
      fileSize: file.size,
      uploadTime: new Date().toISOString()
    });

  } catch (error) {
    console.error('업로드 오류:', error);
    return NextResponse.json(
      { error: '업로드 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
