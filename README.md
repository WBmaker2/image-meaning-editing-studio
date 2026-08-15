# 이미지 의미 편집실

초등 4~6학년 학생이 같은 이미지의 자르기, 크기·배치, 문구, 색·대비를 비교하고 전달 효과를 화면 근거로 설명하는 국어·미술 학습 웹앱입니다.

## 학습 흐름

`처음 이미지 관찰 → 보기 방법 선택 → 보이는 변화 찾기 → 표현 효과와 화면 속 까닭 연결 → 말할 수 있는 범위 판단 → 다른 보기 방법과 비교 → 기록`

앱은 점수나 순위를 매기지 않습니다. 직접 관찰할 수 있는 변화, 가능한 느낌, 편집만으로 사실이라고 말하기 어려운 내용을 구분합니다.

## 학습 이미지

- `public/learning-scenes/`에 이미지 생성 모델로 만든 5개의 고정 학습 장면이 있습니다.
- 홈 소개 영역, 사건 카드, 사건을 연 뒤의 큰 비교 화면이 같은 생성 장면 자산을 함께 사용합니다.
- 장면은 인물·얼굴·상표·학교명·임의 글자 없이 구성했습니다.
- 안내 글과 이름표는 생성 이미지에 맡기지 않고 HTML 오버레이로 보여 주어 학생이 정확하게 읽을 수 있습니다.
- 자르기·크기·자리·색 변화는 기존 학습 프리셋이 결정적으로 적용됩니다.
- 생성 목적과 관찰 목표는 `docs/2026-08-15-generated-learning-images-plan.md`, 홈·카드 교체 계획은 `docs/2026-08-16-replace-css-drawings-plan.md`, 자산 기록은 `docs/asset-rights-ledger.md`에 남겼습니다.

## 안전과 개인정보

- 준비된 학습 이미지와 화면의 선택지만 사용합니다.
- 사진·카메라·파일·이름·위치·음성·자유 입력을 수집하지 않습니다.
- 학생 선택을 브라우저 영구 저장소에 기록하지 않습니다.
- 업로드·다운로드·공유·광고·분석 기능이 없습니다.

## 실행과 검사

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build:pages
```

## GitHub Pages

이 프로젝트는 브라우저 상태만 사용하는 정적 학습 앱으로 GitHub Pages에서도
사용할 수 있습니다.

- `npm run build:pages`: GitHub Pages용 정적 사이트 빌드
- 공개 주소: https://wbmaker2.github.io/image-meaning-editing-studio/
- 배포 방식: `.github/workflows/deploy-pages.yml`
- 정적 진입점: `pages/index.html`
