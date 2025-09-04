// 카카오페이 딥링크 및 송금 관련 유틸리티 함수들

export interface BankInfo {
  bank: string;
  number: string;
  holder: string;
}

// 카카오페이 앱으로 이동하는 딥링크 함수
export const openKakaoPay = (bankInfo: BankInfo) => {
  const { bank, number, holder } = bankInfo;
  
  // 계좌번호를 클립보드에 복사
  copyAccountToClipboard(bankInfo);
  
  // 모바일 환경 체크
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // 카카오페이 앱 딥링크 시도
    const kakaopayUrl = `kakaopay://`;
    
    // 딥링크 시도 후 앱스토어로 이동하는 fallback 설정
    const timeout = setTimeout(() => {
      // 2초 후에도 페이지를 벗어나지 않았다면 앱이 설치되지 않은 것으로 판단
      window.location.href = getAppStoreUrl();
    }, 2000);
    
    // 페이지를 벗어날 때 타이머 클리어
    const clearTimeoutOnVisibilityChange = () => {
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', clearTimeoutOnVisibilityChange);
    };
    
    document.addEventListener('visibilitychange', clearTimeoutOnVisibilityChange);
    
    // 딥링크 실행
    window.location.href = kakaopayUrl;
    
    // 사용자에게 안내 메시지 표시
    setTimeout(() => {
      alert(`카카오페이로 이동합니다.\n\n계좌 정보가 복사되었습니다:\n${bank} ${number}\n예금주: ${holder}\n\n송금 시 위 정보를 사용해주세요.`);
    }, 100);
    
  } else {
    // 데스크톱에서는 QR코드나 안내 메시지 표시
    alert(`모바일에서 카카오페이를 이용해주세요.\n\n계좌 정보가 복사되었습니다:\n${bank} ${number}\n예금주: ${holder}`);
  }
};

// 계좌번호를 클립보드에 복사하는 함수
export const copyAccountToClipboard = (bankInfo: BankInfo): Promise<boolean> => {
  const { bank, number, holder } = bankInfo;
  const accountText = `${bank} ${number} ${holder}`;
  
  return navigator.clipboard.writeText(accountText).then(
    () => {
      return true;
    },
    (err) => {
      console.error('계좌번호 복사 실패:', err);
      // clipboard API가 실패하면 fallback 방법 시도
      return fallbackCopyTextToClipboard(accountText);
    }
  );
};

// Clipboard API 지원하지 않는 브라우저를 위한 fallback
const fallbackCopyTextToClipboard = (text: string): boolean => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // 화면에 보이지 않도록 설정
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback 복사 실패:', err);
    document.body.removeChild(textArea);
    return false;
  }
};

// 앱스토어 URL 반환 (iOS/Android 구분)
const getAppStoreUrl = (): string => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isIOS) {
    return 'https://apps.apple.com/kr/app/kakaopay/id1464496236';
  } else {
    return 'https://play.google.com/store/apps/details?id=com.kakaopay.app';
  }
};

// 카카오페이 QR코드 생성을 위한 데이터 포맷팅
export const formatAccountForQR = (bankInfo: BankInfo): string => {
  const { bank, number, holder } = bankInfo;
  return JSON.stringify({
    type: 'account',
    bank,
    number,
    holder,
    timestamp: Date.now()
  });
};

// 은행 코드 매핑 (필요 시 사용)
export const getBankCode = (bankName: string): string => {
  const bankCodes: Record<string, string> = {
    '국민은행': '004',
    '신한은행': '088',
    '우리은행': '020',
    '하나은행': '081',
    'KB국민은행': '004',
    '농협은행': '011',
    '기업은행': '003',
    'SC제일은행': '023',
    '카카오뱅크': '090',
    '토스뱅크': '092',
    'K뱅크': '089',
    '새마을금고': '045',
    '신협': '048',
    '우체국': '071',
    '수협은행': '007',
  };
  
  return bankCodes[bankName] || '';
};
