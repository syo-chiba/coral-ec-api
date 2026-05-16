import { useEffect, useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export default function ItemListPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    setLoading(true)
    setErrorMessage('')

    try {
      const res = await fetch(`${apiBaseUrl}/api/items`)
      const data = await res.json().catch(() => [])

      if (res.status === 200) {
        setItems(Array.isArray(data) ? data : [])
        return
      }

      setErrorMessage(`商品一覧の取得に失敗しました: ${res.status}`)
    } catch {
      setErrorMessage('通信に失敗しました。バックエンド起動とCORS設定を確認してください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1>商品一覧（Step E-2）</h1>
      <p className="sub">
        API: <code>{apiBaseUrl}/api/items</code>
      </p>

      <button type="button" onClick={fetchItems} disabled={loading}>
        {loading ? '読み込み中...' : '再読み込み'}
      </button>

      {errorMessage && <p className="error">{errorMessage}</p>}

      {!loading && items.length === 0 && !errorMessage && (
        <p className="empty">まだ商品がありません。商品出品から登録してください。</p>
      )}

      <div className="item-grid">
        {items.map((item) => (
          <article className="item-card" key={item.id}>
            <div className="item-card-header">
              <h2>{item.title}</h2>
              <span className="badge">{item.condition}</span>
            </div>

            <p className="item-price">{item.price.toLocaleString()}円</p>

            {item.category && (
              <p className="item-meta">カテゴリ: {item.category}</p>
            )}

            <p className="item-description">{item.description}</p>

            <p className="item-meta">
              出品者ID: {item.sellerId} / 状態: {item.status}
            </p>
          </article>
        ))}
      </div>
    </main>
  )
}