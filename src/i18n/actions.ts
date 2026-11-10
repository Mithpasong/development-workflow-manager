"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { defaultLocale, isLocale, type Locale } from "./config";
import { LOCALE_COOKIE } from "./request";

export async function setLocale(locale: Locale) {
  const value: Locale = isLocale(locale) ? locale : defaultLocale;
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, value, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1년
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
