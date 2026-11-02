import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// 大分類ごとに月間時間を合計して、多い順の配列にする
function sumByCategory(tasks) {
  const totals = {}
  for (const task of tasks) {
    totals[task.category] = (totals[task.category] ?? 0) + task.monthlyHours
  }
  return Object.entries(totals)
    .map(([category, hours]) => ({ category, hours: Math.round(hours * 10) / 10 }))
    .sort((a, b) => b.hours - a.hours)
}

// 分類別の月間時間（横棒グラフ）
function CategoryChart({ tasks }) {
  const data = sumByCategory(tasks)

  return (
    <div className="panel">
      <h2>分類別の月間時間</h2>
      <ResponsiveContainer width="100%" height={data.length * 30}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 48 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="category"
            width={140}
            tickLine={false}
            axisLine={false}
            tick={{ className: 'chart-tick' }}
          />
          <Tooltip
            cursor={{ className: 'chart-cursor' }}
            formatter={(value) => [`${value}h`, '月間時間']}
            wrapperClassName="chart-tooltip"
          />
          <Bar dataKey="hours" className="chart-bar" radius={[0, 4, 4, 0]} barSize={16}>
            <LabelList dataKey="hours" position="right" formatter={(v) => `${v}h`} className="chart-label" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryChart
