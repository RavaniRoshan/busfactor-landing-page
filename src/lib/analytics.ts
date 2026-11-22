import posthog from "posthog-js";

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

let initialized = false;
let landingViewed = false;
let disabled = false;

function getEnv(key: string): string | undefined {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return value && value.trim() ? value.trim() : undefined;
}

export function getPosthogKey(): string | undefined {
  return getEnv("VITE_POSTHOG_KEY");
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
    if (value) attribution[key] = value;
  }
  return attribution;
}

function baseProperties(): Record<string, string> {
  return {
    surface: "marketing",
    page: getPage(),
    device_type: getDeviceType(),
    ...getAttribution(),
  };
}

export function initMarketingAnalytics(): void {
  const key = getPosthogKey();
  if (!key) return;
  if (disabled) return;
  if (getMarketingConsent() !== "granted") return;
  if (typeof window === "undefined") return;

  try {
    if (!initialized) {
      posthog.init(key, {
        api_host: getEnv("VITE_POSTHOG_HOST") || "https://us.i.posthog.com",
        autocapture: false,
        capture_pageview: false,
        disable_session_recording: true,
        person_profiles: "identified_only",
        persistence: "localStorage+cookie",
      });
      initialized = true;
    }

    if (!landingViewed) {
      landingViewed = true;
      posthog.capture("landing_viewed", baseProperties());
    }
  } catch {
    disabled = true;
    initialized = false;
    landingViewed = false;
  }
}

export function track(
  event: MarketingEvent,
  properties: Record<string, string | number | boolean | null | undefined> = {},
): void {
  const key = getPosthogKey();
  if (!key) return;
  if (disabled) return;
  if (getMarketingConsent() !== "granted") return;
  if (!initialized) return;

  try {
    const sanitized: Record<string, string | number | boolean> = {};
    for (const [name, value] of Object.entries(properties)) {
      if (value === null || value === undefined) continue;
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        sanitized[name] = value;
      }
    }

    posthog.capture(event, {
      ...baseProperties(),
      ...sanitized,
    });
  } catch {
    disabled = true;
  }
}
