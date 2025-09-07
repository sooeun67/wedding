// 클라이언트 사이드에서 Google Photos API 사용

// Google Photos에 사진 업로드
export const uploadToGooglePhotos = async (file: File, accessToken: string) => {
  try {
    // 1단계: 파일을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    
    // 2단계: 업로드 URL 요청
    const uploadResponse = await fetch('https://photoslibrary.googleapis.com/v1/uploads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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
    
    // 3단계: 미디어 아이템 생성
    const createResponse = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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
    
    return await createResponse.json();
  } catch (error) {
    console.error('Google Photos 업로드 오류:', error);
    throw error;
  }
};

// Google Photos에서 앨범 목록 가져오기
export const getAlbums = async (accessToken: string) => {
  try {
    const response = await fetch('https://photoslibrary.googleapis.com/v1/albums', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('앨범 목록을 가져올 수 없습니다');
    }
    
    const data = await response.json();
    return data.albums || [];
  } catch (error) {
    console.error('앨범 목록 가져오기 오류:', error);
    throw error;
  }
};

// 특정 앨범에 사진 추가
export const addToAlbum = async (accessToken: string, albumId: string, mediaItemId: string) => {
  try {
    const response = await fetch(`https://photoslibrary.googleapis.com/v1/albums/${albumId}:batchAddMediaItems`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mediaItemIds: [mediaItemId]
      })
    });
    
    if (!response.ok) {
      throw new Error('앨범에 사진 추가에 실패했습니다');
    }
    
    return await response.json();
  } catch (error) {
    console.error('앨범에 사진 추가 오류:', error);
    throw error;
  }
};

// 새 앨범 생성
export const createAlbum = async (accessToken: string, title: string) => {
  try {
    const response = await fetch('https://photoslibrary.googleapis.com/v1/albums', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        album: {
          title: title
        }
      })
    });
    
    if (!response.ok) {
      throw new Error('앨범 생성에 실패했습니다');
    }
    
    return await response.json();
  } catch (error) {
    console.error('앨범 생성 오류:', error);
    throw error;
  }
};
