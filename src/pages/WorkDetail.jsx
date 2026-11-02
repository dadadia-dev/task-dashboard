import { Link, useParams } from 'react-router'
import { works } from '../data/loadWorks'
import TaskSection from '../components/TaskSection'
import ImprovementSection from '../components/ImprovementSection'
import NoteSection from '../components/NoteSection'
import LinkSection from '../components/LinkSection'

const OWNERSHIP_LABELS = { A: '自分しかできない', B: '教えれば引継ぎ可', C: '誰でもできる' }

// 業務の詳細ページ。URLの /work/:id の id で、どの業務かを決める
// store には、App が持っている全データ（タスク・改善・メモ・リンク）と更新用の関数が入っている
function WorkDetail({ store }) {
  const { id } = useParams()
  const work = works.find((w) => w.id === id)

  if (!work) {
    return (
      <div className="not-found">
        <p>業務「{id}」は見つかりませんでした。</p>
        <Link to="/">一覧に戻る</Link>
      </div>
    )
  }

  return (
    <>
      <Link to="/" className="back-link">← 一覧に戻る</Link>

      <header className="work-header">
        <span className="work-id">{work.id}・{work.category}</span>
        <h2>{work.name}</h2>
        <p>{work.description}</p>
      </header>

      <dl className="work-info">
        <div>
          <dt>対象</dt>
          <dd>{work.target}</dd>
        </div>
        <div>
          <dt>頻度</dt>
          <dd>{work.frequency}</dd>
        </div>
        <div>
          <dt>依頼元</dt>
          <dd>{work.requester}</dd>
        </div>
        <div>
          <dt>属人度</dt>
          <dd>{work.ownership}：{OWNERSHIP_LABELS[work.ownership]}</dd>
        </div>
        <div>
          <dt>自動化・委任の余地</dt>
          <dd>{work.automation}</dd>
        </div>
        <div>
          <dt>使用ツール</dt>
          <dd>{work.tools.length > 0 ? work.tools.join('、') : '—'}</dd>
        </div>
      </dl>

      <div className="work-sections">
        <TaskSection workId={work.id} tasks={store.tasks} setTasks={store.setTasks} />
        <ImprovementSection
          workId={work.id}
          improvements={store.improvements}
          setImprovements={store.setImprovements}
        />
        <NoteSection workId={work.id} notes={store.notes} setNotes={store.setNotes} />
        <LinkSection workId={work.id} links={store.links} setLinks={store.setLinks} />
      </div>
    </>
  )
}

export default WorkDetail
