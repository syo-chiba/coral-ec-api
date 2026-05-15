import { useState } from 'react'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  const [page, setPage] = useState('auth') // auth | profile

  return (
    <>
      <div className="container" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => setPage('auth')}>認証ページ</button>
          <button type="button" onClick={() => setPage('profile')}>プロフィールページ</button>
        </div>
      </div>

      {page === 'auth' ? <AuthPage /> : <ProfilePage />}
    </>
  )
}