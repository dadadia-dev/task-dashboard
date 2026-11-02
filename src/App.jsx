import { Link, Route, Routes } from 'react-router'
import { isSample } from './data/loadWorks'
import Home from './pages/Home'
import WorkDetail from './pages/WorkDetail'
import './App.css'

// 全画面共通の枠（見出し）と、URLごとの画面の切り替え
function App() {
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
        <Route path="/" element={<Home />} />
        <Route path="/work/:id" element={<WorkDetail />} />
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
