import { useState } from 'react'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import ItemCreatePage from './pages/ItemCreatePage'
import ItemListPage from './pages/ItemListPage'

export default function App() {
  const [page, setPage] = useState('auth') // auth | profile | itemCreate | itemList

  return (
    <>
      <div className="container" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => setPage('auth')}>認証ページ</button>
          <button type="button" onClick={() => setPage('profile')}>プロフィールページ</button>
          <button type="button" onClick={() => setPage('itemCreate')}>商品出品</button>
		  <button type="button" onClick={() => setPage('itemList')}>商品一覧</button>
        </div>
      </div>

      {page === 'auth' && <AuthPage />}
      {page === 'profile' && <ProfilePage />}
      {page === 'itemCreate' && <ItemCreatePage />}
	  {page === 'itemList' && <ItemListPage />}
    </>
  )
}