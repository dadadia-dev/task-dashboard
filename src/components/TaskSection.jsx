import { useState } from 'react'

// 今日の日付を "2026-11-02" の形で返す（期限との比較用）
function today() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// 未完了を先に、その中は期限の近い順（期限なしは後ろ）
function compareTasks(a, b) {
  if (a.done !== b.done) return a.done ? 1 : -1
  if (a.due !== b.due) return (a.due || '9999') < (b.due || '9999') ? -1 : 1
  return a.createdAt < b.createdAt ? -1 : 1
}

// 業務の詳細ページの「タスク」欄
// tasks は全業務のタスク。この業務（workId）の分だけを表示・編集する
function TaskSection({ workId, tasks, setTasks }) {
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')

  const myTasks = tasks.filter((t) => t.workId === workId).sort(compareTasks)
  const openCount = myTasks.filter((t) => !t.done).length

  function addTask(e) {
    e.preventDefault() // フォーム送信でページが再読み込みされるのを止める
    if (!title.trim()) return
    const newTask = {
      id: crypto.randomUUID(),
      workId,
      title: title.trim(),
      due,
      done: false,
      createdAt: new Date().toISOString(),
    }
    setTasks([...tasks, newTask])
    setTitle('')
    setDue('')
  }

  function toggleDone(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function deleteTask(id) {
    if (!window.confirm('このタスクを削除しますか？')) return
    setTasks(tasks.filter((t) => t.id !== id))
  }

  return (
    <section className="panel">
      <h3>タスク {openCount > 0 && <span className="count">{openCount}</span>}</h3>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="タスクを入力"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input type="date" value={due} onChange={(e) => setDue(e.target.value)} aria-label="期限" />
        <button type="submit">追加</button>
      </form>

      {myTasks.length === 0 ? (
        <p className="panel-note">まだタスクはありません</p>
      ) : (
        <ul className="task-list">
          {myTasks.map((t) => (
            <li key={t.id} className={t.done ? 'is-done' : ''}>
              <label>
                <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id)} />
                <span className="task-title">{t.title}</span>
              </label>
              {t.due && (
                <span className={!t.done && t.due < today() ? 'task-due is-overdue' : 'task-due'}>
                  {t.due.slice(5).replace('-', '/')}
                </span>
              )}
              <button type="button" className="icon-button" onClick={() => deleteTask(t.id)} aria-label="削除">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default TaskSection
