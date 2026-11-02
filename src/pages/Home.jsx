import { useState } from 'react'
import { works } from '../data/loadWorks'
import { isOverdue } from '../utils/tasks'
import MatrixChart from '../components/MatrixChart'
import Overview from '../components/Overview'
import WorkTable from '../components/WorkTable'

const OWNERSHIP_LABELS = { A: '自分しかできない', B: '教えれば引継ぎ可', C: '誰でもできる' }

// 業務ごとの件数を数える（{ "EC-01": { tasks: 2, improvements: 1 }, ... }）
function countByWork(tasks, improvements) {
  const counts = {}
  const get = (id) => (counts[id] ??= { tasks: 0, improvements: 0 })
  for (const t of tasks) if (!t.done) get(t.workId).tasks++
  for (const i of improvements) if (i.status === '対応中') get(i.workId).improvements++
  return counts
}

// ホーム：横断ビュー・マトリクス・業務一覧
function Home({ store }) {
  // マトリクスで選んだマス（{ automation, ownership }）。未選択なら null
  const [selected, setSelected] = useState(null)

  const { tasks, improvements } = store
  const openTasks = tasks.filter((t) => !t.done)
  const overdueCount = openTasks.filter(isOverdue).length
  const activeImprovementCount = improvements.filter((i) => i.status === '対応中').length
  const counts = countByWork(tasks, improvements)

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
        <div>
          <span className="summary-label">未完了のタスク</span>
          <span className="summary-value">
            {openTasks.length}件
            {overdueCount > 0 && <span className="summary-alert">期限切れ {overdueCount}</span>}
          </span>
        </div>
        <div>
          <span className="summary-label">対応中の改善</span>
          <span className="summary-value">{activeImprovementCount}件</span>
        </div>
      </section>

      <Overview store={store} />

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
      <WorkTable works={visibleWorks} counts={counts} />
    </>
  )
}

export default Home
