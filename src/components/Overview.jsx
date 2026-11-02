import { Link } from 'react-router'
import { works } from '../data/loadWorks'
import { compareTasks, formatDue, isOverdue } from '../utils/tasks'

// 業務ID → 業務名 の辞書（一覧で業務名を出すため）
const workNames = Object.fromEntries(works.map((w) => [w.id, w.name]))

// 全業務を横断して「今やること」を見るビュー
function Overview({ store }) {
  const { tasks, setTasks, improvements } = store

  const openTasks = tasks.filter((t) => !t.done).sort(compareTasks)
  const activeImprovements = improvements
    .filter((i) => i.status !== '完了')
    .sort((a, b) => (a.status === b.status ? 0 : a.status === '対応中' ? -1 : 1))

  function completeTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: true } : t)))
  }

  return (
    <section className="overview">
      <div className="panel">
        <h3>未完了のタスク {openTasks.length > 0 && <span className="count">{openTasks.length}</span>}</h3>
        {openTasks.length === 0 ? (
          <p className="panel-note">未完了のタスクはありません。業務のページから追加できます</p>
        ) : (
          <ul className="item-list">
            {openTasks.map((t) => (
              <li key={t.id}>
                <input type="checkbox" checked={false} onChange={() => completeTask(t.id)} aria-label="完了にする" />
                <span className="item-title">
                  {t.title}
                  <Link to={`/work/${t.workId}`} className="item-work">
                    {workNames[t.workId] ?? t.workId}
                  </Link>
                </span>
                {t.due && (
                  <span className={isOverdue(t) ? 'task-due is-overdue' : 'task-due'}>{formatDue(t.due)}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel">
        <h3>進めている改善 {activeImprovements.length > 0 && <span className="count">{activeImprovements.length}</span>}</h3>
        {activeImprovements.length === 0 ? (
          <p className="panel-note">未完了の改善はありません。業務のページから追加できます</p>
        ) : (
          <ul className="item-list">
            {activeImprovements.map((i) => (
              <li key={i.id}>
                <span className="method-tag">{i.method}</span>
                <span className="item-title">
                  {i.title}
                  <Link to={`/work/${i.workId}`} className="item-work">
                    {workNames[i.workId] ?? i.workId}
                  </Link>
                </span>
                <span className={i.status === '対応中' ? 'status-tag is-active' : 'status-tag'}>{i.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default Overview
