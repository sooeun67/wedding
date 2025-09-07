import { getPhotosClient } from './google-auth';

// Google Photos에 사진 업로드
export const uploadToGooglePhotos = async (file: File, tokens: any) => {
  try {
    const photos = getPhotosClient(tokens);
    
    // 1단계: 파일을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    
    // 2단계: 업로드 URL 요청
    const uploadResponse = await photos.mediaItems.upload({
      requestBody: arrayBuffer,
    });
    
    const uploadToken = await uploadResponse.data;
    
    // 3단계: 미디어 아이템 생성
    const createResponse = await photos.mediaItems.batchCreate({
      requestBody: {
        newMediaItems: [{
          description: `결혼식 사진 - ${new Date().toLocaleDateString()}`,
          simpleMediaItem: {
            uploadToken: uploadToken
          }
        }]
      }
    });
    
    return createResponse.data;
  } catch (error) {
    console.error('Google Photos 업로드 오류:', error);
    throw error;
  }
};

// Google Photos에서 앨범 목록 가져오기
export const getAlbums = async (tokens: any) => {
  try {
    const photos = getPhotosClient(tokens);
    const response = await photos.albums.list();
    return response.data.albums || [];
  } catch (error) {
    console.error('앨범 목록 가져오기 오류:', error);
    throw error;
  }
};

// 특정 앨범에 사진 추가
export const addToAlbum = async (tokens: any, albumId: string, mediaItemId: string) => {
  try {
    const photos = getPhotosClient(tokens);
    const response = await photos.albums.batchAddMediaItems({
      albumId: albumId,
      requestBody: {
        mediaItemIds: [mediaItemId]
      }
    });
    return response.data;
  } catch (error) {
    console.error('앨범에 사진 추가 오류:', error);
    throw error;
  }
};

// 새 앨범 생성
export const createAlbum = async (tokens: any, title: string) => {
  try {
    const photos = getPhotosClient(tokens);
    const response = await photos.albums.create({
      requestBody: {
        album: {
          title: title
        }
      }
    });
    return response.data;
  } catch (error) {
    console.error('앨범 생성 오류:', error);
    throw error;
  }
};
