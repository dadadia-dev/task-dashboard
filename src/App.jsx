import { Link, Route, Routes } from 'react-router'
import { isSample } from './data/loadWorks'
import useLocalStorage from './hooks/useLocalStorage'
import Home from './pages/Home'
import WorkDetail from './pages/WorkDetail'
import './App.css'

// 全画面共通の枠（見出し）と、URLごとの画面の切り替え
function App() {
  // 全業務のタスク・改善・メモ・リンク。ホームと詳細ページの両方で使うので、共通の親の App が持つ
  const [tasks, setTasks] = useLocalStorage('tasks', [])
  const [improvements, setImprovements] = useLocalStorage('improvements', [])
  const [notes, setNotes] = useLocalStorage('notes', {})
  const [links, setLinks] = useLocalStorage('links', [])

  // 子に渡すときに props が増えすぎないよう、1つにまとめる
  const store = { tasks, setTasks, improvements, setImprovements, notes, setNotes, links, setLinks }

  return (
    <main className="app">
      <header className="app-header">
        <h1>
          <Link to="/">業務ダッシュボード</Link>
        </h1>
        <span className={isSample ? 'badge' : 'badge badge-local'}>
          {isSample ? 'ダミーデータ' : '実データ（このPCのみ）'}
        </span>
      </header>

      <Routes>
        <Route path="/" element={<Home store={store} />} />
        <Route path="/work/:id" element={<WorkDetail store={store} />} />
        <Route
          path="*"
          element={
            <div className="not-found">
              <p>ページが見つかりませんでした。</p>
              <Link to="/">一覧に戻る</Link>
            </div>
          }
        />
      </Routes>
    </main>
  )
}

export default App
