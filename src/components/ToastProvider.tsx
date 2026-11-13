"use client";

import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/ReactToastify.css";

/**
 * 앱 전역 토스트 컨테이너.
 * - 상단 중앙에서 Slide 전환으로 아래로 내려옴
 * - 남은 시간을 보여주는 프로그레스 바 + 닫기(X) 버튼 기본 제공
 * - 색상(검정 배경/흰 글씨)과 상단 여백은 globals.css의 CSS 변수로 지정
 */
// CSS 변수를 컨테이너에 인라인으로 지정한다.
// (라이브러리 CSS와 globals.css가 별도 청크라 로드 순서에 따라 덮어쓰기가 실패할 수 있어,
//  순서와 무관하게 항상 적용되도록 인라인으로 둔다.)
const toastVars = {
  "--toastify-toast-top": "2.5rem", // 상단에서 조금 더 아래로
  "--toastify-toast-bd-radius": "0.5rem",
  "--toastify-color-dark": "#000000", // 검정 배경
  "--toastify-text-color-dark": "#ffffff", // 흰 글씨
  "--toastify-color-progress-dark": "#ffffff", // 흰 프로그레스 바
  "--toastify-toast-shadow": "0 10px 24px rgb(0 0 0 / 0.25)",
  // 크기 축소 (기본: 320px / 64px / 14px)
  "--toastify-toast-width": "17rem",
  "--toastify-toast-min-height": "2.25rem",
  "--toastify-toast-padding": "0.625rem",
} as React.CSSProperties;

export default function ToastProvider() {
  return (
    <ToastContainer
      style={toastVars}
      toastClassName="text-[13px] leading-snug"
      position="top-center"
      transition={Slide}
      autoClose={4000}
      closeButton
      hideProgressBar={false}
      pauseOnHover
      pauseOnFocusLoss={false}
      draggable={false}
      newestOnTop
      theme="dark"
    />
  );
}
