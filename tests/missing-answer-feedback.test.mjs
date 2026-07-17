import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("빠뜨린 분석 답의 번호와 이름을 알려 준다", async () => {
  const workspace = await readFile(new URL("../app/components/Workspace.tsx", import.meta.url), "utf8");

  for (const label of ["1번 달라진 점", "2번 느낌과 뜻", "3번 화면 속 까닭", "4번 말할 수 있는 범위"]) {
    assert.match(workspace, new RegExp(label));
  }
  assert.match(workspace, /아직 고르지 않은 곳: \$\{missingAnswers\.join\(" · "\)\}/);
  assert.match(workspace, /위에서부터 하나씩 골라 보세요/);
});
