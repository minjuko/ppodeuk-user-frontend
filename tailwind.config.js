/** @type {import('tailwindcss').Config} */
import scrollbarHide from "tailwind-scrollbar-hide";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0098FF",
        kakao: "#FCEC4F",
      },
      // 여기에 애니메이션과 keyframes 설정을 추가합니다.
      animation: {
        "spin-slow": "spin 1s linear infinite", // "spin-slow"라는 사용자 정의 애니메이션 이름
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [scrollbarHide],
};
