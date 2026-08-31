"use client";

import { useState } from "react";
import { CASES, type LearningCase } from "../data/cases";
import { SCENE_IMAGES } from "../data/sceneAssets";
import { InfoDialog } from "./Dialogs";
import { Workspace, type ReportEntry } from "./Workspace";

type Screen = "welcome" | "tutorial" | "cases" | "workspace" | "report";
type DialogType = "updates" | "teacher" | "reading" | null;

const TUTORIAL = [
  { number: "01", title: "처음 사진은 일부만 골라 보여 줘요", copy: "사진에는 찍은 자리와 순간이 담겨요. 처음 사진도 모든 상황을 다 보여 주지는 않아요.", image: SCENE_IMAGES.playground, imageClass: "tutorial-scene-playground", imageAlt: "비가 그친 운동장에 벤치와 접힌 우산이 보이는 장면" },
  { number: "02", title: "한 번에 하나씩 바꾸어 봐요", copy: "자르기·크기·글·색을 한 번에 하나씩 바꿔 보세요. 무엇이 달라졌는지 비교하기 쉬워요.", image: SCENE_IMAGES.hallway, imageClass: "tutorial-scene-hallway", imageAlt: "복도 안내판에 발 모양 기호와 방향 화살표가 보이는 장면" },
  { number: "03", title: "보이는 것과 느낌을 구분해요", copy: "커진 크기는 바로 볼 수 있어요. 하지만 ‘쓸쓸하다’ 같은 느낌은 사람마다 다를 수 있어요.", image: SCENE_IMAGES.garden, imageClass: "tutorial-scene-garden", imageAlt: "학교 텃밭에서 흙 위로 새싹과 물뿌리개가 보이는 장면" },
];

