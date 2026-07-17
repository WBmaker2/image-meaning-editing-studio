import type { SceneKind } from "../data/cases";

interface SceneIllustrationProps {
  scene: SceneKind;
  variant: string;
  alt: string;
  caption?: string;
  label: string;
}

function PlaygroundScene() {
  return (
    <div className="scene playground-scene">
      <div className="sky"><span className="cloud cloud-one" /><span className="cloud cloud-two" /><span className="sun-break" /></div>
      <div className="field"><span className="field-line" /><span className="puddle puddle-one" /><span className="puddle puddle-two" /></div>
      <div className="bench"><span /><span /><i /><i /></div>
      <div className="umbrella"><span>⌁</span></div>
      <div className="scene-tag tag-weather">비가 그친 하늘</div>
      <div className="scene-tag tag-bench">벤치</div>
      <div className="scene-tag tag-umbrella">접힌 우산</div>
    </div>
  );
}

function HallwayScene() {
  return (
    <div className="scene hallway-scene">
      <div className="sign-copy">천천히 걸어요</div>
      <div className="footprints"><span>●</span><span>●</span></div>
      <div className="arrow">→</div>
      <div className="floor-lines"><span /><span /><span /></div>
    </div>
  );
}

function GardenScene() {
  return (
    <div className="scene garden-scene">
      <div className="garden-sky" />
      <div className="soil"><span className="soil-dot one" /><span className="soil-dot two" /></div>
      <div className="sprout"><span className="stem" /><span className="leaf left" /><span className="leaf right" /></div>
      <div className="watering-can"><span className="can-body">물</span><span className="can-spout" /></div>
      <div className="date-stake">7.17</div>
    </div>
  );
}

function SuppliesScene() {
  return (
    <div className="scene supplies-scene">
      <div className="supply-title">오늘의 준비물</div>
      <div className="supply-row">
        <div className="supply-item"><span className="supply-icon">✂</span><b>가위</b></div>
        <div className="supply-item"><span className="supply-icon">▣</span><b>풀</b></div>
        <div className="supply-item"><span className="paper-stack"><i /><i /><i /></span><b>색종이</b></div>
      </div>
    </div>
  );
}

function ShareBoxScene() {
  return (
    <div className="scene sharebox-scene">
      <div className="share-title">다시 쓰는 물건 나눔함</div>
      <div className="box-grid">
        <div className="box-cell notebooks"><span className="notebook one" /><span className="notebook two" /><b>공책</b></div>
        <div className="box-cell pencils"><span>✎</span><span>✎</span><b>연필</b></div>
        <div className="box-cell rulers"><span>▥</span><b>자</b></div>
      </div>
    </div>
  );
}

export function SceneIllustration({ scene, variant, alt, caption, label }: SceneIllustrationProps) {
  return (
    <figure className={`visual-card visual-${variant}`}>
      <div className="visual-label"><span>{label}</span><small>{variant === "wide" ? "기준 범위" : "현재 선택"}</small></div>
      <div className="scene-window" role="img" aria-label={alt}>
        {scene === "playground" && <PlaygroundScene />}
        {scene === "hallway" && <HallwayScene />}
        {scene === "garden" && <GardenScene />}
        {scene === "supplies" && <SuppliesScene />}
        {scene === "sharebox" && <ShareBoxScene />}
      </div>
      {caption && <figcaption className="image-caption">{caption}</figcaption>}
    </figure>
  );
}
