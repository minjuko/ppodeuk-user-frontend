import { getDemoDate } from "../utils/demoDate";

const pad = (value) => String(value).padStart(2, "0");

export const toLocalDate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const addDays = (days) => {
  const date = new Date(getDemoDate());
  date.setDate(date.getDate() + days);
  return toLocalDate(date);
};

export const DEMO_CREDENTIALS = {
  email: "test-user@example.com",
  password: "test1234!",
};

export const demoCarwashes = [
  {
    id: 101,
    name: "버블샤인세차",
    image: { url: "/carouselimage1.jpg" },
    rate: 4.8,
    reviewCount: 12,
    reviewCnt: 12,
    distance: 850,
    price: 6000,
    bayCnt: 2,
    optime: {
      weekday: { start: "09:30", end: "18:30" },
      weekend: { start: "09:30", end: "18:30" },
    },
    location: {
      address: "광주광역시 북구 데모로 10",
      latitude: 35.176,
      longitude: 126.91,
    },
    locationDTO: {
      address: "광주광역시 북구 데모로 10",
      latitude: 35.176,
      longitude: 126.91,
    },
    keywordIdList: [8, 10, 12],
    description:
      "넓은 세차 베이와 여유로운 드라잉 공간을 갖춘 셀프 세차장입니다.",
    tel: "062-000-0101",
    imageFileList: [
      { url: "/carouselimage1.jpg" },
      { url: "/carwash-blue.jpg" },
      { url: "/carwash-garden.jpg" },
    ],
  },
  {
    id: 102,
    name: "선셋클린세차",
    image: { url: "/carwash-afternoon.jpg" },
    rate: 4.5,
    reviewCount: 8,
    reviewCnt: 8,
    distance: 2100,
    price: 7000,
    bayCnt: 1,
    optime: {
      weekday: { start: "14:00", end: "18:00" },
      weekend: { start: "14:00", end: "18:00" },
    },
    location: {
      address: "광주광역시 동구 오후로 14",
      latitude: 35.151,
      longitude: 126.924,
    },
    locationDTO: {
      address: "광주광역시 동구 오후로 14",
      latitude: 35.151,
      longitude: 126.924,
    },
    keywordIdList: [9, 11, 13],
    description:
      "부드러운 고압수와 풍부한 거품솔을 편안하게 이용할 수 있습니다.",
    tel: "062-000-0102",
    imageFileList: [
      { url: "/carwash-afternoon.jpg" },
      { url: "/carwash-culture.jpg" },
    ],
  },
  {
    id: 103,
    name: "올데이셀프세차",
    image: { url: "/carwash-allday.jpg" },
    rate: 4.3,
    reviewCount: 5,
    reviewCnt: 5,
    distance: 3300,
    price: 8000,
    bayCnt: 1,
    optime: {
      weekday: { start: "00:00", end: "00:00" },
      weekend: { start: "00:00", end: "00:00" },
    },
    location: {
      address: "광주광역시 서구 올데이로 24",
      latitude: 35.153,
      longitude: 126.889,
    },
    locationDTO: {
      address: "광주광역시 서구 올데이로 24",
      latitude: 35.153,
      longitude: 126.889,
    },
    keywordIdList: [10, 12, 14],
    description:
      "언제든 방문해 빠르고 깔끔하게 차량을 관리할 수 있는 24시간 세차장입니다.",
    tel: "062-000-0103",
    imageFileList: [{ url: "/carwash-allday.jpg" }],
  },
  {
    id: 104,
    name: "블루터치세차",
    image: { url: "/carwash-blue.jpg" },
    rate: 4.7,
    reviewCount: 18,
    reviewCnt: 18,
    distance: 1100,
    price: 7000,
    bayCnt: 2,
    optime: {
      weekday: { start: "08:00", end: "22:00" },
      weekend: { start: "08:00", end: "22:00" },
    },
    location: {
      address: "광주광역시 북구 우치로 121",
      latitude: 35.181,
      longitude: 126.916,
    },
    locationDTO: {
      address: "광주광역시 북구 우치로 121",
      latitude: 35.181,
      longitude: 126.916,
    },
    keywordIdList: [8, 11, 14],
    description: "노터치 자동 세차와 넓은 드라잉 존을 갖춘 세차장입니다.",
    tel: "062-000-0104",
    imageFileList: [
      { url: "/carwash-blue.jpg" },
      { url: "/carouselimage1.jpg" },
      { url: "/carwash-orange.jpg" },
    ],
  },
  {
    id: 105,
    name: "가든손세차",
    image: { url: "/carwash-garden.jpg" },
    rate: 4.9,
    reviewCount: 24,
    reviewCnt: 24,
    distance: 1500,
    price: 9000,
    bayCnt: 2,
    optime: {
      weekday: { start: "09:00", end: "20:00" },
      weekend: { start: "09:00", end: "20:00" },
    },
    location: {
      address: "광주광역시 북구 서방로 38",
      latitude: 35.169,
      longitude: 126.918,
    },
    locationDTO: {
      address: "광주광역시 북구 서방로 38",
      latitude: 35.169,
      longitude: 126.918,
    },
    keywordIdList: [9, 12, 13],
    description: "실내외 손 세차와 꼼꼼한 마무리를 제공하는 세차장입니다.",
    tel: "062-000-0105",
    imageFileList: [
      { url: "/carwash-garden.jpg" },
      { url: "/carwash-culture.jpg" },
    ],
  },
  {
    id: 106,
    name: "오렌지버블세차",
    image: { url: "/carwash-orange.jpg" },
    rate: 4.6,
    reviewCount: 15,
    reviewCnt: 15,
    distance: 1900,
    price: 6000,
    bayCnt: 2,
    optime: {
      weekday: { start: "06:00", end: "23:00" },
      weekend: { start: "06:00", end: "23:00" },
    },
    location: {
      address: "광주광역시 북구 동문대로 92",
      latitude: 35.174,
      longitude: 126.929,
    },
    locationDTO: {
      address: "광주광역시 북구 동문대로 92",
      latitude: 35.174,
      longitude: 126.929,
    },
    keywordIdList: [8, 10, 14],
    description: "이른 아침부터 이용할 수 있는 쾌적한 셀프 세차장입니다.",
    tel: "062-000-0106",
    imageFileList: [
      { url: "/carwash-orange.jpg" },
      { url: "/carwash-geumnam.jpg" },
    ],
  },
  {
    id: 107,
    name: "클린웨이세차",
    image: { url: "/carwash-geumnam.jpg" },
    rate: 4.7,
    reviewCount: 21,
    reviewCnt: 21,
    distance: 2900,
    price: 7000,
    bayCnt: 2,
    optime: {
      weekday: { start: "07:00", end: "23:00" },
      weekend: { start: "07:00", end: "23:00" },
    },
    location: {
      address: "광주광역시 동구 금남로 202",
      latitude: 35.1506,
      longitude: 126.9145,
    },
    locationDTO: {
      address: "광주광역시 동구 금남로 202",
      latitude: 35.1506,
      longitude: 126.9145,
    },
    keywordIdList: [9, 11, 13],
    description: "도심에서 편리하게 이용할 수 있는 셀프 세차장입니다.",
    tel: "062-000-0107",
    imageFileList: [
      { url: "/carwash-geumnam.jpg" },
      { url: "/carwash-blue.jpg" },
      { url: "/carouselimage1.jpg" },
    ],
  },
  {
    id: 108,
    name: "프리미엄터치세차",
    image: { url: "/carwash-culture.jpg" },
    rate: 4.7,
    reviewCount: 3,
    reviewCnt: 3,
    distance: 3500,
    price: 10000,
    bayCnt: 2,
    optime: {
      weekday: { start: "09:00", end: "21:00" },
      weekend: { start: "09:00", end: "21:00" },
    },
    location: {
      address: "광주광역시 동구 문화전당로 35",
      latitude: 35.1468,
      longitude: 126.9198,
    },
    locationDTO: {
      address: "광주광역시 동구 문화전당로 35",
      latitude: 35.1468,
      longitude: 126.9198,
    },
    keywordIdList: [8, 12, 14],
    description: "꼼꼼한 마무리를 제공하는 프리미엄 손 세차장입니다.",
    tel: "062-000-0108",
    imageFileList: [
      { url: "/carwash-culture.jpg" },
      { url: "/carwash-garden.jpg" },
    ],
  },
  {
    id: 109,
    name: "스피드셀프세차",
    image: { url: "/carwash-chosun.jpg" },
    rate: 4.6,
    reviewCount: 16,
    reviewCnt: 16,
    distance: 4600,
    price: 6000,
    bayCnt: 3,
    optime: {
      weekday: { start: "06:00", end: "00:00" },
      weekend: { start: "06:00", end: "00:00" },
    },
    location: {
      address: "광주광역시 남구 양림로 32",
      latitude: 35.13645,
      longitude: 126.91355,
    },
    locationDTO: {
      address: "광주광역시 남구 양림로 32",
      latitude: 35.13645,
      longitude: 126.91355,
    },
    keywordIdList: [10, 11, 13],
    description: "늦은 시간까지 빠르고 편리하게 이용할 수 있습니다.",
    tel: "062-000-0109",
    imageFileList: [
      { url: "/carwash-chosun.jpg" },
      { url: "/carwash-orange.jpg" },
    ],
  },
];

