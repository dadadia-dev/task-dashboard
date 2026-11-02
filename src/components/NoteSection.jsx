// 業務の詳細ページの「手順・メモ」欄
// notes は { 業務ID: メモの文章 } の形。入力するたびに自動で保存される
function NoteSection({ workId, notes, setNotes }) {
  const text = notes[workId] ?? ''

  function changeText(value) {
    setNotes({ ...notes, [workId]: value })
  }

  return (
    <section className="panel">
      <h3>手順・メモ</h3>
      <textarea
        className="note-area"
        placeholder={'やり方・注意点・引継ぎに必要なことなど\n例）\n1. 管理画面で新規受注を確認\n2. 配送伝票を作成…'}
        value={text}
        onChange={(e) => changeText(e.target.value)}
        rows={10}
      />
      <p className="panel-note">入力した内容は自動で保存されます</p>
    </section>
  )
}

export default NoteSection
