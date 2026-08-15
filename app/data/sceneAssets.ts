import type { SceneKind } from "./cases";

export const SCENE_IMAGES: Record<SceneKind, string> = {
  playground: "learning-scenes/rain-bench.png",
  hallway: "learning-scenes/hallway-sign.png",
  garden: "learning-scenes/garden-caption.png",
  supplies: "learning-scenes/supply-sign.png",
  sharebox: "learning-scenes/share-box.png",
};

/** Short, student-friendly clues for the visual change shown on the right card. */
export const VISUAL_CHANGE_NOTES: Record<string, string> = {
  "crop-bench": "벤치를 크게 봐요",
  "crop-umbrella": "우산을 크게 봐요",
  "icon-first": "기호를 먼저 봐요",
  "message-first": "글을 크게 봐요",
  balanced: "기호와 글을 같이 봐요",
  "caption-neutral": "관찰 글만 바꿔요",
  "caption-friendly": "친근한 글로 바꿔요",
  "caption-warning": "확인할 수 없는 말을 찾아요",
  "color-original": "색을 그대로 둬요",
  "color-muted": "색을 옅게 바꿔요",
  "color-contrast": "밝고 어둡게 또렷해요",
  "color-low": "글자와 바탕이 비슷해요",
  "share-what": "물건과 이름표를 크게 봐요",
  "share-invite": "따뜻한 참여 글을 봐요",
  "share-sort": "이름표 순서를 먼저 봐요",
};
