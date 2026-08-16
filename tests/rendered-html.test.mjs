import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("교육용 이미지 의미 편집실을 서버 렌더링한다", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /이미지 의미 편집실/);
  assert.match(html, /홈 화면/);
  assert.match(html, /같은 이미지인데/);
  assert.match(html, /실제 친구 사진은 올리지 않아요/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("프라이버시와 학습 범위 계약을 코드에 유지한다", async () => {
  const [studio, workspace, cases] = await Promise.all([
    readFile(new URL("../app/components/StudioApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Workspace.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/cases.ts", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(studio + workspace, /localStorage|sessionStorage|indexedDB|type=["']file["']/i);
  assert.match(studio, /업로드 · 다운로드 · 광고 · 추적 없음/);
  assert.match(workspace, /화면에서 달라진 것을 모두 골라요/);
  assert.match(workspace, /observedObjects/);
  assert.match(workspace, /disabled={!observationComplete}/);
  assert.match(workspace, /화면 단서.*개를 더 찾아요/);
  assert.match(workspace, /confidence === preset\.confidence/);
  assert.doesNotMatch(workspace, /preset\.confidence === ["']plausible["'].*confidence === ["']observable["']/);
  assert.match(workspace, /learningCase\.presets\[1\] \?\? learningCase\.presets\[0\]/);
  assert.doesNotMatch(workspace, /useState\(learningCase\.presets\[0\]\.id\)/);
  assert.match(cases, /observable/);
  assert.match(cases, /plausible/);
  assert.match(cases, /overclaim/);
});

test("모든 구현 파일은 500줄 미만이다", async () => {
  const paths = ["app/components/StudioApp.tsx", "app/components/Workspace.tsx", "app/components/SceneIllustration.tsx", "app/data/cases.ts", "app/styles/base.css", "app/styles/screens.css", "app/styles/scenes.css"];
  for (const path of paths) {
    const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
    assert.ok(source.split("\n").length < 500, `${path} is too long`);
  }
});
