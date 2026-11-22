const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export interface BuildAppLinkOptions {
  path: string;
  search: string;
  base: string;
}

export function buildAppLink({ path, search, base }: BuildAppLinkOptions): string {
  const normalizedBase = base.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${normalizedBase}${normalizedPath}`);

  const incoming = new URLSearchParams(search.startsWith("?") ? search : search ? `?${search}` : "");
  for (const key of UTM_KEYS) {
    const value = incoming.get(key);
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  if (!url.searchParams.get("utm_source")) {
    url.searchParams.set("utm_source", "landing_page");
    url.searchParams.set("utm_medium", "referral");
  }

  return url.toString();
}
