// 業務の一覧表。表示するデータは親（App）から props で受け取る
function TaskTable({ tasks }) {
  return (
    <div className="table-wrap">
      <table className="task-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>大分類</th>
            <th>業務名</th>
            <th>対象</th>
            <th className="num">月間(h)</th>
            <th>属人度</th>
            <th>自動化余地</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.category}</td>
              <td>{task.name}</td>
              <td>{task.target}</td>
              <td className="num">{task.monthlyHours}</td>
              <td>{task.ownership}</td>
              <td>{task.automation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TaskTable
