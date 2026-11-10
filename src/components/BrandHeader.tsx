import Logo from "@/components/Logo";

/**
 * 로고 + 브랜드명("Development Workflow / Manager") 헤더.
 * 로그인/회원가입 등 인증 화면 상단에서 공통으로 사용한다.
 */
export default function BrandHeader({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center text-center ${className ?? ""}`}
    >
      <Logo className="h-24 w-auto text-foreground" />
      <p className="mt-4 text-[3.375rem] font-semibold leading-[1.05] tracking-tight">
        Development Workflow
        <br />
        Manager
      </p>
    </div>
  );
}
