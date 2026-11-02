import { useState } from 'react'

// http:// か https:// で始まるURLだけを受け付ける
// （"javascript:" などを登録されると、クリックで勝手に処理が動く危険があるため）
function isWebUrl(text) {
  try {
    const url = new URL(text)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// 業務の詳細ページの「リンク」欄
// links は全業務のリンク。この業務（workId）の分だけを表示・編集する
function LinkSection({ workId, links, setLinks }) {
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const myLinks = links.filter((l) => l.workId === workId)

  function addLink(e) {
    e.preventDefault()
    if (!isWebUrl(url.trim())) {
      setError('http:// または https:// で始まるURLを入力してください')
      return
    }
    const newLink = {
      id: crypto.randomUUID(),
      workId,
      label: label.trim() || url.trim(),
      url: url.trim(),
    }
    setLinks([...links, newLink])
    setLabel('')
    setUrl('')
    setError('')
  }

  function deleteLink(id) {
    if (!window.confirm('このリンクを削除しますか？')) return
    setLinks(links.filter((l) => l.id !== id))
  }

  return (
    <section className="panel">
      <h3>リンク</h3>

      <form className="item-form" onSubmit={addLink}>
        <input
          type="text"
          placeholder="名前（例：受注管理画面）"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input type="url" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
        <button type="submit">追加</button>
      </form>
      {error && <p className="form-error">{error}</p>}

      {myLinks.length === 0 ? (
        <p className="panel-note">まだリンクはありません</p>
      ) : (
        <ul className="item-list">
          {myLinks.map((l) => (
            <li key={l.id}>
              {/* rel="noopener noreferrer"：開いた先のページから、このページを操作されないようにする */}
              <a className="item-title" href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label} ↗
              </a>
              <button type="button" className="icon-button" onClick={() => deleteLink(l.id)} aria-label="削除">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default LinkSection
