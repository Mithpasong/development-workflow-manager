"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PolicyModal from "@/components/PolicyModal";

const inputClass =
  "h-11 w-full rounded-lg border border-black/15 bg-transparent px-3.5 text-sm outline-none transition placeholder:text-black/30 focus:border-foreground focus:ring-2 focus:ring-foreground/15 dark:border-white/15 dark:placeholder:text-white/30";
const labelClass = "text-sm font-medium text-black/70 dark:text-white/70";

function EyeIcon({ off }: { off?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      {off ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
          <path d="M9.9 4.6A10.9 10.9 0 0 1 12 4.5c6.5 0 10 7 10 7a18 18 0 0 1-2.9 3.8" />
          <path d="M6.1 6.1A18 18 0 0 0 2 11.5s3.5 7 10 7a10.9 10.9 0 0 0 3.1-.5" />
        </>
      ) : (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

function PasswordField({
  id,
  label,
  placeholder,
}: {
  id: string;
  label: string;
  placeholder: string;
}) {
  const t = useTranslations("SignUp");
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          placeholder={placeholder}
          className={`${inputClass} pr-11`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? t("hidePassword") : t("showPassword")}
          aria-pressed={show}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-black/40 transition hover:text-foreground dark:text-white/40"
        >
          <EyeIcon off={show} />
        </button>
      </div>
    </div>
  );
}

function Agreement({
  checked,
  messageKey,
  onOpen,
  onToggleOff,
}: {
  checked: boolean;
  messageKey: "agreePrivacy" | "agreeTerms";
  onOpen: () => void;
  onToggleOff: () => void;
}) {
  const t = useTranslations("SignUp");
  return (
    <div className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => (checked ? onToggleOff() : onOpen())}
        aria-label={
          messageKey === "agreePrivacy" ? t("privacyTitle") : t("termsTitle")
        }
        className="size-4 shrink-0 cursor-pointer rounded border-black/20 accent-foreground dark:border-white/20"
      />
      <span>
        {t.rich(messageKey, {
          policy: (chunks) => (
            <button
              type="button"
              onClick={onOpen}
              className="font-medium text-foreground underline underline-offset-2 hover:opacity-80"
            >
              {chunks}
            </button>
          ),
        })}
      </span>
    </div>
  );
}

type ModalKind = "privacy" | "terms";

export default function SignUpForm() {
  const t = useTranslations("SignUp");
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [modal, setModal] = useState<ModalKind | null>(null);

  return (
    <form className="flex flex-col gap-4">
      {/* 이메일 */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={labelClass}>
          {t("emailLabel")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          className={inputClass}
        />
      </div>

      {/* 비밀번호 (미리보기) */}
      <PasswordField
        id="password"
        label={t("passwordLabel")}
        placeholder={t("passwordPlaceholder")}
      />

      {/* 비밀번호 확인 (미리보기) */}
      <PasswordField
        id="confirmPassword"
        label={t("confirmPasswordLabel")}
        placeholder={t("confirmPasswordPlaceholder")}
      />

      {/* 이름 */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className={labelClass}>
          {t("nameLabel")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          className={inputClass}
        />
      </div>

      {/* 약관 동의 */}
      <div className="flex flex-col gap-2 pt-1">
        <Agreement
          checked={agreedPrivacy}
          messageKey="agreePrivacy"
          onOpen={() => setModal("privacy")}
          onToggleOff={() => setAgreedPrivacy(false)}
        />
        <Agreement
          checked={agreedTerms}
          messageKey="agreeTerms"
          onOpen={() => setModal("terms")}
          onToggleOff={() => setAgreedTerms(false)}
        />
      </div>

      {/* 가입 버튼 */}
      <button
        type="submit"
        className="mt-2 h-11 rounded-lg bg-foreground text-sm font-medium text-background transition hover:opacity-90"
      >
        {t("submit")}
      </button>

      {/* 정책 모달 (portal로 body에 렌더됨) */}
      <PolicyModal
        open={modal !== null}
        title={modal === "terms" ? t("termsTitle") : t("privacyTitle")}
        body={t("policyBody")}
        agreeLabel={t("agree")}
        closeLabel={t("close")}
        onAgree={() => {
          if (modal === "privacy") setAgreedPrivacy(true);
          else if (modal === "terms") setAgreedTerms(true);
          setModal(null);
        }}
        onClose={() => setModal(null)}
      />
    </form>
  );
}
