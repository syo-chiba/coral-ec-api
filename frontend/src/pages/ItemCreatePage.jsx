import { useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export default function ItemCreatePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('used')

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')
    setFieldErrors({})

    try {
      const res = await fetch(`${apiBaseUrl}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          category,
          condition
        })
      })

      const data = await res.json().catch(() => ({}))

      if (res.status === 201) {
        setSuccessMessage(`出品しました: ${data.title}（${data.price}円）`)
        setTitle('')
        setDescription('')
        setPrice('')
        setCategory('')
        setCondition('used')
        return
      }

      if (res.status === 400) {
        setFieldErrors(data || {})
        setErrorMessage('入力内容を確認してください。')
        return
      }

      setErrorMessage(`出品に失敗しました: ${res.status}`)
    } catch {
      setErrorMessage('通信に失敗しました。バックエンド起動とCORS設定を確認してください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1>商品出品（Step E-1）</h1>
      <p className="sub">
        API: <code>{apiBaseUrl}/api/items</code>
      </p>

      <form className="card" onSubmit={handleSubmit}>
        <label>
          商品名
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: ミドリイシ フラグ"
          />
        </label>
        {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}

        <label>
          説明
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="サイズ、状態、飼育環境など"
            rows={5}
          />
        </label>
        {fieldErrors.description && <p className="field-error">{fieldErrors.description}</p>}

        <label>
          価格
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="3000"
          />
        </label>
        {fieldErrors.price && <p className="field-error">{fieldErrors.price}</p>}

        <label>
          カテゴリ
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="SPS / LPS / ソフトコーラル"
          />
        </label>
        {fieldErrors.category && <p className="field-error">{fieldErrors.category}</p>}

        <label>
          状態
          <select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="used">中古・育成済み</option>
            <option value="new">新品・未使用</option>
          </select>
        </label>
        {fieldErrors.condition && <p className="field-error">{fieldErrors.condition}</p>}

        <button type="submit" disabled={loading}>
          {loading ? '出品中...' : '出品する'}
        </button>
      </form>

      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </main>
  )
}