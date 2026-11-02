import { useEffect, useState } from 'react'

const PREFIX = 'task-dashboard:'

// useState と同じ使い方で、値をブラウザ（localStorage）にも保存するフック
// 再読み込みしても、前回の値から始まる
function useLocalStorage(key, initialValue) {
  const storageKey = PREFIX + key

  // 最初の1回だけ、保存されている値を読み込む
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  // 値が変わるたびに保存する
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value))
    } catch {
      // 保存できない環境（プライベートブラウズ等）では、画面上だけで動かす
    }
  }, [storageKey, value])

  return [value, setValue]
}

export default useLocalStorage
