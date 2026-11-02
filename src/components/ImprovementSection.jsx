import { useState } from 'react'

const METHODS = ['自動化', '委任', 'テンプレ化', 'やめる', 'その他']
const STATUSES = ['未着手', '対応中', '完了']

// 対応中 → 未着手 → 完了 の順に並べる
const STATUS_ORDER = { 対応中: 0, 未着手: 1, 完了: 2 }

// 業務の詳細ページの「改善」欄
// improvements は全業務の改善。この業務（workId）の分だけを表示・編集する
function ImprovementSection({ workId, improvements, setImprovements }) {
  const [title, setTitle] = useState('')
  const [method, setMethod] = useState(METHODS[0])

  const myItems = improvements
    .filter((i) => i.workId === workId)
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
  const activeCount = myItems.filter((i) => i.status === '対応中').length

  function addItem(e) {
    e.preventDefault()
    if (!title.trim()) return
    const newItem = {
      id: crypto.randomUUID(),
      workId,
      title: title.trim(),
      method,
      status: '未着手',
      createdAt: new Date().toISOString(),
    }
    setImprovements([...improvements, newItem])
    setTitle('')
  }

  function changeStatus(id, status) {
    setImprovements(improvements.map((i) => (i.id === id ? { ...i, status } : i)))
  }

  function deleteItem(id) {
    if (!window.confirm('この改善を削除しますか？')) return
    setImprovements(improvements.filter((i) => i.id !== id))
  }

  return (
    <section className="panel">
      <h3>改善 {activeCount > 0 && <span className="count">対応中 {activeCount}</span>}</h3>

      <form className="item-form" onSubmit={addItem}>
        <input
          type="text"
          placeholder="改善のアイデア（例：受注メールを自動集計）"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={method} onChange={(e) => setMethod(e.target.value)} aria-label="方法">
          {METHODS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <button type="submit">追加</button>
      </form>

      {myItems.length === 0 ? (
        <p className="panel-note">まだ改善はありません</p>
      ) : (
        <ul className="item-list">
          {myItems.map((i) => (
            <li key={i.id} className={i.status === '完了' ? 'is-done' : ''}>
              <span className="method-tag">{i.method}</span>
              <span className="item-title">{i.title}</span>
              <select
                className={`status-select status-${STATUSES.indexOf(i.status)}`}
                value={i.status}
                onChange={(e) => changeStatus(i.id, e.target.value)}
                aria-label="状態"
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button type="button" className="icon-button" onClick={() => deleteItem(i.id)} aria-label="削除">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ImprovementSection
