'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

interface PhotoUploadSectionProps {
  bgColor?: 'white' | 'beige';
}

const PhotoUploadSection = ({ bgColor = 'white' }: PhotoUploadSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 파일 업로드 처리
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB를 초과할 수 없습니다');
      return;
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // 업로드 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        alert('사진이 성공적으로 구글 드라이브에 업로드되었습니다!');
        // 파일 입력 초기화
        event.target.value = '';
      } else {
        const error = await response.json();
        alert(`업로드 오류: ${error.error || '업로드 중 오류가 발생했습니다'}`);
      }
    } catch (error) {
      console.error('업로드 오류:', error);
      alert('업로드 중 오류가 발생했습니다');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <PhotoUploadSectionContainer $bgColor={bgColor}>
      <SectionTitle>사진 공유</SectionTitle>
      
      <UploadCard>
        <UploadIcon>📸</UploadIcon>
        <UploadTitle>결혼식 사진 공유</UploadTitle>
        <UploadDescription>
          결혼식 사진을 구글 드라이브 앨범에<br />
          업로드하여 공유해주세요
        </UploadDescription>

        <FileInputContainer>
          <HiddenFileInput
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            id="photo-upload"
          />
          <FileInputLabel htmlFor="photo-upload" $isUploading={isUploading}>
            {isUploading ? (
              <>
                <UploadSpinner />
                업로드 중... {uploadProgress}%
              </>
            ) : (
              <>
                <UploadIcon>📷</UploadIcon>
                사진 선택하기
              </>
            )}
          </FileInputLabel>
        </FileInputContainer>

        {isUploading && (
          <ProgressBar>
            <ProgressFill $progress={uploadProgress} />
          </ProgressBar>
        )}

        <UploadTips>
          <TipItem>• 이미지 파일만 업로드 가능합니다</TipItem>
          <TipItem>• 파일 크기는 10MB 이하로 제한됩니다</TipItem>
          <TipItem>• 업로드된 사진은 구글 드라이브에 저장됩니다</TipItem>
        </UploadTips>
      </UploadCard>
    </PhotoUploadSectionContainer>
  );
};

// 스타일드 컴포넌트들
const PhotoUploadSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
  padding: 4rem 1.5rem;
  text-align: center;
  background-color: ${props => props.$bgColor === 'beige' ? '#F8F6F2' : 'white'};
`;

const SectionTitle = styled.h2`
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
  font-weight: 500;
  font-size: 1.5rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--secondary-color);
  }
`;

const UploadCard = styled.div`
  max-width: 500px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid #f0f0f0;
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const UploadTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const UploadDescription = styled.p`
  color: #666;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FileInputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const HiddenFileInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileInputLabel = styled.label<{ $isUploading: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  background: ${props => props.$isUploading ? '#f0f0f0' : '#4285f4'};
  color: ${props => props.$isUploading ? '#666' : 'white'};
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: ${props => props.$isUploading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$isUploading ? '#f0f0f0' : '#3367d6'};
  }
`;

const UploadSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: #4285f4;
  transition: width 0.3s ease;
`;

const UploadTips = styled.div`
  text-align: left;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #4285f4;
`;

const TipItem = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export default PhotoUploadSection;
