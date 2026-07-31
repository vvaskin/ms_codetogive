import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

async function render(pathname) {
  let response = await worker.fetch(
    new Request(`https://love21-clone.test${pathname}`, {
      headers: { accept: "text/html" },
    }),
    env,
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
  if ([301, 302, 307, 308].includes(response.status)) {
    const location = response.headers.get("location");
    assert.ok(location, `${pathname} redirect should include a location`);
    response = await worker.fetch(
      new Request(new URL(location, "https://love21-clone.test"), {
        headers: { accept: "text/html" },
      }),
      env,
      {
        waitUntil() {},
        passThroughOnException() {},
      },
    );
  }
  assert.equal(response.status, 200, `${pathname} should render`);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  return response.text();
}

test("homepage renders the current Love 21 identity", async () => {
  const html = await render("/");
  assert.match(html, /#Somuchability/);
  assert.match(html, /Development copy/);
  assert.match(html, /LOVE 21 Foundation/);
  assert.doesNotMatch(html, /codex-preview/i);
});

test("all public English and Traditional Chinese routes render", async () => {
  const routes = [
    "/our-story/",
    "/our-finance/",
    "/our-programmes/",
    "/our-volunteer/",
    "/join-us/",
    "/board-of-directors/",
    "/staff/",
    "/media/",
    "/donate/",
    "/contact-us/",
    "/login/",
    "/password-reset/",
    "/events",
    "/zh/",
    "/zh/our-story-hk/",
    "/zh/our-finance-hk/",
    "/zh/our-volunteer-hk/",
    "/zh/%E5%AA%92%E9%AB%94%E5%A0%B1%E5%B0%8E",
    "/zh/%E5%8A%A0%E5%85%A5%E6%88%91%E5%80%91",
    "/zh/board-of-directors-hk/",
    "/zh/staff-hk/",
    "/zh/our-programmes-hk/",
    "/zh/contact-us-hk/",
    "/zh/donate-hk/",
    "/zh/login-hk/",
    "/zh/raffle2025/",
    "/board-of-directors/carol-chan/",
    "/board-of-directors/elenisymeonidou/",
    "/board-of-directors/jeff-sayed/",
    "/board-of-directors/matthew-hosford/",
    "/board-of-directors/kevin-wong/",
    "/board-of-directors/young-sook-stewart/",
    "/board-of-directors/lobo-cheung/",
    "/board-of-directors/dan-maley/",
    "/board-of-directors/edith-chen/",
    "/board-of-directors/james-barrett/",
    "/board-of-directors/raymond-tam/",
    "/board-of-directors/dr-ruby-ng/",
    "/beyond-limits-banquet/",
    "/raffle2025-2/",
    "/love-21s-open-secret-to-a-long-happy-life/",
    "/hong-kongs-love-21-foundation-aims/",
    "/hong-kong-yacht-club-and-charity-team-up-to-help-special-needs-teens-learn-dragon-boating/",
    "/hong-kong-charity-offers-free-diet-advice-and-guidance-for-children-with-intellectual-disabilities-in-low-income-families/",
  ];

  for (const pathname of routes) {
    const html = await render(pathname);
    assert.match(html, /Love 21/i);
  }
});

test("the clone does not hotlink WordPress images", async () => {
  const html = await render("/");
  assert.doesNotMatch(html, /src="https?:\/\/[^"]*wp-content/i);
});
