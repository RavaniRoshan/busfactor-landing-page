import { describe, expect, it } from "vitest";
import { buildAppLink } from "./app-links";

it("preserves campaign UTMs on the way to the app", () => {
  expect(
    buildAppLink({
      path: "/scan",
      search: "?utm_source=reddit&utm_medium=community&utm_campaign=beta_launch",
      base: "https://app.example",
    })
  ).toBe("https://app.example/scan?utm_source=reddit&utm_medium=community&utm_campaign=beta_launch");
});

it("defaults to landing-page referral attribution", () => {
  expect(buildAppLink({ path: "/scan", search: "", base: "https://app.example/" })).toBe(
    "https://app.example/scan?utm_source=landing_page&utm_medium=referral"
  );
});

it("does not duplicate slashes in the base URL", () => {
  expect(buildAppLink({ path: "/docs", search: "", base: "https://app.example/" })).toContain(
    "https://app.example/docs"
  );
});
