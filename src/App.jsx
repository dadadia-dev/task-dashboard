import { useState } from 'react'
import { tasks, isSample } from './data/loadTasks'
import CategoryChart from './components/CategoryChart'
import MatrixChart from './components/MatrixChart'
import TaskTable from './components/TaskTable'
import './App.css'

const OWNERSHIP_LABELS = { A: '自分しかできない', B: '教えれば引継ぎ可', C: '誰でもできる' }

function App() {
  // マトリクスで選んだマス（{ automation, ownership }）。未選択なら null
  const [selected, setSelected] = useState(null)

  // 月間時間の多い順に並べる（元の配列は変えずにコピーを並べ替える）
  const sortedTasks = [...tasks].sort((a, b) => b.monthlyHours - a.monthlyHours)
  const totalHours = tasks.reduce((sum, task) => sum + task.monthlyHours, 0)

  const visibleTasks = selected
    ? sortedTasks.filter((t) => t.automation === selected.automation && t.ownership === selected.ownership)
    : sortedTasks

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
        <div>
          <span className="summary-label">月間合計</span>
          <span className="summary-value">{totalHours.toFixed(1)}h</span>
        </div>
      </section>

      <section className="panels">
        <CategoryChart tasks={tasks} />
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
