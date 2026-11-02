import { useState } from 'react'
import { tasks, isSample } from './data/loadTasks'
import MatrixChart from './components/MatrixChart'
import TaskTable from './components/TaskTable'
import './App.css'

const OWNERSHIP_LABELS = { A: '自分しかできない', B: '教えれば引継ぎ可', C: '誰でもできる' }

function App() {
  // マトリクスで選んだマス（{ automation, ownership }）。未選択なら null
  const [selected, setSelected] = useState(null)

  const visibleTasks = selected
    ? tasks.filter((t) => t.automation === selected.automation && t.ownership === selected.ownership)
    : tasks

  return (
    <main className="app">
      <header className="app-header">
        <h1>業務ダッシュボード</h1>
        <span className={isSample ? 'badge' : 'badge badge-local'}>
          {isSample ? 'ダミーデータ' : '実データ（このPCのみ）'}
        </span>
      </header>

      <section className="summary">
        <div>
          <span className="summary-label">業務数</span>
          <span className="summary-value">{tasks.length}件</span>
        </div>
      </section>

      <section className="panels">
        <MatrixChart tasks={tasks} selected={selected} onSelect={setSelected} />
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
      <TaskTable tasks={visibleTasks} />
    </main>
  )
}

export default App
