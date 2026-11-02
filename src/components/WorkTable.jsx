import { Link } from 'react-router'

// 業務の一覧表。表示するデータは親から props で受け取る
function WorkTable({ works }) {
  return (
    <div className="table-wrap">
      <table className="work-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>大分類</th>
            <th>業務名</th>
            <th>対象</th>
            <th>属人度</th>
            <th>自動化余地</th>
          </tr>
        </thead>
        <tbody>
          {works.map((work) => (
            <tr key={work.id}>
              <td>{work.id}</td>
              <td>{work.category}</td>
              <td>
                <Link to={`/work/${work.id}`}>{work.name}</Link>
              </td>
              <td>{work.target}</td>
              <td>{work.ownership}</td>
              <td>{work.automation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WorkTable
