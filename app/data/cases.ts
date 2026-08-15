export type EditKind = "자르기" | "크기·자리" | "글" | "색·밝기" | "여러 가지";
export type Confidence = "observable" | "plausible" | "overclaim";
export type SceneKind = "playground" | "hallway" | "garden" | "supplies" | "sharebox";

export interface Choice {
  id: string;
  label: string;
  hint?: string;
}

export interface EditPreset extends Choice {
  variant: string;
  summary: string;
  caption?: string;
  acceptedChanges: string[];
  acceptedEffects: string[];
  acceptedEvidence: string[];
  confidence: Confidence;
  caution: string;
  blocksCompletion?: boolean;
}

export interface LearningCase {
  id: string;
  number: number;
  title: string;
  focus: EditKind;
  scene: SceneKind;
  mission: string;
  purpose: string;
  alt: string;
  longDescription: string;
  objects: string[];
  baselineCaption?: string;
  presets: EditPreset[];
  changes: Choice[];
  effects: Choice[];
  evidence: Choice[];
}

export const CONFIDENCE_CHOICES: Choice[] = [
  { id: "observable", label: "화면에서 바로 확인할 수 있어요", hint: "크기·자리·글·색처럼 직접 보이는 변화" },
  { id: "plausible", label: "그렇게 느끼거나 생각할 수 있어요", hint: "화면에서 까닭을 찾았지만 사람마다 다를 수 있는 느낌" },
  { id: "overclaim", label: "이 편집만으로는 사실이라고 말하기 어려워요", hint: "사진 밖의 까닭·마음·앞일을 사실이라고 말하는 것" },
];

