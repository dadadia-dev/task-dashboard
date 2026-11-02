// 属人度 × 自動化・委任の余地 のマトリクス
// 左上（誰でもできる × 余地が高い）ほど、すぐ手放せる業務
const AUTOMATIONS = ['高', '中', '低']
const OWNERSHIPS = [
  { value: 'C', label: 'C 誰でも可' },
  { value: 'B', label: 'B 引継ぎ可' },
  { value: 'A', label: 'A 自分のみ' },
]

// 業務の件数を、色の濃さ（0〜6の7段階）に変換する
function heatLevel(count, maxCount) {
  if (count === 0) return 0
  return Math.max(1, Math.ceil((count / maxCount) * 6))
}

function MatrixChart({ works, selected, onSelect }) {
  // 9マスそれぞれに入る業務を集める
  const cells = AUTOMATIONS.map((automation) =>
    OWNERSHIPS.map(({ value: ownership }) => ({
      automation,
      ownership,
      works: works.filter((w) => w.automation === automation && w.ownership === ownership),
    })),
  )
  const maxCount = Math.max(...cells.flat().map((c) => c.works.length))

  return (
    <div className="panel">
      <h2>属人度 × 自動化・委任の余地</h2>
      <p className="panel-note">色が濃いほど業務が多い。マスをクリックすると一覧を絞り込みます</p>
      <div className="matrix">
        <div />
        {OWNERSHIPS.map((o) => (
          <div key={o.value} className="matrix-col-label">{o.label}</div>
        ))}
        {cells.map((row, i) => (
          <div key={AUTOMATIONS[i]} className="matrix-row">
            <div className="matrix-row-label">余地 {AUTOMATIONS[i]}</div>
            {row.map((cell) => {
              const isSelected =
                selected?.automation === cell.automation && selected?.ownership === cell.ownership
              return (
                <button
                  key={cell.ownership}
                  type="button"
                  className={`matrix-cell heat-${heatLevel(cell.works.length, maxCount)}${isSelected ? ' is-selected' : ''}`}
                  title={cell.works.map((w) => w.name).join('\n') || '該当なし'}
                  onClick={() => onSelect(isSelected ? null : { automation: cell.automation, ownership: cell.ownership })}
                >
                  <span className="matrix-count">{cell.works.length}件</span>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MatrixChart
