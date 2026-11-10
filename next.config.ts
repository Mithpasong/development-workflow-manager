import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  // 로케일을 쿠키로 요청마다 결정하는 i18n 구조상 모든 라우트가 동적이므로
  // 정적 prerender 전제의 Cache Components / Partial Prefetching은 비활성화한다.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
