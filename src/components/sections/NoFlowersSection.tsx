'use client';

import React from 'react';
import styled from 'styled-components';

interface NoFlowersSectionProps {
  bgColor?: 'white' | 'beige';
}

const NoFlowersSection = ({ bgColor = 'white' }: NoFlowersSectionProps) => {
  return (
    <NoFlowersSectionContainer $bgColor={bgColor}>
      <ContentContainer>
        <FlowerIcon>🌷</FlowerIcon>
        <MessageContainer>
          <MainMessage>축하 화한 안내</MainMessage>
          <SubMessage>
            식장 사정에 따라<br />
            화환은 정중히 사양합니다.<br />
            축하해 주시는 마음만 감사히 받겠습니다.
          </SubMessage>
        </MessageContainer>
      </ContentContainer>
    </NoFlowersSectionContainer>
  );
};

const NoFlowersSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
  padding: 3rem 1.5rem;
  background-color: ${props => props.$bgColor === 'beige' ? '#F8F6F2' : 'white'};
`;

const ContentContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  background: white;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
  
  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
  }
`;

const FlowerIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MainMessage = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  line-height: 1.5;
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const SubMessage = styled.div`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export default NoFlowersSection;
