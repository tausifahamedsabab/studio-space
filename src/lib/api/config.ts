export type ApiMode = "mock" | "live";

function normalizeBaseUrl(value: string) {
  return value
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");
}

const rawApiUrl =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://studio-space-server-smoky.vercel.app/";

export const API_MODE: ApiMode =
  process.env.API_MODE === "live" ? "live" : "mock";

export const API_BASE_URL = normalizeBaseUrl(rawApiUrl);

export function isMockMode() {
  return API_MODE === "mock";
}

export function isLiveMode() {
  return API_MODE === "live";
}
