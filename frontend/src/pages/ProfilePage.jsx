import { useEffect, useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [location, setLocation] = useState('')

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')
    try {
      const res = await fetch(`${apiBaseUrl}/api/profile/me`)
      const data = await res.json().catch(() => ({}))

      if (res.status === 200) {
        setDisplayName(data.displayName || '')
        setBio(data.bio || '')
        setAvatarUrl(data.avatarUrl || '')
        setLocation(data.location || '')
        return
      }

      if (res.status === 404) {
        setErrorMessage('プロフィールが未作成です（userId=1）。')
        return
      }

      setErrorMessage(`取得失敗: ${res.status}`)
    } catch {
      setErrorMessage('通信に失敗しました。バックエンド起動とCORS設定を確認してください。')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setSuccessMessage('')
    setErrorMessage('')
    setFieldErrors({})

    try {
      const res = await fetch(`${apiBaseUrl}/api/profile/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, bio, avatarUrl, location })
      })

      const data = await res.json().catch(() => ({}))

      if (res.status === 200) {
        setSuccessMessage('プロフィールを更新しました。')
        setDisplayName(data.displayName || '')
        setBio(data.bio || '')
        setAvatarUrl(data.avatarUrl || '')
        setLocation(data.location || '')
        return
      }

      if (res.status === 400) {
        setFieldErrors(data || {})
        setErrorMessage('入力内容を確認してください。')
        return
      }

      if (res.status === 404) {
        setErrorMessage('プロフィールが見つかりません。')
        return
      }

      setErrorMessage(`更新失敗: ${res.status}`)
    } catch {
      setErrorMessage('通信に失敗しました。')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="container">
      <h1>プロフィール編集（Step D-2）</h1>
      <p className="sub">
        API: <code>{apiBaseUrl}/api/profile/me</code>
      </p>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <form className="card" onSubmit={handleSubmit}>
          <label>
            表示名
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="表示名"
            />
          </label>
          {fieldErrors.displayName && <p className="field-error">{fieldErrors.displayName}</p>}

          <label>
            自己紹介
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="自己紹介"
              rows={4}
            />
          </label>
          {fieldErrors.bio && <p className="field-error">{fieldErrors.bio}</p>}

          <label>
            アイコンURL
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
            />
          </label>
          {fieldErrors.avatarUrl && <p className="field-error">{fieldErrors.avatarUrl}</p>}

          <label>
            居住地
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Tokyo"
            />
          </label>
          {fieldErrors.location && <p className="field-error">{fieldErrors.location}</p>}

          <button type="submit" disabled={saving}>
            {saving ? '保存中...' : '保存'}
          </button>
        </form>
      )}

      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </main>
  )
}