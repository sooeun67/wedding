// Firebase 설정 및 초기화
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase 설정 - 여기에 본인의 Firebase 프로젝트 설정을 입력하세요
const firebaseConfig = {
  apiKey: "AIzaSyBcGqWsrXM_LSCRFhCWt4Z_xZ4cLKf0s2A",
  authDomain: "mobile-wedding-guestbook.firebaseapp.com",
  projectId: "mobile-wedding-guestbook",
  storageBucket: "mobile-wedding-guestbook.firebasestorage.app",
  messagingSenderId: "485704291357",
  appId: "1:485704291357:web:1c6c33e805e173033022f4"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

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
