export const NEXT_API_BASE_URL =
  import.meta.env.VITE_NEXT_API_BASE_URL || "http://localhost:3000";

export function getNextApiUrl(path: string) {
  return `${NEXT_API_BASE_URL}${path}`;
}
