'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { weddingConfig } from '../../config/wedding-config';

interface VideoSectionProps {
  bgColor?: 'white' | 'beige';
}

const VideoSection = ({ bgColor = 'white' }: VideoSectionProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // 동영상이 설정되지 않은 경우 섹션을 렌더링하지 않음
  if (!weddingConfig.video?.enabled || !weddingConfig.video?.url) {
    return null;
  }

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <VideoSectionContainer $bgColor={bgColor}>
      <VideoContent>
        <VideoTitle>{weddingConfig.video.title}</VideoTitle>
        <VideoDescription>
          {weddingConfig.video.description}
        </VideoDescription>
        
        <VideoWrapper>
          {!isVideoLoaded && (
            <VideoPlaceholder>
              <LoadingSpinner />
              <LoadingText>영상을 불러오는 중...</LoadingText>
            </VideoPlaceholder>
          )}
          
          <VideoContainer>
            <VideoIframe
              src={weddingConfig.video.url}
              title="웨딩 영상"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={handleVideoLoad}
              style={{ opacity: isVideoLoaded ? 1 : 0 }}
            />
          </VideoContainer>
        </VideoWrapper>
        
        <VideoCaption>
          💝 소중한 순간들을 함께 나누고 싶습니다
        </VideoCaption>
      </VideoContent>
    </VideoSectionContainer>
  );
};

const VideoSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
  padding: 4rem 1.5rem;
  text-align: center;
  background-color: ${props => props.$bgColor === 'beige' ? '#F8F6F2' : 'white'};
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const VideoContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const VideoTitle = styled.h2`
  font-family: 'PlayfairDisplay', serif;
  font-size: 2.5rem;
  color: var(--text-dark);
  margin-bottom: 1rem;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const VideoDescription = styled.p`
  font-size: 1.1rem;
  color: var(--text-medium);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: #000;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 비율 */
`;

const VideoIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  transition: opacity 0.5s ease;
`;

const VideoPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  z-index: 1;
`;

const LoadingSpinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--secondary-color);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: var(--text-medium);
  font-size: 1rem;
  margin: 0;
`;

const VideoCaption = styled.p`
  font-size: 1rem;
  color: var(--text-light);
  font-style: italic;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export default VideoSection;
