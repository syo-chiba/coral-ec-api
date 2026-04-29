import { useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export default function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')
    setFieldErrors({})
    setLoading(true)

    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json().catch(() => ({}))

      if (res.status === 201) {
        setSuccessMessage(`登録成功: ${data.name} (${data.email})`)
        setName('')
        setEmail('')
        setPassword('')
        return
      }

      if (res.status === 409) {
        setErrorMessage(data.error || 'このメールアドレスは既に使われています。')
        return
      }

      if (res.status === 400) {
        // ApiExceptionHandlerの返却は { field: message } 形式
        setFieldErrors(data || {})
        setErrorMessage('入力内容を確認してください。')
        return
      }

      setErrorMessage(`想定外エラー: ${res.status}`)
    } catch (err) {
      setErrorMessage('通信に失敗しました。バックエンドが起動しているか確認してください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1>会員登録（Step B）</h1>
      <p className="sub">
        API: <code>{apiBaseUrl}/api/auth/register</code>
      </p>

      <form className="card" onSubmit={handleSubmit}>
        <label>
          名前
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Taro"
          />
        </label>
        {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}

        <label>
          メール
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="taro@example.com"
          />
        </label>
        {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}

        <label>
          パスワード
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8文字以上"
          />
        </label>
        {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}

        <button type="submit" disabled={loading}>
          {loading ? '送信中...' : '会員登録'}
        </button>
      </form>

      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </main>
  )
}