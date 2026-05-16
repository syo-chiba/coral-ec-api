import { useState } from 'react'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import ItemCreatePage from './pages/ItemCreatePage'
import ItemListPage from './pages/ItemListPage'
import ItemDetailPage from './pages/ItemDetailPage'

export default function App() {
  const [page, setPage] = useState('auth') // auth | profile | itemCreate | itemList | itemDetail
  const [selectedItemId, setSelectedItemId] = useState(null)

  function openItemDetail(itemId) {
    setSelectedItemId(itemId)
    setPage('itemDetail')
  }

  function backToItemList() {
    setSelectedItemId(null)
    setPage('itemList')
  }

  return (
    <>
      <div className="container" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setPage('auth')}>認証ページ</button>
          <button type="button" onClick={() => setPage('profile')}>プロフィールページ</button>
          <button type="button" onClick={() => setPage('itemCreate')}>商品出品</button>
          <button type="button" onClick={() => setPage('itemList')}>商品一覧</button>
        </div>
      </div>

      {page === 'auth' && <AuthPage />}
      {page === 'profile' && <ProfilePage />}
      {page === 'itemCreate' && <ItemCreatePage />}
      {page === 'itemList' && <ItemListPage onSelectItem={openItemDetail} />}
      {page === 'itemDetail' && (
        <ItemDetailPage itemId={selectedItemId} onBack={backToItemList} />
      )}
    </>
  )
}