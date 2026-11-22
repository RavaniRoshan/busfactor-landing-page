import { useEffect, useState } from "react";
import { Button } from "@figma/astraui";
import {
  getMarketingConsent,
  getPosthogKey,
  initMarketingAnalytics,
  setMarketingConsent,
  type MarketingConsent,
} from "../lib/analytics";

export function ConsentBanner() {
  const [consent, setConsent] = useState<MarketingConsent>("unset");
  const hasKey = Boolean(getPosthogKey());

  useEffect(() => {
    const current = getMarketingConsent();
    setConsent(current);
    if (current === "granted") {
      initMarketingAnalytics();
    }
  }, []);

  if (!hasKey || consent !== "unset") return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border-secondary bg-surface-bg/95 px-xl py-lg backdrop-blur"
      role="dialog"
      aria-label="Analytics consent"
      aria-live="polite"
    >
      <div className="mx-auto flex w-full max-w-page flex-col gap-md md:flex-row md:items-center md:justify-between">
        <p className="max-w-copy text-label-sm text-text-secondary">
          We use privacy-conscious analytics to understand which marketing pages help people find
          BusFactor. No repository content, URLs, paths, emails, or secrets are sent.
        </p>
        <div className="flex shrink-0 items-center gap-sm">
          <Button
            variant="subtle"
            size="small"
            onClick={() => {
              setMarketingConsent("denied");
              setConsent("denied");
            }}
          >
            Decline
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => {
              setMarketingConsent("granted");
              setConsent("granted");
              initMarketingAnalytics();
            }}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
