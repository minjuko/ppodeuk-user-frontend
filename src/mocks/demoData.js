const pad = (value) => String(value).padStart(2, "0");

export const toLocalDate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toLocalDate(date);
};

export const DEMO_CREDENTIALS = {
  email: "test@example.com",
  password: "test1234!",
};

export const demoCarwashes = [
  {
    id: 101,
    name: "모닝버블워시",
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
    keywordIdList: [8, 10, 11],
    description:
      "넓은 세차 베이와 여유로운 드라잉 공간을 갖춘 셀프 세차장입니다.",
    tel: "062-000-0101",
    imageFileList: [
      { url: "/carouselimage1.jpg" },
      { url: "/carwash-blue.png" },
      { url: "/carwash-garden.png" },
    ],
  },
  {
    id: 102,
    name: "애프터눈워시",
    image: { url: "/carwash-afternoon.png" },
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
    keywordIdList: [9, 12],
    description:
      "부드러운 고압수와 풍부한 거품솔을 편안하게 이용할 수 있습니다.",
    tel: "062-000-0102",
    imageFileList: [
      { url: "/carwash-afternoon.png" },
      { url: "/carwash-culture.png" },
    ],
  },
  {
    id: 103,
    name: "올데이워시",
    image: { url: "/carwash-allday.png" },
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
    keywordIdList: [10, 13],
    description:
      "언제든 방문해 빠르고 깔끔하게 차량을 관리할 수 있는 24시간 세차장입니다.",
    tel: "062-000-0103",
    imageFileList: [{ url: "/carwash-allday.png" }],
  },
  {
    id: 104,
    name: "블루터치워시",
    image: { url: "/carwash-blue.png" },
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
    keywordIdList: [8, 11, 13],
    description: "노터치 자동 세차와 넓은 드라잉 존을 갖춘 세차장입니다.",
    tel: "062-000-0104",
    imageFileList: [
      { url: "/carwash-blue.png" },
      { url: "/carouselimage1.jpg" },
      { url: "/carwash-orange.png" },
    ],
  },
  {
    id: 105,
    name: "가든손세차",
    image: { url: "/carwash-garden.png" },
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
    keywordIdList: [9, 10, 12],
    description: "실내외 손 세차와 꼼꼼한 마무리를 제공하는 세차장입니다.",
    tel: "062-000-0105",
    imageFileList: [
      { url: "/carwash-garden.png" },
      { url: "/carwash-culture.png" },
    ],
  },
  {
    id: 106,
    name: "오렌지워시",
    image: { url: "/carwash-orange.png" },
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
    keywordIdList: [8, 10, 13],
    description: "이른 아침부터 이용할 수 있는 쾌적한 셀프 세차장입니다.",
    tel: "062-000-0106",
    imageFileList: [
      { url: "/carwash-orange.png" },
      { url: "/carwash-geumnam.png" },
    ],
  },
  {
    id: 107,
    name: "금남로워시",
    image: { url: "/carwash-geumnam.png" },
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
    keywordIdList: [8, 10, 13],
    description: "금남로4가역에서 가까운 도심형 셀프 세차장입니다.",
    tel: "062-000-0107",
    imageFileList: [
      { url: "/carwash-geumnam.png" },
      { url: "/carwash-blue.png" },
      { url: "/carouselimage1.jpg" },
    ],
  },
  {
    id: 108,
    name: "문화터치워시",
    image: { url: "/carwash-culture.png" },
    rate: 4.8,
    reviewCount: 27,
    reviewCnt: 27,
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
    keywordIdList: [9, 11, 12],
    description: "문화전당역 인근의 프리미엄 손 세차장입니다.",
    tel: "062-000-0108",
    imageFileList: [
      { url: "/carwash-culture.png" },
      { url: "/carwash-garden.png" },
    ],
  },
  {
    id: 109,
    name: "조선대셀프워시",
    image: { url: "/carwash-chosun.png" },
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
      address: "광주광역시 동구 필문대로 309",
      latitude: 35.1396,
      longitude: 126.928,
    },
    locationDTO: {
      address: "광주광역시 동구 필문대로 309",
      latitude: 35.1396,
      longitude: 126.928,
    },
    keywordIdList: [8, 10, 13],
    description:
      "조선대학교 부근에서 늦게까지 이용할 수 있는 셀프 세차장입니다.",
    tel: "062-000-0109",
    imageFileList: [
      { url: "/carwash-chosun.png" },
      { url: "/carwash-orange.png" },
    ],
  },
];

export const createDemoState = () => ({
  nextReservationId: 900,
  pendingPayment: null,
  reservations: [
    {
      id: 501,
      time: { start: `${addDays(1)}T16:00`, end: `${addDays(1)}T16:30` },
      carwashId: 101,
      carwashName: "모닝버블워시",
      bayNum: 1,
      price: 6000,
      image: { url: "/carouselimage1.jpg" },
      status: "upcoming",
    },
    {
      id: 401,
      time: { start: `${addDays(-2)}T14:00`, end: `${addDays(-2)}T15:00` },
      carwashId: 102,
      carwashName: "애프터눈워시",
      bayNum: 1,
      price: 14000,
      image: { url: "/carwash-afternoon.png" },
      status: "complete",
    },
  ],
  reviews: [
    {
      carwashId: 101,
      rate: 5,
      username: "데모 사용자",
      created_at: `${addDays(-3)}T12:00`,
      comment: "예약 시간이 정확하고 이용이 편리했어요.",
      keywordIdList: [1, 4],
    },
    {
      carwashId: 102,
      rate: 4,
      username: "워시러버",
      created_at: `${addDays(-5)}T15:20`,
      comment: "오후에도 여유롭게 이용할 수 있어 좋았어요.",
      keywordIdList: [1, 6],
    },
    {
      carwashId: 103,
      rate: 5,
      username: "밤세차",
      created_at: `${addDays(-7)}T22:10`,
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
      carwashId: 105,
      rate: 5,
      username: "광주드라이버",
      created_at: `${addDays(-6)}T13:40`,
      comment: "마무리가 꼼꼼하고 직원분이 친절했어요.",
      keywordIdList: [1, 6],
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
      username: "금남로이용자",
      created_at: `${addDays(-2)}T18:10`,
      comment: "역에서 가깝고 베이 관리가 잘 되어 있어요.",
      keywordIdList: [1, 6],
    },
    {
      carwashId: 108,
      rate: 5,
      username: "문화생활",
      created_at: `${addDays(-9)}T16:25`,
      comment: "실내외가 깔끔하고 휴게 공간도 편안합니다.",
      keywordIdList: [3, 6],
    },
    {
      carwashId: 109,
      rate: 4,
      username: "조대드라이버",
      created_at: `${addDays(-10)}T20:40`,
      comment: "늦게까지 운영해서 수업 후 이용하기 편해요.",
      keywordIdList: [4, 6],
    },
  ],
});

export const demoBookedTimes = (carwashId, bayId) => {
  if (Number(carwashId) !== 101 || Number(bayId) !== 1011) return [];
  return [
    { startTime: `${addDays(1)}T10:00`, endTime: `${addDays(1)}T11:00` },
    { startTime: `${addDays(1)}T16:00`, endTime: `${addDays(1)}T16:30` },
  ];
};
