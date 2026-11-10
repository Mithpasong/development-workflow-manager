import type { Metadata } from "next";
import localFont from "next/font/local";
import { ViewTransitions } from "next-view-transitions";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "로그인",
  description: "로그인 화면",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <ViewTransitions>
      <html
        lang={locale}
        className={`${pretendard.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
