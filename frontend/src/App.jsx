import { useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export default function App() {
  const [mode, setMode] = useState('register') // register | login

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  function resetMessages() {
    setSuccessMessage('')
    setErrorMessage('')
    setFieldErrors({})
  }

  async function handleRegister() {
    const res = await fetch(`${apiBaseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    const data = await res.json().catch(() => ({}))

    if (res.status === 201) {
      setSuccessMessage(`登録成功: ${data.name} (${data.email})`)
      return
    }
    if (res.status === 409) {
      setErrorMessage(data.error || 'このメールは既に使われています。')
      return
    }
    if (res.status === 400) {
      setFieldErrors(data || {})
      setErrorMessage('入力内容を確認してください。')
      return
    }
    setErrorMessage(`想定外エラー: ${res.status}`)
  }

  async function handleLogin() {
    const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json().catch(() => ({}))

    if (res.status === 200) {
      setSuccessMessage(`ログイン成功: ${data.name} (${data.email})`)
      localStorage.setItem('currentUser', JSON.stringify(data))
      return
    }
    if (res.status === 401) {
      setErrorMessage(data.error || 'メールまたはパスワードが正しくありません。')
      return
    }
    if (res.status === 400) {
      setFieldErrors(data || {})
      setErrorMessage('入力内容を確認してください。')
      return
    }
    setErrorMessage(`想定外エラー: ${res.status}`)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    resetMessages()
    setLoading(true)
    try {
      if (mode === 'register') {
        await handleRegister()
      } else {
        await handleLogin()
      }
    } catch (err) {
      setErrorMessage('通信に失敗しました。バックエンドの起動状態を確認してください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1>{mode === 'register' ? '会員登録' : 'ログイン'}（Step C）</h1>
      <p className="sub">
        API Base: <code>{apiBaseUrl}</code>
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button type="button" onClick={() => { setMode('register'); resetMessages(); }}>
          登録
        </button>
        <button type="button" onClick={() => { setMode('login'); resetMessages(); }}>
          ログイン
        </button>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <>
            <label>
              名前
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
          </>
        )}

        <label>
          メール
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}

        <label>
          パスワード
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}

        <button type="submit" disabled={loading}>
          {loading ? '送信中...' : mode === 'register' ? '会員登録' : 'ログイン'}
        </button>
      </form>

      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </main>
  )
}