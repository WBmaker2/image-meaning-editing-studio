import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("휴대폰에서는 처음 이미지를 한 장씩 보여 준다", async () => {
  const workspace = await readFile(new URL("../app/components/Workspace.tsx", import.meta.url), "utf8");

  assert.match(workspace, /const MOBILE_QUERY = "\(max-width: 600px\)"/);
  assert.match(workspace, /useSyncExternalStore\(subscribeToMobile, getIsMobile, getServerIsMobile\)/);
  assert.match(workspace, /chosenViewMode \?\? \(isMobile \? "alternate" : "side"\)/);
  assert.match(workspace, /const \[showEdited, setShowEdited\] = useState\(false\)/);
  assert.match(workspace, /한 장씩 보기/);
  assert.match(workspace, /지금: \{showEdited \? "바꾼 이미지" : "처음 이미지"\}/);
  assert.match(workspace, /aria-pressed=\{viewMode === "side"\}/);
});