export const createDemoState = () => ({
  nextReservationId: 900,
  pendingPayment: null,
  reservations: [
    {
      id: 501,
      time: { start: `${addDays(0)}T11:30`, end: `${addDays(0)}T12:30` },
      carwashId: 108,
      carwashName: "프리미엄터치세차",
      bayNum: 2,
      price: 20000,
      image: { url: "/carwash-culture.jpg" },
      status: "current",
    },
    {
      id: 502,
      time: { start: `${addDays(1)}T10:30`, end: `${addDays(1)}T11:30` },
      carwashId: 102,
      carwashName: "선셋클린세차",
      bayNum: 1,
      price: 14000,
      image: { url: "/carwash-afternoon.jpg" },
      status: "upcoming",
    },
    {
      id: 401,
      time: { start: `${addDays(-3)}T11:00`, end: `${addDays(-3)}T12:00` },
      carwashId: 101,
      carwashName: "버블샤인세차",
      bayNum: 1,
      price: 12000,
      image: { url: "/carouselimage1.jpg" },
      status: "complete",
    },
    {
      id: 402,
      time: { start: `${addDays(-8)}T18:30`, end: `${addDays(-8)}T19:30` },
      carwashId: 105,
      carwashName: "가든손세차",
      bayNum: 2,
      price: 18000,
      image: { url: "/carwash-garden.jpg" },
      status: "complete",
    },
  ],
  reviews: [
    {
      carwashId: 108,
      rate: 5,
      username: "세차마니아",
      created_at: `${addDays(-2)}T17:20`,
      comment: "시설이 깨끗하고 휴게 공간도 편안해서 만족스러웠어요.",
      keywordIdList: [1, 3, 6],
    },
    {
      carwashId: 108,
      rate: 5,
      username: "주말드라이버",
      created_at: `${addDays(-6)}T13:10`,
      comment: "세차 공간이 넓고 관리가 잘 되어 있어 이용하기 편했습니다.",
      keywordIdList: [3, 4],
    },
    {
      carwashId: 108,
      rate: 4,
      username: "클린카",
      created_at: `${addDays(-11)}T19:40`,
      comment: "대기 시간이 짧고 장비 사용법도 간단했어요.",
      keywordIdList: [1, 4],
    },
    {
      carwashId: 101,
      rate: 5,
      username: "데모 사용자",
      created_at: `${addDays(-5)}T12:00`,
      comment: "예약 시간이 정확하고 직원 안내가 친절했어요.",
      keywordIdList: [1, 6],
    },
    {
      carwashId: 101,
      rate: 5,
      username: "버블카",
      created_at: `${addDays(-9)}T09:40`,
      comment: "거품이 풍성하고 세차 베이가 깔끔하게 관리되어 있어요.",
      keywordIdList: [3, 4],
    },
    {
      carwashId: 101,
      rate: 4,
      username: "워시러버",
      created_at: `${addDays(-14)}T16:10`,
      comment: "가격이 합리적이고 예약 과정이 간편했습니다.",
      keywordIdList: [1, 4],
    },
    {
      reservationId: 402,
      carwashId: 105,
      rate: 5,
      username: "광주드라이버",
      created_at: `${addDays(-7)}T13:40`,
      comment: "마무리가 꼼꼼하고 직원분이 친절했어요.",
      keywordIdList: [1, 6],
    },
    {
      carwashId: 102,
      rate: 4,
      username: "오후세차",
      created_at: `${addDays(-10)}T15:20`,
      comment: "오후에도 여유롭게 이용할 수 있어 좋았어요.",
      keywordIdList: [1, 6],
    },
    {
      carwashId: 103,
      rate: 5,
      username: "밤세차",
      created_at: `${addDays(-12)}T22:10`,
      comment: "늦은 시간에도 조명이 밝고 시설이 깨끗합니다.",
      keywordIdList: [4, 6],
    },
    {
      carwashId: 104,
      rate: 5,
      username: "블루카",
      created_at: `${addDays(-4)}T11:30`,
      comment: "노터치 세차가 빠르고 드라잉 공간도 넓어요.",
      keywordIdList: [4, 6],
    },
    {
      carwashId: 106,
      rate: 4,
      username: "오렌지카",
      created_at: `${addDays(-8)}T08:15`,
      comment: "이른 시간에도 편하게 이용할 수 있었습니다.",
      keywordIdList: [3, 4],
    },
    {
      carwashId: 107,
      rate: 5,
      username: "클린드라이버",
      created_at: `${addDays(-2)}T18:10`,
      comment: "역에서 가깝고 베이 관리가 잘 되어 있어요.",
      keywordIdList: [1, 6],
    },
    {
      carwashId: 109,
      rate: 4,
      username: "스피드카",
      created_at: `${addDays(-10)}T20:40`,
      comment: "늦게까지 운영해서 저녁에도 이용하기 편해요.",
      keywordIdList: [4, 6],
    },
  ],
});

