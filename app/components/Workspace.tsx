"use client";

import { useMemo, useState } from "react";
import { CONFIDENCE_CHOICES, findChoice, type Confidence, type LearningCase } from "../data/cases";
import { SceneIllustration } from "./SceneIllustration";

type Phase = "observe" | "edit" | "analyze" | "result";
type ViewMode = "side" | "alternate";

export interface ReportEntry {
  caseId: string;
  caseNumber: number;
  caseTitle: string;
  presetLabel: string;
  changeLabels: string[];
  effectLabel: string;
  evidenceLabel: string;
  confidenceLabel: string;
  caution: string;
}

interface WorkspaceProps {
  learningCase: LearningCase;
  onExit: () => void;
  onSave: (entry: ReportEntry) => void;
  onReadingHelp: () => void;
}

export function Workspace({ learningCase, onExit, onSave, onReadingHelp }: WorkspaceProps) {
  const initialPreset = learningCase.presets[1] ?? learningCase.presets[0];
  const [phase, setPhase] = useState<Phase>("observe");
  const [viewMode, setViewMode] = useState<ViewMode>("side");
  const [showEdited, setShowEdited] = useState(true);
  const [selectedPresetId, setSelectedPresetId] = useState(initialPreset.id);
  const [changes, setChanges] = useState<string[]>([]);
  const [effect, setEffect] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);
  const [comparePresetId, setComparePresetId] = useState<string | null>(null);
  const [observedObjects, setObservedObjects] = useState<string[]>([]);

  const preset = useMemo(() => learningCase.presets.find((item) => item.id === selectedPresetId) ?? learningCase.presets[0], [learningCase, selectedPresetId]);
  const comparisonPreset = learningCase.presets.find((item) => item.id === comparePresetId);
  const phaseNumber = { observe: 1, edit: 2, analyze: 3, result: 4 }[phase];

  const resetAnalysis = () => {
    setChanges([]); setEffect(null); setEvidence(null); setConfidence(null); setFeedback(""); setSuccess(false);
  };

  const choosePreset = (id: string) => {
    setSelectedPresetId(id);
    resetAnalysis();
  };

  const toggleChange = (id: string) => {
    setChanges((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setFeedback(""); setSuccess(false);
  };

  const toggleObservedObject = (object: string) => {
    setObservedObjects((current) => current.includes(object) ? current.filter((item) => item !== object) : [...current, object]);
  };

  const observationComplete = observedObjects.length === learningCase.objects.length;

  const checkAnswer = () => {
    if (!changes.length || !effect || !evidence || !confidence) {
      setFeedback("아직 고르지 않은 항목이 있어요. 변화·효과·근거·말할 수 있는 범위를 모두 살펴봐요.");
      return;
    }
    if (preset.blocksCompletion) {
      setFeedback("읽기 어려운 점을 잘 찾았어요. 이 프리셋은 학습용 검토 예시라 기록할 수 없어요. ‘편집으로 돌아가기’에서 대비를 개선해 보세요.");
      setSuccess(false);
      return;
    }
    const changeOkay = changes.some((id) => preset.acceptedChanges.includes(id));
    const effectOkay = preset.acceptedEffects.includes(effect);
    const evidenceOkay = preset.acceptedEvidence.includes(evidence);
    const confidenceOkay = confidence === preset.confidence;

    if (!changeOkay) setFeedback("기준 이미지와 편집본에서 크기·위치·문구·색 중 실제로 달라진 부분을 다시 살펴봐요.");
    else if (!effectOkay) setFeedback("찾은 변화와 이어지는 효과를 다시 골라 보세요. 같은 편집에서도 타당한 효과는 둘 이상일 수 있어요.");
    else if (!evidenceOkay) setFeedback("효과는 타당해요. 이제 그 생각을 뒷받침하는 화면 속 크기·위치·문구·대비를 찾아봐요.");
    else if (!confidenceOkay) setFeedback(confidence === "overclaim" ? "이 효과는 화면 근거가 있어요. 화면 밖을 단정한 것인지, 가능한 느낌인지 구분해 보세요." : "사람마다 다르게 느낄 수 있는 말인지, 화면에서 바로 확인할 수 있는 말인지 다시 생각해 보세요.");
    else {
      setFeedback("좋아요! 편집 변화와 표현 효과를 구체적인 화면 근거로 연결했어요.");
      setSuccess(true);
      setPhase("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const save = () => {
    onSave({
      caseId: learningCase.id,
      caseNumber: learningCase.number,
      caseTitle: learningCase.title,
      presetLabel: preset.label,
      changeLabels: changes.map((id) => findChoice(learningCase.changes, id)),
      effectLabel: findChoice(learningCase.effects, effect),
      evidenceLabel: findChoice(learningCase.evidence, evidence),
      confidenceLabel: findChoice(CONFIDENCE_CHOICES, confidence),
      caution: preset.caution,
    });
  };

  return (
    <main className="workspace-screen">
      <div className="workspace-topline">
        <button className="back-link" onClick={onExit}>← 사건 보관함</button>
        <div className="case-progress"><span>사건 0{learningCase.number}</span><strong>{learningCase.focus}</strong></div>
        <button className="help-link" onClick={onReadingHelp}>이미지 읽기 방법</button>
      </div>
      <section className="workspace-heading">
        <div><p className="eyebrow">오늘의 편집 사건</p><h1>{learningCase.title}</h1><p>{learningCase.mission}</p></div>
        <div className="purpose-note"><span>전달 목적</span><strong>{learningCase.purpose}</strong></div>
      </section>
      <ol className="phase-stepper" aria-label="활동 진행 단계">
        {["기준 관찰", "편집 선택", "효과와 근거", "비교 기록"].map((label, index) => <li key={label} className={index + 1 === phaseNumber ? "current" : index + 1 < phaseNumber ? "done" : ""}><span>{index + 1 < phaseNumber ? "✓" : index + 1}</span>{label}</li>)}
      </ol>

      {phase === "observe" && (
        <section className="observe-layout">
          <div className="panel visual-panel">
            <div className="panel-heading"><div><p className="panel-kicker">먼저 살펴보기</p><h2>기준 이미지에는 무엇이 보이나요?</h2></div><span className="base-chip">기준 이미지</span></div>
            <SceneIllustration scene={learningCase.scene} variant="wide" alt={learningCase.alt} caption={learningCase.baselineCaption} label="편집 전" />
          </div>
          <aside className="panel observation-panel">
            <p className="panel-kicker">화면 단서</p><h2>보이는 것을 하나씩 확인해요</h2>
            <p className="observation-progress" aria-live="polite"><strong>{observedObjects.length} / {learningCase.objects.length}</strong> 화면에서 찾았어요</p>
            <ul className="object-list">{learningCase.objects.map((object, index) => {
              const observed = observedObjects.includes(object);
              return <li key={object} className={observed ? "observed" : ""}><span>{String(index + 1).padStart(2, "0")}</span><label><input type="checkbox" checked={observed} onChange={() => toggleObservedObject(object)} /><i aria-hidden="true">✓</i>{object}</label><b>{observed ? "확인했어요" : "찾아보기"}</b></li>;
            })}</ul>
            <details className="description-details"><summary>장면을 글로 자세히 읽기</summary><p>{learningCase.longDescription}</p></details>
            <div className="concept-note"><strong>기억해요</strong><p>기준 이미지도 선택된 순간과 범위를 보여 줘요. 화면 밖의 모든 상황까지 알 수 있는 것은 아니에요.</p></div>
            <button className="primary-button full-button" disabled={!observationComplete} onClick={() => setPhase("edit")}>{observationComplete ? "기준 관찰을 마쳤어요 →" : `화면 단서 ${learningCase.objects.length - observedObjects.length}개를 더 찾아요`}</button>
          </aside>
        </section>
      )}

      {phase !== "observe" && (
        <>
          <div className="comparison-toolbar">
            <div className="segmented-control" role="group" aria-label="이미지 비교 방법"><button className={viewMode === "side" ? "active" : ""} onClick={() => setViewMode("side")}>▥ 나란히 보기</button><button className={viewMode === "alternate" ? "active" : ""} onClick={() => setViewMode("alternate")}>◫ 번갈아 보기</button></div>
            {viewMode === "alternate" && <button className="swap-button" onClick={() => setShowEdited((shown) => !shown)} aria-live="polite">지금: {showEdited ? "편집본" : "기준 이미지"} · 바꾸기</button>}
          </div>
          <section className={`comparison-grid mode-${viewMode}`}>
            {(viewMode === "side" || !showEdited) && <SceneIllustration scene={learningCase.scene} variant="wide" alt={learningCase.alt} caption={learningCase.baselineCaption} label="기준 이미지" />}
            {(viewMode === "side" || showEdited) && <SceneIllustration scene={learningCase.scene} variant={preset.variant} alt={`${learningCase.alt}. ${preset.summary}`} caption={preset.caption ?? learningCase.baselineCaption} label="편집본" />}
          </section>
          <p className="change-summary" aria-live="polite"><span>이번에 바뀐 것</span>{preset.summary}</p>
        </>
      )}

      {phase === "edit" && (
        <section className="tool-panel panel">
          <div className="panel-heading"><div><p className="panel-kicker">편집 도구함</p><h2>{learningCase.focus} 프리셋을 골라 비교해요</h2></div><small>드래그 없이 선택할 수 있어요</small></div>
          <fieldset className="preset-grid"><legend className="sr-only">{learningCase.focus} 프리셋</legend>{learningCase.presets.map((item) => <label className={`preset-card ${selectedPresetId === item.id ? "selected" : ""} ${item.blocksCompletion ? "warning" : ""}`} key={item.id}><input type="radio" name="preset" checked={selectedPresetId === item.id} onChange={() => choosePreset(item.id)} /><span className="radio-mark" /><strong>{item.label}</strong><small>{item.summary}</small>{item.blocksCompletion && <i>검토 예시</i>}</label>)}</fieldset>
          <div className="tool-actions"><button className="secondary-button" onClick={() => setPhase("observe")}>기준 다시 관찰하기</button><button className="primary-button" onClick={() => setPhase("analyze")}>이 편집의 효과 살펴보기 →</button></div>
        </section>
      )}

      {phase === "analyze" && (
        <section className="analysis-grid">
          <fieldset className="analysis-card"><legend><span>1</span> 화면에서 달라진 것을 모두 골라요</legend><div className="choice-list">{learningCase.changes.map((choice) => <label key={choice.id} className={changes.includes(choice.id) ? "checked" : ""}><input type="checkbox" checked={changes.includes(choice.id)} onChange={() => toggleChange(choice.id)} /><span>✓</span>{choice.label}</label>)}</div></fieldset>
          <fieldset className="analysis-card"><legend><span>2</span> 어떤 표현 효과가 생길 수 있나요?</legend><div className="choice-list radio-list">{learningCase.effects.map((choice) => <label key={choice.id} className={effect === choice.id ? "checked" : ""}><input type="radio" name="effect" checked={effect === choice.id} onChange={() => { setEffect(choice.id); setFeedback(""); }} /><span>●</span>{choice.label}</label>)}</div></fieldset>
          <fieldset className="analysis-card"><legend><span>3</span> 그 생각의 화면 근거는 무엇인가요?</legend><div className="choice-list radio-list">{learningCase.evidence.map((choice) => <label key={choice.id} className={evidence === choice.id ? "checked" : ""}><input type="radio" name="evidence" checked={evidence === choice.id} onChange={() => { setEvidence(choice.id); setFeedback(""); }} /><span>●</span>{choice.label}</label>)}</div></fieldset>
          <fieldset className="analysis-card confidence-card"><legend><span>4</span> 어디까지 말할 수 있나요?</legend><div className="confidence-list">{CONFIDENCE_CHOICES.map((choice, index) => <label key={choice.id} className={`${confidence === choice.id ? "checked" : ""} confidence-${index}`}><input type="radio" name="confidence" checked={confidence === choice.id} onChange={() => { setConfidence(choice.id as Confidence); setFeedback(""); }} /><span className="confidence-shape">{index === 0 ? "■" : index === 1 ? "●" : "▲"}</span><strong>{choice.label}</strong><small>{choice.hint}</small></label>)}</div></fieldset>
          <div className="analysis-actions"><button className="secondary-button" onClick={() => setPhase("edit")}>편집으로 돌아가기</button><button className="primary-button" onClick={checkAnswer}>연결한 생각 확인하기 →</button></div>
          {feedback && <div className={`feedback ${success ? "success" : ""}`} role="status"><strong>{success ? "근거 연결 완료" : "한 번 더 살펴봐요"}</strong><p>{feedback}</p></div>}
        </section>
      )}

      {phase === "result" && (
        <section className="result-layout">
          <div className="result-main panel">
            <p className="eyebrow">이미지 의미 비교 기록</p><h2>편집 선택과 화면 근거를 연결했어요</h2>
            <div className="result-summary"><div><span>고른 편집</span><strong>{preset.label}</strong></div><div><span>화면에서 찾은 변화</span><strong>{changes.map((id) => findChoice(learningCase.changes, id)).join(" · ")}</strong></div><div><span>가능한 효과</span><strong>{findChoice(learningCase.effects, effect)}</strong></div><div><span>나의 화면 근거</span><strong>{findChoice(learningCase.evidence, evidence)}</strong></div><div><span>말할 수 있는 범위</span><strong>{findChoice(CONFIDENCE_CHOICES, confidence)}</strong></div></div>
            <div className="caution-note"><span>함께 생각하기</span><p>{preset.caution}</p></div>
          </div>
          <aside className="result-compare panel"><p className="panel-kicker">목적에 맞게 다시 보기</p><h2>다른 타당한 편집과 비교해요</h2><p>하나의 정답 편집만 있는 것은 아니에요. 다른 프리셋도 같은 목적에 도움이 될 수 있어요.</p>
            <div className="compare-options">{learningCase.presets.filter((item) => item.id !== preset.id && !item.blocksCompletion).map((item) => <button key={item.id} className={comparePresetId === item.id ? "selected" : ""} onClick={() => setComparePresetId(item.id)}><strong>{item.label}</strong><span>{item.summary}</span></button>)}</div>
            {comparisonPreset && <div className="comparison-insight"><strong>비교해 보니</strong><p>{comparisonPreset.caution}</p></div>}
          </aside>
          <div className="result-actions"><button className="secondary-button" onClick={() => { setPhase("edit"); setSuccess(false); }}>한 요소 다시 편집하기</button><button className="primary-button" onClick={save}>이 사건을 기록에 담기 →</button></div>
        </section>
      )}
    </main>
  );
}
