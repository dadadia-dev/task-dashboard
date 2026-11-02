import sample from './works.sample.json'

// works.local.json（実データ）は自分のPCにだけある。
// import.meta.glob はファイルが無ければ空の {} を返すので、Vercelではダミーに切り替わる。
const local = import.meta.glob('./works.local.json', { eager: true, import: 'default' })
const localWorks = local['./works.local.json']

export const works = localWorks ?? sample
export const isSample = !localWorks
