import { useState } from 'react'
import { compareTasks, formatDue, isOverdue } from '../utils/tasks'

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

      <form className="item-form" onSubmit={addTask}>
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
        <ul className="item-list">
          {myTasks.map((t) => (
            <li key={t.id} className={t.done ? 'is-done' : ''}>
              <label>
                <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id)} />
                <span className="item-title">{t.title}</span>
              </label>
              {t.due && (
                <span className={isOverdue(t) ? 'task-due is-overdue' : 'task-due'}>{formatDue(t.due)}</span>
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
