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
    title: "엄규철 ❤️ 김유진의 결혼식에 초대합니다",
    description: "결혼식 초대장",
    ogImage: "/images/",
    noIndex: true,
    _jwk_watermark_id: uniqueIdentifier,
  },

  // 메인 화면
  main: {
    title: "Wedding Invitation",
    image: "/images/main.jpg",
    date: "2026년 1월 24일 토요일 12시 10분",
    venue: "빌라드지디 안산 그레이스켈리홀",
  },

  // 소개글
  intro: {
    title: "",
    text: "학교에서 선후배로 만나\n사랑으로 이어진 지 아홉 해.\n\n그 시간 속에서 서로의 세상이 되어\n이제는 하나의 길을 걸어가려 합니다.\n\n저희의 시작을 따뜻한 마음으로 축복해 주신다면\n그 무엇보다도 큰 힘이 될 것입니다."
  },

  // 결혼식 일정
  date: {
    year: 2026,
    month: 1,
    day: 24,
    hour: 12,
    minute: 10,
    displayDate: "2026.01.24 SAT PM 12:10",
  },

  // 장소 정보
  venue: {
    name: "빌라드지디 안산",
    address: "경기 안산시 단원구 광덕4로 140\n빌라드지디 안산 7층 그레이스켈리홀",
    tel: "031-487-8100",
    naverMapId: "그레이스켈리홀", // 네이버 지도 검색용 장소명
    coordinates: {
      latitude: 37.314924,
      longitude: 126.8278801,
    },
    placeId: "34291584", // 네이버 지도 장소 ID
    mapZoom: "17", // 지도 줌 레벨
    mapNaverCoordinates: "14141300,4507203,15,0,0,0,dh", // 네이버 지도 길찾기 URL용 좌표 파라미터 (구 형식)
    transportation: {
      subway: "지하철 4호선 고잔역 2번 출구 (도보 10분)",
      bus: "간선\n 101, 102, 103\n지선\n 1234, 5678",
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
    message:  "학교에서 선후배로 만나\n사랑으로 이어진 지 아홉 해.\n\n그 시간 속에서 서로의 세상이 되어\n이제는 하나의 길을 걸어가려 합니다.\n\n저희의 시작을 따뜻한 마음으로 축복해 주신다면\n그 무엇보다도 큰 힘이 될 것입니다.",
    groom: {
      name: "엄규철",
      label: "아들",
      father: "엄태관",
      mother: "손덕수",
    },
    bride: {
      name: "김유진",
      label: "딸",
      father: "김 범",
      mother: "이향옥",
    },
  },

  // 계좌번호
  account: {
    groom: {
      bank: "우리은행",
      number: "1002-247-991527",
      holder: "엄규철",
    },
    bride: {
      bank: "우리은행",
      number: "1002-247-991527",
      holder: "김유진",
    },
    groomFather: {
      bank: "은행명",
      number: "111-222-333444",
      holder: "신랑아버지",
    },
    groomMother: {
      bank: "은행명",
      number: "555-666-777888",
      holder: "신랑어머니",
    },
    brideFather: {
      bank: "은행명",
      number: "999-000-111222",
      holder: "신부아버지",
    },
    brideMother: {
      bank: "은행명",
      number: "333-444-555666",
      holder: "신부어머니",
    }
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
}; 
