const base = (import.meta.env.VITE_API_URL as string) ?? "";

export function apiUrl(path: string): string {
  return `${base}${path}`;
}