export const demoBookedTimes = (carwashId, bayId) => {
  const key = `${Number(carwashId)}:${Number(bayId)}`;
  const bookedTimes = {
    "101:1011": [
      {
        userId: 2001,
        startTime: `${addDays(1)}T10:00`,
        endTime: `${addDays(1)}T11:00`,
      },
      {
        userId: 2002,
        startTime: `${addDays(1)}T16:00`,
        endTime: `${addDays(1)}T16:30`,
      },
    ],
    "108:1081": [
      {
        userId: 3101,
        startTime: `${addDays(1)}T09:30`,
        endTime: `${addDays(1)}T10:30`,
      },
      {
        userId: 3102,
        startTime: `${addDays(1)}T12:00`,
        endTime: `${addDays(1)}T12:30`,
      },
      {
        userId: 3103,
        startTime: `${addDays(1)}T15:00`,
        endTime: `${addDays(1)}T16:00`,
      },
      {
        userId: 3104,
        startTime: `${addDays(1)}T18:30`,
        endTime: `${addDays(1)}T19:30`,
      },
    ],
    "108:1082": [
      {
        userId: 3201,
        startTime: `${addDays(1)}T10:30`,
        endTime: `${addDays(1)}T11:00`,
      },
      {
        userId: 3202,
        startTime: `${addDays(1)}T13:00`,
        endTime: `${addDays(1)}T14:00`,
      },
      {
        userId: 3203,
        startTime: `${addDays(1)}T16:30`,
        endTime: `${addDays(1)}T17:00`,
      },
      {
        userId: 3204,
        startTime: `${addDays(1)}T19:30`,
        endTime: `${addDays(1)}T20:30`,
      },
    ],
  };

  return bookedTimes[key] || [];
};
