import { NextRequest, NextResponse } from 'next/server';
import { weddingConfig } from '@/src/config/wedding-config';

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

    // Google Photos API를 사용한 실제 업로드
    const arrayBuffer = await file.arrayBuffer();
    
    // 1단계: 업로드 URL 요청
    const uploadResponse = await fetch('https://photoslibrary.googleapis.com/v1/uploads', {
      method: 'POST',
      headers: {
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
    
    // 3단계: 앨범에 추가 (선택사항)
    if (result.newMediaItemResults && result.newMediaItemResults[0]?.mediaItem?.id) {
      const mediaItemId = result.newMediaItemResults[0].mediaItem.id;
      
      try {
        await fetch(`https://photoslibrary.googleapis.com/v1/albums/${weddingConfig.googlePhotos.albumId}:batchAddMediaItems`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mediaItemIds: [mediaItemId]
          })
        });
      } catch (albumError) {
        console.warn('앨범에 추가 실패 (업로드는 성공):', albumError);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `사진이 성공적으로 구글 포토 앨범 "${weddingConfig.googlePhotos.albumName}"에 업로드되었습니다!`,
      fileName: file.name,
      fileSize: file.size,
      uploadTime: new Date().toISOString(),
      albumId: weddingConfig.googlePhotos.albumId,
      albumUrl: `https://photos.google.com/album/${weddingConfig.googlePhotos.albumId}`
    });

  } catch (error) {
    console.error('업로드 오류:', error);
    return NextResponse.json(
      { error: '업로드 중 오류가 발생했습니다. 구글 포토 API 키가 필요할 수 있습니다.' },
      { status: 500 }
    );
  }
}
