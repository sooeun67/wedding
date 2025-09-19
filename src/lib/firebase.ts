// Firebase 설정 및 초기화
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase 설정 - 환경 변수에서 불러오기
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Firebase 앱 초기화 (설정 값 검증)
let app;
try {
  // 필수 설정값 확인
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Firebase 설정이 완료되지 않았습니다. .env.local 파일을 확인하세요.');
  }
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase 초기화 실패:', error);
  throw error;
}

// Firestore 데이터베이스 초기화
export const db = getFirestore(app);

// 개발 환경에서만 에뮬레이터 사용 (선택사항)
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // 에뮬레이터는 한 번만 연결
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    // 이미 연결된 경우 에러 무시
  }
}

export default app;
