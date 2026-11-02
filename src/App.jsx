import { tasks, isSample } from './data/loadTasks'
import TaskTable from './components/TaskTable'
import './App.css'

function App() {
  // 月間時間の多い順に並べる（元の配列は変えずにコピーを並べ替える）
  const sortedTasks = [...tasks].sort((a, b) => b.monthlyHours - a.monthlyHours)
  const totalHours = tasks.reduce((sum, task) => sum + task.monthlyHours, 0)

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

      <TaskTable tasks={sortedTasks} />
    </main>
  )
}

export default App
