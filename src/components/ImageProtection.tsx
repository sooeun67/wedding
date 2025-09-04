'use client';

import { useEffect } from 'react';

const ImageProtection = () => {
  useEffect(() => {
    // 모든 이미지에 우클릭 방지 및 드래그 방지 적용
    const protectImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // 우클릭 방지
        img.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          return false;
        });
        
        // 드래그 방지
        img.addEventListener('dragstart', (e) => {
          e.preventDefault();
          return false;
        });
        
        // 선택 방지
        img.style.userSelect = 'none';
        (img.style as any).webkitUserSelect = 'none';
        (img.style as any).mozUserSelect = 'none';
        (img.style as any).msUserSelect = 'none';
        
        // 드래그 속성 설정
        img.draggable = false;
      });
    };

    // 초기 실행
    protectImages();

    // DOM 변경 감지를 위한 MutationObserver
    const observer = new MutationObserver(() => {
      protectImages();
    });

    // body 전체를 관찰
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 키보드 단축키 방지 (F12, Ctrl+Shift+I, Ctrl+U 등)
    const preventDevTools = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (개발자 도구)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (콘솔)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (소스 보기)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+S (저장)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    // 키보드 이벤트 리스너 추가
    document.addEventListener('keydown', preventDevTools);

    // 마우스 우클릭 방지 (전체 페이지)
    const preventRightClick = (e: MouseEvent) => {
      // 이미지가 아닌 경우에만 우클릭 방지
      const target = e.target as HTMLElement;
      if (target.tagName !== 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', preventRightClick);

    // 정리 함수
    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', preventDevTools);
      document.removeEventListener('contextmenu', preventRightClick);
    };
  }, []);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

export default ImageProtection;
