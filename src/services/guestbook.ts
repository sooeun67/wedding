// Firebase Firestore를 사용한 방명록 서비스
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface GuestbookEntry {
  id?: string;
  name: string;
  message: string;
  timestamp: number;
  createdAt?: any; // Firestore Timestamp
}

const COLLECTION_NAME = 'guestbook';

// 방명록 추가
export const addGuestbookEntry = async (name: string, message: string): Promise<boolean> => {
  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      name: name.trim(),
      message: message.trim(),
      timestamp: Date.now(),
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('방명록 추가 실패:', error);
    return false;
  }
};

// 모든 방명록 가져오기 (최신순)
export const getGuestbookEntries = async (): Promise<GuestbookEntry[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      orderBy('createdAt', 'desc'),
      limit(100) // 최대 100개
    );
    
    const querySnapshot = await getDocs(q);
    const entries: GuestbookEntry[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      entries.push({
        id: doc.id,
        name: data.name,
        message: data.message,
        timestamp: data.timestamp || Date.now(),
        createdAt: data.createdAt
      });
    });
    
    return entries;
  } catch (error) {
    console.error('방명록 조회 실패:', error);
    return [];
  }
};

// 실시간 방명록 리스너 (새 메시지가 추가되면 자동 업데이트)
export const subscribeToGuestbook = (
  callback: (entries: GuestbookEntry[]) => void
): (() => void) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entries: GuestbookEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          name: data.name,
          message: data.message,
          timestamp: data.timestamp || Date.now(),
          createdAt: data.createdAt
        });
      });
      
      callback(entries);
    }, (error) => {
      console.error('실시간 방명록 업데이트 실패:', error);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('방명록 리스너 설정 실패:', error);
    return () => {};
  }
};

// 로컬스토리지에서 Firebase로 데이터 마이그레이션 (기존 데이터 보존)
export const migrateLocalStorageToFirebase = async (): Promise<void> => {
  try {
    const localData = localStorage.getItem('wedding-guestbook');
    if (!localData) return;
    
    const entries = JSON.parse(localData);
    if (!Array.isArray(entries) || entries.length === 0) return;
    
    console.log('로컬 방명록을 Firebase로 마이그레이션 중...', entries.length, '개');
    
    // 각 엔트리를 Firebase에 추가
    for (const entry of entries) {
      await addDoc(collection(db, COLLECTION_NAME), {
        name: entry.name,
        message: entry.message,
        timestamp: entry.timestamp || Date.now(),
        createdAt: Timestamp.fromMillis(entry.timestamp || Date.now())
      });
    }
    
    // 마이그레이션 완료 후 로컬스토리지 클리어
    localStorage.removeItem('wedding-guestbook');
    console.log('마이그레이션 완료!');
    
  } catch (error) {
    console.error('마이그레이션 실패:', error);
  }
};

// Firebase 연결 상태 확인
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    await getDocs(query(collection(db, COLLECTION_NAME), limit(1)));
    return true;
  } catch (error) {
    console.error('Firebase 연결 실패:', error);
    return false;
  }
};
