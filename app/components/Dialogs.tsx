interface DialogProps {
  type: "updates" | "teacher" | "reading";
  onClose: () => void;
}

export function InfoDialog({ type, onClose }: DialogProps) {
  const content = {
    updates: {
      eyebrow: "작은 기록",
      title: "업데이트 내역",
      body: (
        <>
          <div className="update-entry">
            <div className="update-meta"><strong>v0.2.0</strong><span>2026.07.17</span></div>
            <h3>직접 관찰하고 더 정확하게 구분해요</h3>
            <ul>
              <li>화면 단서를 하나씩 확인한 뒤 편집을 시작하도록 바꿨어요.</li>
              <li>직접 확인한 사실과 가능한 느낌의 답 판정을 더 정확하게 다듬었어요.</li>
              <li>사건 미리보기와 모바일 진행 단계를 알아보기 쉽게 개선했어요.</li>
            </ul>
          </div>
          <div className="update-entry">
            <div className="update-meta"><strong>v0.1.0</strong><span>2026.07.17</span></div>
            <h3>첫 번째 학습실을 열었어요</h3>
            <ul>
              <li>자르기·배치·문구·색·종합 편집 사건 5개를 만들었어요.</li>
              <li>화면에서 바로 확인할 것과 가능한 느낌을 구분해요.</li>
              <li>실제 친구 사진은 올리지 않고 준비된 학습 장면만 사용해요.</li>
            </ul>
          </div>
        </>
      ),
    },
    teacher: {
      eyebrow: "수업 도움말",
      title: "교사용 안내",
      body: (
        <div className="dialog-copy">
          <p>이 앱은 사진의 진짜·가짜를 판정하는 도구가 아닙니다. 같은 장면에서 편집 표현이 주목점과 느낌에 줄 수 있는 영향을 비교합니다.</p>
          <h3>관찰할 여섯 가지</h3>
          <p>보이는 정보 · 편집 요소 · 주목점 · 표현 효과 · 해석 범위 · 목적에 맞는 수정</p>
          <h3>토론할 때</h3>
          <p>느낌에는 여러 답이 있을 수 있습니다. 학생이 크기·위치·문구·대비 등 화면 근거를 말하면 다른 해석도 인정해 주세요.</p>
        </div>
      ),
    },
    reading: {
      eyebrow: "언제든 다시 보기",
      title: "이미지 읽기 방법",
      body: (
        <ol className="reading-steps">
          <li><strong>무엇이 바뀌었나요?</strong><span>자른 범위, 크기, 자리, 문구, 색을 찾아요.</span></li>
          <li><strong>무엇이 먼저 보이나요?</strong><span>그렇게 본 까닭을 화면에서 하나 찾아요.</span></li>
          <li><strong>어디까지 말할 수 있나요?</strong><span>직접 관찰과 가능한 느낌, 단정을 구분해요.</span></li>
        </ol>
      ),
    },
  }[type];

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-heading"><div><p className="eyebrow">{content.eyebrow}</p><h2 id="dialog-title">{content.title}</h2></div><button className="icon-button" onClick={onClose} aria-label={`${content.title} 닫기`}>×</button></div>
        {content.body}
        <button className="primary-button full-button" onClick={onClose}>확인했어요</button>
      </section>
    </div>
  );
}
