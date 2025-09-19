const uniqueIdentifier = "JWK-WEDDING-TEMPLATE-V1";

// 갤러리 레이아웃 타입 정의
type GalleryLayout = "scroll" | "grid";
type GalleryPosition = "middle" | "bottom";

interface GalleryConfig {
  layout: GalleryLayout;
  position: GalleryPosition;
  images: string[];
}

export const weddingConfig = {
  // 메타 정보
  meta: {
    title: "남석윤 ❤️ 오수은의 결혼식에 초대합니다",
    description: "결혼식 초대장",
    ogImage: "/images/thumbnail.jpg",
    noIndex: true,
    _jwk_watermark_id: uniqueIdentifier,
  },

  // 메인 화면
  main: {
    title: "Wedding Invitation",
    image: "/images/main.jpg",
    date: "2025년 11월 22일 토요일 오후 5시 30분",
    venue: "엘리에나 호텔",
  },

  // 소개글
  intro: {
    title: "",
    text: "서로 다른 길을 걸어온 저희가\n사랑이라는 이름으로 만나\n\n이제 하나의 길을 함께 걸어가고자 합니다.\n\n저희의 소중한 첫걸음을\n지켜봐 주시고 축복해 주세요."
  },

  // 결혼식 일정
  date: {
    year: 2025,
    month: 11,
    day: 22,
    hour: 17,
    minute: 30,
    displayDate: "2025.11.22 SAT PM 5:30",
  },

  // 장소 정보
  venue: {
    name: "엘리에나 호텔",
    
    address: "서울 강남구 논현로 645 엘리에나 호텔\n2층 컨퍼런스 홀",
    tel: "02-3443-5670",
    naverMapId: "엘리에나호텔", // 네이버 지도 검색용 장소명
    coordinates: {
      latitude: 37.511255, 
      longitude: 127.031676,
    },

    placeId: "34291584", // 네이버 지도 장소 ID
    mapZoom: "15", // 지도 줌 레벨 (한 칸 축소)
    mapNaverCoordinates: "14141300,4507203,15,0,0,0,dh", // 네이버 지도 길찾기 URL용 좌표 파라미터 (구 형식)
    transportation: {
      subway: "지하철 4호선 고잔역 2번 출구에서\n왼쪽 대로변 따라 200m 전방에 위치(도보 10분)",
      bus: "97번, 98번, 99-1번, 500번 버스 고잔역 뒤 정류장 하차",
    },
    parking: "건물 주차장 이용 가능 (2시간 무료)",
    // 신랑측 배차 안내
    groomShuttle: {
      location: "신랑측 배차 출발지",
      departureTime: "오전 10시 30분 출발",
      contact: {
        name: "담당자명",
        tel: "010-1234-5678"
      }
    },
    // 신부측 배차 안내
    brideShuttle: {
      location: "신부측 배차 출발지",
      departureTime: "오전 11시 출발",
      contact: {
        name: "담당자명",
        tel: "010-9876-5432"
      }
    }
  },

  // 갤러리
  gallery: {
    layout: "grid" as GalleryLayout, // "scroll" 또는 "grid" 선택
    position: "middle" as GalleryPosition, // "middle" (현재 위치) 또는 "bottom" (맨 하단) 선택
    images: [
      "/images/gallery/01.jpg",
      "/images/gallery/02.jpg",
      "/images/gallery/03.jpg",
      "/images/gallery/04.jpg",
      "/images/gallery/05.jpg",
      "/images/gallery/06.jpg",
      "/images/gallery/07.jpg",
      "/images/gallery/08.jpg",
      "/images/gallery/09.jpg",
    ],
  } as GalleryConfig,

  // 초대의 말씀
  invitation: {
    message:  "서로 다른 길을 걸어온 저희가\n사랑이라는 이름으로 만나\n\n이제 하나의 길을 함께 걸어가고자 합니다.\n\n저희의 소중한 첫걸음을\n지켜봐 주시고 축복해 주세요.",
    groom: {
      name: "남석윤",
      label: "아들",
      father: "남광",
      mother: "한지연",
    },
    bride: {
      name: "오수은",
      label: "딸",
      father: "오성철",
      mother: "김성자",
    },
  },

  // 계좌번호
  account: {
    groom: {
      bank: "은행명",
      number: "계좌번호",
      holder: "남석윤",
    },
    bride: {
      bank: "신한은행",
      number: "635-12-141619",
      holder: "오수은",
    },
    groomFather: {
      bank: "은행명",
      number: "계좌번호",
      holder: "남광",
    },
    groomMother: {
      bank: "은행명",
      number: "계좌번호",
      holder: "한지연",
    },
    brideFather: {
      bank: "은행명",
      number: "계좌번호",
      holder: "오성철",
    },
    brideMother: {
      bank: "은행명",
      number: "계좌번호",
      holder: "김성자",
    }
  },

  // 동영상 설정
  video: {
    enabled: false, // 동영상 섹션 표시 여부 (비활성화)
    url: "https://player.vimeo.com/video/1115881517", // Vimeo 임베드 URL
    title: "💕 2017.06.22 ~ 💕",
    description: "",
  },

  // RSVP 설정
  rsvp: {
    enabled: false, // RSVP 섹션 표시 여부
    showMealOption: false, // 식사 여부 입력 옵션 표시 여부
  },

  // 슬랙 알림 설정
  slack: {
    webhookUrl: process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL || "",
    channel: "#wedding-response",
    compactMessage: true, // 슬랙 메시지를 간결하게 표시
  },

  // 구글 포토 앨범 설정
  googlePhotos: {
    albumId: "AF1QipM_QrLUSIDJxdgaNexhPCYsxnNa3-H91O21ha_-", // 구글 포토 앨범 ID
    albumName: "결혼식 사진", // 앨범 이름
  },
}; 
