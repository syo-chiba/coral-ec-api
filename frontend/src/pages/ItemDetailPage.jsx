import { useEffect, useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export default function ItemDetailPage({ itemId, onBack }) {
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetchItem()
  }, [itemId])

  async function fetchItem() {
    if (!itemId) {
      setErrorMessage('商品IDが指定されていません。')
      return
    }

    setLoading(true)
    setErrorMessage('')

    try {
      const res = await fetch(`${apiBaseUrl}/api/items/${itemId}`)
      const data = await res.json().catch(() => ({}))

      if (res.status === 200) {
        setItem(data)
        return
      }

      if (res.status === 404) {
        setErrorMessage('商品が見つかりません。')
        return
      }

      setErrorMessage(`商品詳細の取得に失敗しました: ${res.status}`)
    } catch {
      setErrorMessage('通信に失敗しました。バックエンド起動とCORS設定を確認してください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <button type="button" onClick={onBack}>
        一覧へ戻る
      </button>

      <h1>商品詳細（Step E-4）</h1>
      <p className="sub">
        API: <code>{apiBaseUrl}/api/items/{itemId}</code>
      </p>

      {loading && <p>読み込み中...</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}

      {item && (
        <article className="detail-card">
          <div className="item-card-header">
            <h2>{item.title}</h2>
            <span className="badge">{item.condition}</span>
          </div>

          <p className="item-price">{item.price.toLocaleString()}円</p>

          {item.category && (
            <p className="item-meta">カテゴリ: {item.category}</p>
          )}

          <section>
            <h3>説明</h3>
            <p className="item-description">{item.description}</p>
          </section>

          <section>
            <h3>出品情報</h3>
            <p className="item-meta">商品ID: {item.id}</p>
            <p className="item-meta">出品者ID: {item.sellerId}</p>
            <p className="item-meta">ステータス: {item.status}</p>
            <p className="item-meta">作成日時: {item.createdAt}</p>
            <p className="item-meta">更新日時: {item.updatedAt}</p>
          </section>
        </article>
      )}
    </main>
  )
}