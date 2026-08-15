import type { SceneKind } from "../data/cases";
import { SCENE_IMAGES, VISUAL_CHANGE_NOTES } from "../data/sceneAssets";
import "../styles/generated-scenes.css";

interface SceneIllustrationProps {
  scene: SceneKind;
  variant: string;
  alt: string;
  caption?: string;
  label: string;
}

function PlaygroundOverlay() {
  return (
    <>
      <div className="scene-tag tag-weather">비가 그친 하늘</div>
      <div className="scene-tag tag-bench">벤치</div>
      <div className="scene-tag tag-umbrella">접힌 우산</div>
    </>
  );
}

function HallwayOverlay() {
  return <div className="sign-copy">천천히 걸어요</div>;
}

function GardenOverlay() {
  return <div className="date-stake">7.17</div>;
}

function SuppliesOverlay() {
  return (
    <>
      <div className="supply-title">오늘의 준비물</div>
      <div className="supply-labels" aria-hidden="true">
        <span>가위</span><span>풀</span><span>색종이</span>
      </div>
    </>
  );
}

function ShareBoxOverlay() {
  return (
    <>
      <div className="share-title">다시 쓰는 물건 나눔함</div>
      <div className="share-labels" aria-hidden="true">
        <span>공책</span><span>연필</span><span>자</span>
      </div>
    </>
  );
}

function SceneOverlay({ scene }: { scene: SceneKind }) {
  if (scene === "playground") return <PlaygroundOverlay />;
  if (scene === "hallway") return <HallwayOverlay />;
  if (scene === "garden") return <GardenOverlay />;
  if (scene === "supplies") return <SuppliesOverlay />;
  return <ShareBoxOverlay />;
}

export function SceneIllustration({ scene, variant, alt, caption, label }: SceneIllustrationProps) {
  const changeNote = VISUAL_CHANGE_NOTES[variant] ?? "달라진 점을 찾아요";

  return (
    <figure className={`visual-card visual-${variant}`}>
      <div className="visual-label">
        <span>{label}</span>
        <small>
          {variant === "wide" ? "기준 범위" : <>현재 선택 · <b className="visual-change-note">{changeNote}</b></>}
        </small>
      </div>
      <div className="scene-window" role="img" aria-label={alt}>
        <div className={`scene scene-${scene}`}>
          {/* Native img keeps the same asset path for Next and the GitHub Pages build. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="scene-image" src={SCENE_IMAGES[scene]} alt="" aria-hidden="true" />
          <SceneOverlay scene={scene} />
        </div>
      </div>
      {caption && <figcaption className="image-caption">{caption}</figcaption>}
    </figure>
  );
}
