"use client";

import { ToastContainer, Slide, type CloseButtonProps } from "react-toastify";
import "react-toastify/ReactToastify.css";

/**
 * 커스텀 닫기 버튼.
 * 기본 버튼은 `position:absolute; top:6px`이라 상단에 붙는다.
 * 일반 flex 자식으로 두면 `.Toastify__toast`의 align-items:center 덕분에 세로 가운데 정렬된다.
 */
function ToastCloseButton({ closeToast, ariaLabel }: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={closeToast}
      aria-label={ariaLabel ?? "close"}
      className="ml-auto flex shrink-0 self-center rounded pl-2 text-white/60 transition hover:text-white"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        className="size-3"
        aria-hidden="true"
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );
}

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
      toastClassName="text-[12px] leading-snug border border-white/25"
      position="top-center"
      transition={Slide}
      autoClose={4000}
      closeButton={ToastCloseButton}
      hideProgressBar
      pauseOnHover
      pauseOnFocusLoss={false}
      draggable={false}
      newestOnTop
      theme="dark"
    />
  );
}