export const CASES: LearningCase[] = [
  {
    id: "rain-bench",
    number: 1,
    title: "비가 그친 운동장 벤치",
    focus: "자르기",
    scene: "playground",
    mission: "보이는 범위를 바꾸면 어떤 정보가 더 보이거나 가려지는지 찾아보세요.",
    purpose: "벤치에 시선 모으기",
    alt: "젖은 운동장에 벤치와 접힌 우산이 있고, 구름 사이로 밝은 하늘이 보이는 장면",
    longDescription: "왼쪽에는 물웅덩이와 운동장 선, 가운데에는 나무 벤치, 오른쪽에는 접힌 우산이 있습니다. 뒤쪽 구름 사이에는 밝은 하늘이 보입니다. 실제 인물이나 학교 표시는 없습니다.",
    objects: ["젖은 운동장", "나무 벤치", "접힌 우산", "밝은 하늘"],
    presets: [
      { id: "wide", label: "주변까지 넓게 보기", variant: "wide", summary: "벤치와 함께 운동장·우산·하늘이 보입니다.", acceptedChanges: ["context-more"], acceptedEffects: ["context"], acceptedEvidence: ["frame"], confidence: "observable", caution: "주변 상황은 더 보이지만 벤치는 작게 보일 수 있어요." },
      { id: "bench-close", label: "벤치를 중심으로 크게 보기", variant: "crop-bench", summary: "벤치가 커지고 운동장·우산·하늘 일부가 사진 밖으로 나갑니다.", acceptedChanges: ["bench-large", "context-less"], acceptedEffects: ["attention", "quiet"], acceptedEvidence: ["frame", "size"], confidence: "plausible", caution: "벤치가 먼저 눈에 띄지만 비가 그친 상황의 단서는 줄어들어요." },
      { id: "umbrella", label: "옆의 우산 자세히 보기", variant: "crop-umbrella", summary: "접힌 우산이 크게 보이고 벤치와 운동장 일부가 제외됩니다.", acceptedChanges: ["umbrella-large", "context-less"], acceptedEffects: ["attention", "rain-clue"], acceptedEvidence: ["frame", "size"], confidence: "observable", caution: "우산은 잘 보이지만 장면 전체를 대표하지는 않아요." },
    ],
    changes: [
      { id: "bench-large", label: "벤치가 더 크게 보여요" }, { id: "umbrella-large", label: "접힌 우산이 더 크게 보여요" },
      { id: "context-more", label: "주변 운동장과 하늘이 더 보여요" }, { id: "context-less", label: "주변 장소와 날씨 단서가 덜 보여요" },
    ],
    effects: [
      { id: "attention", label: "한 대상에 시선이 더 모일 수 있어요" }, { id: "context", label: "장소와 상황을 함께 살피기 쉬워요" },
      { id: "quiet", label: "조용한 느낌이 들 수 있어요" }, { id: "rain-clue", label: "비가 왔다는 단서가 먼저 눈에 띄어요" },
    ],
    evidence: [
      { id: "frame", label: "자르기 경계 안팎에 남은 사물" }, { id: "size", label: "화면에서 대상이 차지하는 크기" }, { id: "people", label: "보이지 않는 사람들의 마음" },
    ],
  },
  {
    id: "hallway-sign",
    number: 2,
    title: "복도 걷기 안내판",
    focus: "크기·자리",
    scene: "hallway",
    mission: "그림 기호와 글의 크기·자리를 바꾸며 무엇이 먼저 읽히는지 비교하세요.",
    purpose: "안전 안내를 알기 쉽게 전하기",
    alt: "발 모양 기호, 방향 화살표, 천천히 걸어요 글이 있는 복도 안내판",
    longDescription: "둥근 안내판 안에 두 발 모양 기호와 오른쪽 방향 화살표, ‘천천히 걸어요’라는 글이 있습니다. 보기 방법에 따라 세 가지의 크기와 자리만 달라집니다.",
    objects: ["발 모양 기호", "방향 화살표", "천천히 걸어요 글"],
    baselineCaption: "천천히 걸어요",
    presets: [
      { id: "icon-first", label: "기호 먼저", variant: "icon-first", summary: "발 기호가 크고 글은 아래에 작게 놓입니다.", acceptedChanges: ["icon-large", "text-small"], acceptedEffects: ["icon-attention"], acceptedEvidence: ["size", "order"], confidence: "observable", caution: "기호는 빨리 보이지만 정확한 뜻은 글을 읽어야 알 수 있어요." },
      { id: "message-first", label: "글 먼저", variant: "message-first", summary: "글이 위쪽에 크게 놓이고 기호는 뜻을 돕습니다.", acceptedChanges: ["text-large", "text-top"], acceptedEffects: ["message-attention", "clear"], acceptedEvidence: ["size", "position"], confidence: "observable", caution: "글은 또렷하지만 기호가 작아질 수 있어요." },
      { id: "balanced", label: "기호와 글 나란히", variant: "balanced", summary: "기호와 글이 비슷한 크기로 나란히 놓입니다.", acceptedChanges: ["balanced"], acceptedEffects: ["flow", "clear"], acceptedEvidence: ["order", "space"], confidence: "plausible", caution: "작은 화면에서는 위아래 읽기 순서로 바뀔 수 있어요." },
    ],
    changes: [
      { id: "icon-large", label: "발 기호가 커졌어요" }, { id: "text-small", label: "글이 작아졌어요" },
      { id: "text-large", label: "글이 커졌어요" }, { id: "text-top", label: "글이 위쪽으로 옮겨졌어요" }, { id: "balanced", label: "기호와 글이 비슷한 크기로 나란히 놓였어요" },
    ],
    effects: [
      { id: "icon-attention", label: "발 기호가 먼저 눈에 띌 수 있어요" }, { id: "message-attention", label: "행동을 알려 주는 글이 먼저 읽힐 수 있어요" },
      { id: "flow", label: "기호와 말을 이어 읽기 쉬울 수 있어요" }, { id: "clear", label: "안내 뜻을 구분하기 쉬울 수 있어요" },
    ],
    evidence: [
      { id: "size", label: "기호와 글을 서로 비교한 크기" }, { id: "position", label: "위쪽과 가운데 자리" }, { id: "order", label: "눈이 이동하는 순서" }, { id: "space", label: "기호와 글 사이의 빈 공간" },
    ],
  },
  {
    id: "garden-caption",
    number: 3,
    title: "학교 텃밭 새싹",
    focus: "글",
    scene: "garden",
    mission: "같은 장면에 붙인 글이 무엇을 보고 느끼고 행동하게 하는지 살펴보세요.",
    purpose: "새싹 관찰 기록에 어울리는 글 고르기",
    alt: "흙에서 난 새싹 옆에 작은 물뿌리개와 날짜표가 놓인 텃밭 장면",
    longDescription: "가운데 흙에서 잎 두 장의 새싹이 나와 있고, 오른쪽에는 작은 물뿌리개, 왼쪽에는 날짜표가 있습니다. 어떤 보기 방법에서도 이미지는 바뀌지 않고 글만 달라집니다.",
    objects: ["잎 두 장의 새싹", "흙", "물뿌리개", "날짜표"],
    presets: [
      { id: "observe", label: "오늘 관찰한 새싹", caption: "오늘 관찰한 새싹", variant: "caption-neutral", summary: "관찰한 대상과 시간을 담담하게 알려 줍니다.", acceptedChanges: ["caption-change"], acceptedEffects: ["observe-frame"], acceptedEvidence: ["caption"], confidence: "observable", caution: "관찰 초점은 분명하지만 느낌을 크게 이끌지는 않아요." },
      { id: "friendly", label: "조금씩 자라는 초록 친구", caption: "조금씩 자라는 초록 친구", variant: "caption-friendly", summary: "새싹을 친근하게 느끼도록 이끄는 표현입니다.", acceptedChanges: ["caption-change", "feeling-word"], acceptedEffects: ["friendly-frame"], acceptedEvidence: ["caption", "word"], confidence: "plausible", caution: "‘친구’라는 느낌은 사람마다 다를 수 있어요." },
      { id: "overclaim", label: "내일 반드시 두 배로 자라요", caption: "내일 반드시 두 배로 자라요", variant: "caption-warning", summary: "이미지만으로 확인할 수 없는 앞일을 사실처럼 말합니다.", acceptedChanges: ["caption-change", "certainty-word"], acceptedEffects: ["future-claim"], acceptedEvidence: ["word"], confidence: "overclaim", caution: "‘반드시’, ‘내일 두 배’는 이 화면만으로 확인할 수 없어요." },
    ],
    changes: [
      { id: "caption-change", label: "이미지는 같고 글만 바뀌었어요" }, { id: "feeling-word", label: "‘초록 친구’라는 느낌을 주는 말이 생겼어요" }, { id: "certainty-word", label: "‘반드시’라는 확실하게 말하는 표현이 생겼어요" },
    ],
    effects: [
      { id: "observe-frame", label: "관찰 기록처럼 읽히게 해요" }, { id: "friendly-frame", label: "새싹을 친근하게 느끼도록 이끌 수 있어요" }, { id: "future-claim", label: "화면 밖의 미래 결과를 사실처럼 말해요" },
    ],
    evidence: [
      { id: "caption", label: "이미지 아래에 붙은 전체 글" }, { id: "word", label: "‘친구’·‘반드시’ 같은 낱말" }, { id: "growth", label: "화면에 보이지 않는 내일의 성장 결과" },
    ],
  },
  {
    id: "supply-color",
    number: 4,
    title: "준비물 안내 표지",
    focus: "색·밝기",
    scene: "supplies",
    mission: "색과 밝고 어두운 차이가 느낌과 읽기 쉬움에 어떤 영향을 주는지 살펴보세요.",
    purpose: "준비물을 빠르게 알아보기",
    alt: "가위, 풀, 색종이 기호와 준비물 글이 있는 안내 표지",
    longDescription: "표지에는 가위·풀·색종이 모양과 각각의 이름이 있습니다. 색 보기 방법만 달라지고 사물·글·자리는 그대로입니다.",
    objects: ["가위 기호", "풀 기호", "색종이 기호", "준비물 글"],
    baselineCaption: "오늘의 준비물",
    presets: [
      { id: "original", label: "원래 색", variant: "color-original", summary: "처음 이미지와 같은 색을 그대로 유지합니다. 색은 바뀌지 않아요.", acceptedChanges: ["same-structure"], acceptedEffects: ["clear-items"], acceptedEvidence: ["contrast", "labels"], confidence: "observable", caution: "원래 색도 화면과 빛에 따라 다르게 보일 수 있어요." },
      { id: "muted", label: "옅고 차분한 색", variant: "color-muted", summary: "전체 색이 옅고 회색에 가까워집니다.", acceptedChanges: ["color-muted"], acceptedEffects: ["calm"], acceptedEvidence: ["saturation"], confidence: "plausible", caution: "차분함 대신 흐릿하다고 느끼는 사람도 있어요." },
      { id: "contrast", label: "차이를 또렷하게", variant: "color-contrast", summary: "바탕과 글자·기호의 밝기 차이가 커집니다.", acceptedChanges: ["contrast-up"], acceptedEffects: ["readable", "clear-items"], acceptedEvidence: ["contrast", "labels"], confidence: "observable", caution: "너무 강한 대비는 피곤하게 느껴질 수 있어요." },
      { id: "low-contrast", label: "글자가 흐린 고쳐 보기", variant: "color-low", summary: "밝은 바탕과 글자의 밝기가 비슷해 읽기 어렵습니다.", acceptedChanges: ["contrast-down"], acceptedEffects: ["hard-read"], acceptedEvidence: ["contrast"], confidence: "observable", caution: "글자가 잘 보이도록 다른 색으로 고쳐야 기록할 수 있어요.", blocksCompletion: true },
    ],
    changes: [
      { id: "same-structure", label: "사물·글·자리는 그대로예요" }, { id: "color-muted", label: "색이 옅고 회색에 가까워졌어요" }, { id: "contrast-up", label: "밝고 어두운 차이가 커졌어요" }, { id: "contrast-down", label: "글자와 바탕의 밝기 차이가 줄었어요" },
    ],
    effects: [
      { id: "clear-items", label: "도구를 서로 구분하기 쉬워요" }, { id: "calm", label: "차분한 느낌이 들 수 있어요" }, { id: "readable", label: "글자와 기호를 읽기 쉬워요" }, { id: "hard-read", label: "글자와 바탕을 구분하기 어려워요" },
    ],
    evidence: [
      { id: "contrast", label: "글자·기호와 바탕의 밝기 차이" }, { id: "saturation", label: "색이 진하거나 옅은 정도" }, { id: "labels", label: "색과 함께 적힌 도구 이름" },
    ],
  },
  {
    id: "share-box",
    number: 5,
    title: "다시 쓰는 물건 나눔함",
    focus: "여러 가지",
    scene: "sharebox",
    mission: "여러 가지 바꾸기가 느낌과 뜻에 함께 영향을 줄 수 있어요. 목적에 맞는 편집을 골라 보세요.",
    purpose: "어떤 물건을 넣는지 알리고 참여 권하기",
    alt: "공책, 연필, 자를 종류별 칸에 담아 둔 물건 나눔함",
    longDescription: "나눔함은 공책 칸, 연필 칸, 자 칸으로 나뉘며 각 물건 이름표가 있습니다. 여러 가지 보기 방법은 자르기·자리·글·색을 함께 바꿉니다.",
    objects: ["공책 칸", "연필 칸", "자 칸", "물건 이름표"],
    baselineCaption: "다시 쓰는 물건 나눔함",
    presets: [
      { id: "what", label: "넣을 물건을 또렷하게", variant: "share-what", caption: "깨끗한 공책·연필·자를 넣어요", summary: "물건 칸을 넓게 보여 주고 물건 이름을 크게 둡니다.", acceptedChanges: ["many-changes", "items-visible"], acceptedEffects: ["clear-purpose", "hierarchy"], acceptedEvidence: ["combined", "labels"], confidence: "plausible", caution: "물건은 잘 보이지만 참여를 권하는 느낌은 약할 수 있어요." },
      { id: "invite", label: "참여를 따뜻하게 권하기", variant: "share-invite", caption: "함께 나누면 다시 쓸 수 있어요", summary: "따뜻한 색과 넓은 빈 공간, 참여를 권하는 글을 함께 사용합니다.", acceptedChanges: ["many-changes", "caption-change"], acceptedEffects: ["invite", "attention"], acceptedEvidence: ["combined", "caption"], confidence: "plausible", caution: "따뜻한 느낌이 모든 사람에게 같지는 않고, 물건 정보가 덜 자세해요." },
      { id: "sort", label: "정리 방법을 먼저", variant: "share-sort", caption: "이름표를 보고 알맞은 칸에 쏙!", summary: "이름표와 칸 구분을 눈에 띄게 하고 글을 위쪽에 둡니다.", acceptedChanges: ["many-changes", "labels-large"], acceptedEffects: ["clear-purpose", "flow"], acceptedEvidence: ["combined", "labels"], confidence: "observable", caution: "정리 방법은 분명하지만 나눔의 뜻은 덜 눈에 띌 수 있어요." },
    ],
    changes: [
      { id: "many-changes", label: "자르기·자리·글·색이 함께 바뀌었어요" }, { id: "items-visible", label: "넣을 물건과 칸이 넓게 보여요" }, { id: "caption-change", label: "참여를 권하는 글이 생겼어요" }, { id: "labels-large", label: "칸 이름표가 더 크게 보여요" },
    ],
    effects: [
      { id: "clear-purpose", label: "무엇을 어떻게 넣는지 알기 쉬워요" }, { id: "hierarchy", label: "물건 정보가 먼저 눈에 띌 수 있어요" }, { id: "invite", label: "참여하고 싶은 느낌이 들 수 있어요" }, { id: "attention", label: "참여를 권하는 글에 시선이 모일 수 있어요" }, { id: "flow", label: "위의 글에서 이름표로 차례차례 읽게 돼요" },
    ],
    evidence: [
      { id: "combined", label: "자르기·자리·글·색을 함께 바꾼 모습" }, { id: "labels", label: "물건 이름표의 크기와 자리" }, { id: "caption", label: "참여를 권하는 글과 빈 공간" },
    ],
  },
];

export const findChoice = (items: Choice[], id: string | null) => items.find((item) => item.id === id)?.label ?? "선택하지 않음";
