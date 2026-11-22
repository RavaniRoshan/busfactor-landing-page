import type { AnchorHTMLAttributes, ReactNode } from "react";
import { buildAppLink } from "../lib/app-links";
import { track, type MarketingEvent } from "../lib/analytics";

interface AppLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  path: string;
  event?: MarketingEvent;
  base: string;
  children: ReactNode;
}

function hasCampaign(search: string): boolean {
  const params = new URLSearchParams(search.startsWith("?") ? search : search ? `?${search}` : "");
  return Boolean(params.get("utm_source") || params.get("utm_campaign"));
}

export function AppLink({ path, event, base, children, onClick, ...props }: AppLinkProps) {
  const search = typeof window !== "undefined" ? window.location.search : "";
  const href = buildAppLink({ path, search, base });

  return (
    <a
      {...props}
      href={href}
      onClick={(e) => {
        if (event) track(event);
        if (hasCampaign(search)) track("campaign_clicked", { target_path: path });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
