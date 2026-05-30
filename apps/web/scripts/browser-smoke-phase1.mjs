/**
 * Headless smoke: sign-in → /ai/gemini. Requires web on :3001 and server on :3000.
 * Run: pnpm --filter web exec node scripts/browser-smoke-phase1.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.WEB_URL ?? "http://localhost:3001";
const USER = "admin";
const PASS = "Admin@123";

const errors = [];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (text.includes("runtime_info_fetch_failed")) return;
    errors.push(`console: ${text}`);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

  await page.goto(`${BASE}/sign-in`, { waitUntil: "networkidle" });
  await page.getByRole("textbox", { name: "Username" }).fill(USER);
  await page.getByRole("textbox", { name: "Password" }).fill(PASS);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((url) => !url.pathname.includes("sign-in"), { timeout: 20000 });
  await page.waitForTimeout(1000);

  await page.goto(`${BASE}/ai/gemini`, { waitUntil: "networkidle" });
  const copilotResponse = await page
    .waitForResponse(
      (res) =>
        res.url().includes("/api/copilotkit") &&
        res.request().method() === "POST" &&
        res.status() === 200,
      { timeout: 30000 },
    )
    .catch(() => null);
  await page.waitForTimeout(1500);

  const title = await page.getByRole("heading", { name: /Operations Intelligence/i }).count();
  const chatRegion = await page.locator("#copilot-chat-main").count();
  const quickPrompts = await page.getByRole("button", { name: "SLA risk" }).count();

  const copilotPostOk = copilotResponse !== null;

  const result = {
    ok: title > 0 && chatRegion > 0 && copilotPostOk,
    titleVisible: title > 0,
    chatRegion: chatRegion > 0,
    quickPromptVisible: quickPrompts > 0,
    copilotPostOk,
    url: page.url(),
    consoleErrors: errors.slice(0, 10),
  };

  console.log(JSON.stringify(result, null, 2));

  await browser.close();
  process.exit(result.ok && errors.length === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