export function StudioApp() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [tutorialStep, setTutorialStep] = useState(0);
  const [activeCase, setActiveCase] = useState<LearningCase>(CASES[0]);
  const [reports, setReports] = useState<ReportEntry[]>([]);
  const [dialog, setDialog] = useState<DialogType>(null);

  const goToScreen = (nextScreen: Screen) => {
    setScreen(nextScreen);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const openCase = (learningCase: LearningCase) => {
    setActiveCase(learningCase);
    goToScreen("workspace");
  };

  const saveReport = (entry: ReportEntry) => {
    setReports((current) => [...current.filter((item) => item.caseId !== entry.caseId), entry]);
    goToScreen("cases");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => goToScreen("welcome")} aria-label="이미지 의미 편집실 처음 화면">
          <span className="brand-mark"><i /><i /></span>
          <span><strong>이미지 의미 편집실</strong><small>같은 이미지, 달라지는 느낌과 뜻</small></span>
        </button>
        <nav className="header-actions" aria-label="사이트 메뉴">
          <button className="text-button home-button" onClick={() => goToScreen("welcome")} aria-label="홈 화면으로 이동">홈 화면</button>
          <button className="text-button teacher-button" onClick={() => setDialog("teacher")}>교사용 안내</button>
          <button className="text-button" onClick={() => setDialog("updates")}><span className="status-dot" /> 업데이트 내역</button>
        </nav>
      </header>

      {screen === "welcome" && (
        <main className="welcome-screen">
          <section className="hero-copy">
            <p className="eyebrow"><span>국어 × 미술</span> 이미지 읽기 작업대</p>
            <h1>같은 이미지인데,<br /><em>왜 다르게 느껴질까요?</em></h1>
            <p className="hero-description">사진의 범위·크기·자리·글·색을 바꿔 보세요. 무엇이 먼저 보이는지 화면에서 까닭을 하나 찾아 말해요.</p>
            <div className="hero-actions">
              <button className="primary-button gi-pulse" onClick={() => goToScreen("tutorial")}>편집 실험 시작하기 <span>→</span></button>
              <button className="secondary-button" onClick={() => goToScreen("cases")}>활동 먼저 보기</button>
            </div>
            <p className="privacy-note"><span>✓</span> 실제 친구 사진은 올리지 않아요 · 이름과 답을 저장하지 않아요</p>
          </section>
          <section className="hero-lab" aria-label="같은 장면을 다르게 자른 예시">
            <div className="lab-note note-one">무엇이 남았나요?</div>
            <div className="lab-note note-two">무엇이 먼저 보이나요?</div>
            <div className="photo-sheet sheet-wide">
              <div className="hero-scene-frame hero-scene-wide-frame">
                {/* Native img keeps the same asset path for Next and the GitHub Pages build. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="hero-scene-image hero-scene-wide" src={SCENE_IMAGES.playground} alt="비가 그친 운동장 벤치와 접힌 우산" />
              </div>
              <strong>주변까지 넓게</strong><small>운동장 · 벤치 · 우산</small>
            </div>
            <div className="photo-sheet sheet-close">
              <div className="hero-scene-frame hero-scene-close-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="hero-scene-image hero-scene-close" src={SCENE_IMAGES.playground} alt="벤치를 가까이 자른 장면" />
              </div>
              <strong>벤치를 중심으로</strong><small>벤치가 더 크게 보여요</small>
            </div>
            <div className="comparison-arrow">↔</div>
            <div className="tape tape-one" /><div className="tape tape-two" />
          </section>
        </main>
      )}

      {screen === "tutorial" && (
        <main className="tutorial-screen">
          <div className="tutorial-header"><p className="eyebrow">시작 전 짧은 안내</p><h1>이미지를 읽는 세 가지 약속</h1><p>정답을 빨리 찾기보다 화면에서 까닭을 찾는 연습이에요.</p></div>
          <section className="tutorial-card">
            <div className="tutorial-progress" aria-label={`3단계 중 ${tutorialStep + 1}단계`}>{TUTORIAL.map((_, index) => <span key={index} className={index <= tutorialStep ? "active" : ""} />)}</div>
            <div className="tutorial-symbol">
              {/* Native img keeps the same generated scene assets as the learning cases. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={`tutorial-scene-image ${TUTORIAL[tutorialStep].imageClass}`} src={TUTORIAL[tutorialStep].image} alt={TUTORIAL[tutorialStep].imageAlt} />
            </div>
            <p className="step-number">약속 {TUTORIAL[tutorialStep].number}</p>
            <h2>{TUTORIAL[tutorialStep].title}</h2>
            <p>{TUTORIAL[tutorialStep].copy}</p>
            <div className="tutorial-example">
              {tutorialStep === 0 && <><b>넓은 장면</b><span>장소와 주변 단서가 보여요.</span><b>가까운 장면</b><span>대상은 커지지만 주변은 줄어요.</span></>}
              {tutorialStep === 1 && <><b>이번 실험</b><span>자르기만 바꾸기</span><b>그대로 두기</b><span>글·색·장면</span></>}
              {tutorialStep === 2 && <><b>바로 확인</b><span>“벤치가 커졌어요.”</span><b>가능한 느낌</b><span>“조용하게 느낄 수 있어요.”</span><b>사실이라 말하기 어려움</b><span>“모두가 운동을 싫어해요.”</span></>}
            </div>
            <div className="tutorial-actions">
              <button className="secondary-button" onClick={() => tutorialStep === 0 ? goToScreen("welcome") : setTutorialStep((step) => step - 1)}>이전</button>
              <button className="primary-button gi-pulse" onClick={() => tutorialStep === 2 ? goToScreen("cases") : setTutorialStep((step) => step + 1)}>{tutorialStep === 2 ? "활동 고르기" : "다음 약속"} →</button>
            </div>
          </section>
          <button className="skip-button" onClick={() => goToScreen("cases")}>안내를 건너뛰고 활동 보기</button>
        </main>
      )}

      {screen === "cases" && (
        <main className="case-screen">
          <section className="case-heading">
            <div><p className="eyebrow">편집 활동 모음</p><h1>어떤 변화를 살펴볼까요?</h1><p>활동은 순서대로 해도 되고, 궁금한 바꾸기 방법부터 골라도 돼요.</p></div>
            <div className="record-counter"><strong>{reports.length}</strong><span>/ {CASES.length} 활동 기록</span></div>
          </section>
          <div className="case-grid">
            {CASES.map((learningCase) => {
              const complete = reports.some((entry) => entry.caseId === learningCase.id);
              return (
                <article className={`case-card focus-${learningCase.number}`} key={learningCase.id}>
                  <div className="case-card-top"><span className="case-number">0{learningCase.number}</span><span className="focus-chip">{learningCase.focus}</span></div>
                  <div className="case-thumbnail" aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="case-thumbnail-image" src={SCENE_IMAGES[learningCase.scene]} alt="" loading="lazy" decoding="async" />
                  </div>
                  <h2>{learningCase.title}</h2><p>{learningCase.mission}</p>
                  <div className="case-card-bottom"><button onClick={() => openCase(learningCase)}>{complete ? "다시 살펴보기" : "활동 열기"} <span>→</span></button>{complete && <span className="complete-mark">✓ 기록됨</span>}</div>
                </article>
              );
            })}
          </div>
          {reports.length > 0 && <button className="report-button" onClick={() => goToScreen("report")}>나의 이미지 의미 비교 기록 보기 <span>{reports.length}</span></button>}
        </main>
      )}

      {screen === "workspace" && <Workspace learningCase={activeCase} onExit={() => goToScreen("cases")} onSave={saveReport} onReadingHelp={() => setDialog("reading")} />}

      {screen === "report" && (
        <main className="report-screen">
          <div className="report-heading"><p className="eyebrow">점수가 아닌 생각의 기록</p><h1>나의 이미지 비교 기록</h1><p>편집으로 달라진 것과 화면에서 찾은 까닭을 모았어요.</p></div>
          <div className="report-list">
            {reports.map((entry) => <article className="report-entry" key={entry.caseId}><div><span>활동 0{entry.caseNumber}</span><strong>{entry.caseTitle}</strong></div><dl><dt>고른 편집</dt><dd>{entry.presetLabel}</dd><dt>화면에서 찾은 변화</dt><dd>{entry.changeLabels.join(" · ")}</dd><dt>생길 수 있는 느낌과 뜻</dt><dd>{entry.effectLabel}</dd><dt>화면에서 찾은 까닭</dt><dd>{entry.evidenceLabel}</dd><dt>말할 수 있는 범위</dt><dd>{entry.confidenceLabel}</dd></dl><p>{entry.caution}</p></article>)}
          </div>
          <div className="report-reminder"><strong>기억해요</strong><p>보여 주는 방법이 달라진 것과 실제 장면이 달라진 것은 같지 않아요. 느낌에는 여러 답이 있을 수 있으니 화면에서 찾은 까닭을 함께 말해요.</p></div>
          <button className="primary-button gi-pulse" onClick={() => goToScreen("cases")}>다른 활동 살펴보기</button>
        </main>
      )}

      <footer className="footer"><p>준비된 가상 학습 장면만 사용합니다.</p><p>업로드 · 다운로드 · 광고 · 추적 없음</p></footer>
      {dialog && <InfoDialog type={dialog} onClose={() => setDialog(null)} />}
    </div>
  );
}
