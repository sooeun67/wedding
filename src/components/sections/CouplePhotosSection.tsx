'use client';

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

interface CouplePhotosSectionProps {
  bgColor?: 'white' | 'beige';
}

const CouplePhotosSection = ({ bgColor = 'white' }: CouplePhotosSectionProps) => {
  return (
    <CouplePhotosSectionContainer $bgColor={bgColor}>
      <PhotosContainer>
        <PhotoWrapper>
          <CircularImageContainer>
            <CircularImage 
              src="/images/groom-child.jpg"
              alt="신랑 어릴 때 사진"
              fill
              sizes="150px"
              style={{ objectFit: 'cover' }}
            />
          </CircularImageContainer>
          <NameContainer>
            <RoleText $isGroom={true}>신랑</RoleText>
            <NameText>엄규철</NameText>
          </NameContainer>
        </PhotoWrapper>

        <HeartContainer>
          💖
        </HeartContainer>

        <PhotoWrapper>
          <CircularImageContainer>
            <CircularImage 
              src="/images/bride-child.jpg"
              alt="신부 어릴 때 사진"
              fill
              sizes="150px"
              style={{ objectFit: 'cover' }}
            />
          </CircularImageContainer>
          <NameContainer>
            <RoleText $isGroom={false}>신부</RoleText>
            <NameText>김유진</NameText>
          </NameContainer>
        </PhotoWrapper>
      </PhotosContainer>
    </CouplePhotosSectionContainer>
  );
};

const CouplePhotosSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
  padding: 3rem 1.5rem;
  text-align: center;
  background-color: ${props => props.$bgColor === 'beige' ? '#F8F6F2' : 'white'};
`;

const PhotosContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  max-width: 500px;
  margin: 0 auto;
  
  @media (max-width: 480px) {
    gap: 1.5rem;
  }
  
  @media (max-width: 400px) {
    gap: 1rem;
  }
`;

const PhotoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const CircularImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #f0f0f0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }
  
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
    border-width: 3px;
  }
  
  @media (max-width: 400px) {
    width: 80px;
    height: 80px;
    border-width: 2px;
  }
`;

const CircularImage = styled(Image)`
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const HeartContainer = styled.div`
  font-size: 2.5rem;
  animation: heartbeat 2s ease-in-out infinite;
  
  @keyframes heartbeat {
    0% {
      transform: scale(1);
    }
    14% {
      transform: scale(1.1);
    }
    28% {
      transform: scale(1);
    }
    42% {
      transform: scale(1.1);
    }
    70% {
      transform: scale(1);
    }
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
  
  @media (max-width: 400px) {
    font-size: 1.5rem;
  }
`;

const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const RoleText = styled.span<{ $isGroom: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.$isGroom ? '#4A90E2' : '#E74C3C'};
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const NameText = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  
  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

export default CouplePhotosSection;
