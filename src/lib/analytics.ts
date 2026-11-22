export const CONSENT_KEY = "busfactor.analytics.consent.v1";

export type MarketingConsent = "granted" | "denied" | "unset";

export type MarketingEvent =
  | "landing_viewed"
  | "hero_cta_clicked"
  | "scanner_cta_clicked"
  | "docs_clicked"
  | "cli_command_copied"
  | "pricing_viewed"
  | "campaign_clicked";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const CLIENT_ID_KEY = "busfactor.analytics.id.v1";
const SESSION_ID_KEY = "busfactor.analytics.session.v1";
const DEFAULT_APP_URL = "https://heir-weld.vercel.app";

let initialized = false;
let landingViewed = false;
let disabled = false;
let fallbackClientId: string | null = null;
let fallbackSessionId: string | null = null;

function getEnv(key: string): string | undefined {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return value && value.trim() ? value.trim() : undefined;
}

function getAppUrl(): string {
  return (getEnv("VITE_APP_URL") || DEFAULT_APP_URL).replace(/\/+$/, "");
}

export function getAnalyticsEndpoint(): string | undefined {
  const configured = getEnv("VITE_ANALYTICS_ENDPOINT");
  if (configured) return configured.replace(/\/+$/, "");
  return `${getAppUrl()}/api/events`;
}

export function hasAnalyticsEndpoint(): boolean {
  return Boolean(getAnalyticsEndpoint());
}

export function getMarketingConsent(): MarketingConsent {
  if (typeof window === "undefined") return "unset";
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    if (value === "granted" || value === "denied") return value;
  } catch {
    // Ignore storage failures; treat as unset.
  }
  return "unset";
}

export function setMarketingConsent(value: Exclude<MarketingConsent, "unset">): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Ignore storage failures.
  }
}

function randomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function readId(storage: Storage, key: string, fallback: () => string): string {
  try {
    const existing = storage.getItem(key);
    if (existing !== null && existing.trim() !== "") return existing;
    const created = fallback();
    storage.setItem(key, created);
    return created;
  } catch {
    return fallback();
  }
}

function getClientId(): string {
  if (typeof window === "undefined") {
    fallbackClientId ??= randomId();
    return fallbackClientId;
  }
  return readId(window.localStorage, CLIENT_ID_KEY, () => {
    fallbackClientId ??= randomId();
    return fallbackClientId;
  });
}

function getSessionId(): string {
  if (typeof window === "undefined") {
    fallbackSessionId ??= randomId();
    return fallbackSessionId;
  }
  return readId(window.sessionStorage, SESSION_ID_KEY, () => {
    fallbackSessionId ??= randomId();
    return fallbackSessionId;
  });
}

function getDeviceType(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

function getPage(): "landing" | "docs" {
  if (typeof window === "undefined") return "landing";
  return new URLSearchParams(window.location.search).get("page") === "docs" ? "docs" : "landing";
}

function getAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const attribution: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (!value) continue;
    attribution[key.replace(/^utm_/, "")] = value;
  }
  return attribution;
}

function baseProperties(): Record<string, string> {
  return {
    page: getPage(),
    device_type: getDeviceType(),
    ...getAttribution(),
  };
}

function send(event: MarketingEvent, properties: Record<string, string | number | boolean>): void {
  const endpoint = getAnalyticsEndpoint();
  if (!endpoint || disabled) return;
  try {
    void fetch(endpoint, {
      method: "POST",
      mode: "cors",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event,
        surface: "marketing",
        distinct_id: getClientId(),
        session_id: getSessionId(),
        properties,
      }),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    disabled = true;
  }
}

export function initMarketingAnalytics(): void {
  if (typeof window === "undefined") return;
  if (disabled) return;
  if (getMarketingConsent() !== "granted") return;
  if (!hasAnalyticsEndpoint()) return;
  if (!initialized) {
    initialized = true;
    window.dispatchEvent(new Event("busfactor:analytics-ready"));
  }
  if (!landingViewed) {
    landingViewed = true;
    send("landing_viewed", baseProperties());
  }
}

export function track(
  event: MarketingEvent,
  properties: Record<string, string | number | boolean | null | undefined> = {},
): void {
  if (disabled) return;
  if (getMarketingConsent() !== "granted") return;
  if (!initialized) return;

  const sanitized: Record<string, string | number | boolean> = {};
  for (const [name, value] of Object.entries(properties)) {
    if (value === null || value === undefined) continue;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      sanitized[name] = value;
    }
  }
  send(event, { ...baseProperties(), ...sanitized });
}

export function __resetMarketingAnalyticsForTests(): void {
  initialized = false;
  landingViewed = false;
  disabled = false;
  fallbackClientId = null;
  fallbackSessionId = null;
}
