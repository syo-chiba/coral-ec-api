import { useEffect, useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export default function ItemListPage() {
  const [items, setItems] = useState([])

  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  function buildQuery() {
    const params = new URLSearchParams()

    if (keyword.trim()) params.set('keyword', keyword.trim())
    if (category.trim()) params.set('category', category.trim())
    if (condition) params.set('condition', condition)
    if (minPrice !== '') params.set('minPrice', minPrice)
    if (maxPrice !== '') params.set('maxPrice', maxPrice)

    const query = params.toString()
    return query ? `?${query}` : ''
  }

  async function fetchItems() {
    setLoading(true)
    setErrorMessage('')

    try {
      const res = await fetch(`${apiBaseUrl}/api/items${buildQuery()}`)
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

  function handleSearch(e) {
    e.preventDefault()
    fetchItems()
  }

  function handleClear() {
    setKeyword('')
    setCategory('')
    setCondition('')
    setMinPrice('')
    setMaxPrice('')
  }

  return (
    <main className="container">
      <h1>商品一覧・検索（Step E-3）</h1>
      <p className="sub">
        API: <code>{apiBaseUrl}/api/items</code>
      </p>

      <form className="card search-card" onSubmit={handleSearch}>
        <label>
          キーワード
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="例: ミドリイシ"
          />
        </label>

        <label>
          カテゴリ
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="SPS / LPS / ソフトコーラル"
          />
        </label>

        <label>
          状態
          <select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="">指定なし</option>
            <option value="used">中古・育成済み</option>
            <option value="new">新品・未使用</option>
          </select>
        </label>

        <label>
          最低価格
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="1000"
          />
        </label>

        <label>
          最高価格
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="5000"
          />
        </label>

        <div className="button-row">
          <button type="submit" disabled={loading}>
            {loading ? '検索中...' : '検索'}
          </button>
          <button type="button" onClick={handleClear} disabled={loading}>
            条件クリア
          </button>
        </div>
      </form>

      {errorMessage && <p className="error">{errorMessage}</p>}

      {!loading && items.length === 0 && !errorMessage && (
        <p className="empty">該当する商品がありません。</p>
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