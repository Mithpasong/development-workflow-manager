"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * 화면 상단 중앙에서 아래로 내려오는 토스트.
 * 부모가 필요할 때만 마운트하고(`{msg && <Toast .../>}`), onClose로 해제한다.
 */
export default function Toast({
  message,
  onClose,
  durationMs = 3000,
}: {
  message: string;
  onClose: () => void;
  durationMs?: number;
}) {
  useEffect(() => {
    const id = setTimeout(onClose, durationMs);
    return () => clearTimeout(id);
  }, [onClose, durationMs]);

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
      <div
        role="status"
        aria-live="polite"
        className="animate-toast-in pointer-events-auto max-w-[90vw] truncate rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white shadow-lg"
      >
        {message}
      </div>
    </div>,
    document.body,
  );
}
