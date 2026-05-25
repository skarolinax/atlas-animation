import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebaseconfig'
import s from '../styles/UploadAnim.module.scss'

const GSAP_DEPS = { gsap: 'latest', gsap_react: 'latest' }

function UploadAnimCode() {
  const navigate = useNavigate()
  const { state: details } = useLocation()
  const [code, setCode] = useState('')
  const [saving, setSaving] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!details) {
      navigate('/upload')
      return
    }

    setSaving(true)
    try {
      const tags = details.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      await addDoc(collection(db, 'animations'), {
        title: details.name,
        description: details.description,
        tags,
        code,
        engine: 'gsap',
        dependencies: GSAP_DEPS,
        category: details.category,
      })
      navigate('/')
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Could not save animation. Check the console.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={s['upload-page']}>
      <form className={`${s['form-card']} ${s['code-card']}`} onSubmit={handleSave}>
        <h2 className={s.heading}>Paste code</h2>

        <div className={s['editor-shell']}>
          <div className={s['editor-toolbar']}>
            <span className={s['editor-label']}>
              <span className={s['editor-icon']}>&lt;/&gt;</span>
              Source code
            </span>
            <button type="button" className={s['copy-btn']} onClick={handleCopy}>
              Copy
            </button>
          </div>
          <textarea
            className={s['code-input']}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your animation code here..."
            spellCheck={false}
          />
        </div>

        <button type="submit" className={s['save-btn']} disabled={saving}>
          {saving ? 'Saving…' : 'Save & push →'}
        </button>
      </form>
    </div>
  )
}

export default UploadAnimCode
