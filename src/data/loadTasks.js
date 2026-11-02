import sample from './tasks.sample.json'

// tasks.local.json（実データ）は自分のPCにだけある。
// import.meta.glob はファイルが無ければ空の {} を返すので、Vercelではダミーに切り替わる。
const local = import.meta.glob('./tasks.local.json', { eager: true, import: 'default' })
const localTasks = local['./tasks.local.json']

export const tasks = localTasks ?? sample
export const isSample = !localTasks
