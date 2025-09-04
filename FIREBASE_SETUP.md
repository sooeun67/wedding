# 🔥 Firebase 방명록 설정 가이드

## 1. 📦 Firebase 패키지 설치

```bash
npm install firebase
```

## 2. 🌐 Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. **"프로젝트 추가"** 클릭
3. 프로젝트 이름 입력 (예: `my-wedding-guestbook`)
4. Google Analytics는 선택사항 (끄셔도 됩니다)
5. 프로젝트 생성 완료

## 3. 🔧 웹 앱 등록

1. Firebase 프로젝트 대시보드에서 **"웹"** 아이콘 클릭
2. 앱 닉네임 입력 (예: `Wedding Website`)
3. **"앱 등록"** 클릭
4. **설정 정보 복사** (firebaseConfig 객체)

## 4. 📝 설정 정보 입력

`src/lib/firebase.ts` 파일에서 설정 정보 교체:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 5. 🗄️ Firestore 데이터베이스 설정

1. Firebase Console → **"Firestore Database"**
2. **"데이터베이스 만들기"** 클릭
3. **"테스트 모드에서 시작"** 선택 (나중에 보안 규칙 수정 가능)
4. 지역 선택 (asia-northeast3 - 서울 추천)

## 6. 🔒 보안 규칙 설정 (중요!)

Firestore → **"규칙"** 탭에서 다음 규칙 적용:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 방명록 읽기는 모두 허용, 쓰기는 인증된 사용자만
    match /guestbook/{document} {
      allow read: if true;
      allow create: if request.auth == null && 
        request.resource.data.keys().hasAll(['name', 'message', 'timestamp', 'createdAt']) &&
        request.resource.data.name is string &&
        request.resource.data.message is string &&
        request.resource.data.name.size() > 0 &&
        request.resource.data.name.size() <= 50 &&
        request.resource.data.message.size() > 0 &&
        request.resource.data.message.size() <= 200;
      allow update, delete: if false; // 수정/삭제 금지
    }
  }
}
```

## 7. 🚀 배포 및 테스트

1. 프로젝트 빌드: `npm run build`
2. 배포 후 방명록 테스트
3. 다른 브라우저/기기에서 실시간 동기화 확인

## 8. 📊 모니터링

Firebase Console에서 확인 가능:
- **Firestore**: 저장된 방명록 데이터
- **Usage**: 사용량 모니터링
- **Performance**: 성능 지표

## 🎯 완성!

이제 **전 세계 어디서든** 방명록이 실시간으로 공유됩니다! 🌍✨

### 주요 기능:
- ✅ 실시간 동기화
- ✅ 자동 백업 
- ✅ 무료 사용 (월 50,000회 읽기)
- ✅ 기존 로컬 데이터 자동 마이그레이션
- ✅ Firebase 연결 실패 시 로컬 저장 백업

---

**문제가 있으면 브라우저 콘솔을 확인하세요!** 🔍
