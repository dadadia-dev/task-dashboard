// タスクの並べ替えや期限の判定。詳細ページとホームの両方で使う

// 今日の日付を "2026-11-02" の形で返す（期限との比較用）
export function today() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// 未完了で、期限が今日より前のもの
export function isOverdue(task) {
  return !task.done && Boolean(task.due) && task.due < today()
}

// "2026-11-02" → "11/02"
export function formatDue(due) {
  return due.slice(5).replace('-', '/')
}

// 未完了を先に、その中は期限の近い順（期限なしは後ろ）
export function compareTasks(a, b) {
  if (a.done !== b.done) return a.done ? 1 : -1
  if (a.due !== b.due) return (a.due || '9999') < (b.due || '9999') ? -1 : 1
  return a.createdAt < b.createdAt ? -1 : 1
}
