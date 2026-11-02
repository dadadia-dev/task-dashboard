import { useState } from 'react'
import { works } from '../data/loadWorks'
import MatrixChart from '../components/MatrixChart'
import WorkTable from '../components/WorkTable'

const OWNERSHIP_LABELS = { A: '自分しかできない', B: '教えれば引継ぎ可', C: '誰でもできる' }

// ホーム：マトリクスと業務一覧
function Home() {
  // マトリクスで選んだマス（{ automation, ownership }）。未選択なら null
  const [selected, setSelected] = useState(null)

  const visibleWorks = selected
    ? works.filter((w) => w.automation === selected.automation && w.ownership === selected.ownership)
    : works

  return (
    <>
      <section className="summary">
        <div>
          <span className="summary-label">業務数</span>
          <span className="summary-value">{works.length}件</span>
        </div>
      </section>

      <section className="panels">
        <MatrixChart works={works} selected={selected} onSelect={setSelected} />
      </section>

      <div className="list-header">
        <h2>
          業務一覧
          {selected && `：余地 ${selected.automation} × ${OWNERSHIP_LABELS[selected.ownership]}`}
        </h2>
        {selected && (
          <button type="button" className="clear-button" onClick={() => setSelected(null)}>
            絞り込みを解除
          </button>
        )}
      </div>
      <WorkTable works={visibleWorks} />
    </>
  )
}

export default Home
