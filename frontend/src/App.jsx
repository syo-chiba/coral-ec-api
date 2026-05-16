const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export default function App() {
  return (
    <main className="container">
      <h1>Coral EC Frontend</h1>
      <p>Step A: React + Vite のフロント土台が起動しています。</p>
      <p>
        API Base URL: <code>{apiBaseUrl}</code>
      </p>
      <ul>
        <li>次のStepで会員登録フォームを追加します。</li>
        <li>バックエンドの `/api/auth/register` と接続します。</li>
      </ul>
    </main>
  )
}
