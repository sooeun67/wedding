import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 환경 변수 확인
    console.log('Environment variables check:');
    console.log('GOOGLE_DRIVE_API_KEY:', process.env.GOOGLE_DRIVE_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('GOOGLE_DRIVE_FOLDER_ID:', process.env.GOOGLE_DRIVE_FOLDER_ID ? '✅ Set' : '❌ Missing');

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

    // 파일을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Google Drive API로 파일 업로드
    console.log('Uploading to Google Drive...');
    
    const fileName = `${Date.now()}_${file.name}`;
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

    // 1단계: 업로드 URL 요청
    const uploadResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=media&key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type,
        'Content-Length': buffer.length.toString()
      },
      body: buffer
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Upload failed:', errorText);
      throw new Error(`업로드 실패: ${uploadResponse.status}`);
    }

    const uploadResult = await uploadResponse.json();
    console.log('Upload result:', uploadResult);

    // 2단계: 파일 메타데이터 업데이트 (폴더에 추가)
    const updateResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${uploadResult.id}?key=${apiKey}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: fileName,
        parents: [folderId]
      })
    });

    if (!updateResponse.ok) {
      console.warn('폴더 추가 실패, 하지만 업로드는 성공');
    }

    return NextResponse.json({
      success: true,
      message: '사진이 성공적으로 업로드되었습니다! 감사합니다.',
      fileName: file.name,
      fileSize: file.size,
      fileType: isImage ? 'image' : 'video',
      uploadTime: new Date().toISOString(),
      driveFileId: uploadResult.id,
      driveFileUrl: `https://drive.google.com/file/d/${uploadResult.id}/view`
    });

  } catch (error) {
    console.error('업로드 오류 상세:', error);
    
    // 에러 타입 안전하게 처리
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('Error message:', errorMessage);
    
    // 구체적인 에러 메시지 반환
    let userMessage = '업로드 중 오류가 발생했습니다. 다시 시도해주세요.';
    
    if (errorMessage.includes('403')) {
      userMessage = 'Google Drive API 키 권한이 없습니다. 관리자에게 문의하세요.';
    } else if (errorMessage.includes('404')) {
      userMessage = 'Google Drive 폴더를 찾을 수 없습니다. 관리자에게 문의하세요.';
    } else if (errorMessage.includes('401')) {
      userMessage = 'Google Drive API 키가 유효하지 않습니다. 관리자에게 문의하세요.';
    }
    
    return NextResponse.json(
      { error: userMessage },
      { status: 500 }
    );
  }
}