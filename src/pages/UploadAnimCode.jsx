import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebaseconfig'
import s from '../styles/UploadAnim.module.scss'

import Footer from '../components/Footer'

const GSAP_DEPS = { gsap: 'latest', gsap_react: 'latest' }
const SUCCESS_TOAST_MS = 1400

function UploadAnimCode() {
  const navigate = useNavigate()
  const { state: details } = useLocation()
  const [code, setCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!details) {
      navigate('/upload')
      return
    }

    const trimmedCode = code.trim()
    if (!trimmedCode) {
      alert('Please paste your animation code before saving.')
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
        code: trimmedCode,
        engine: 'gsap',
        dependencies: GSAP_DEPS,
        category: details.category,
      })
      setShowSuccess(true)
      setTimeout(() => navigate('/'), SUCCESS_TOAST_MS)
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Could not save animation. Check the console.')
      setSaving(false)
    }
  }

  return (
    <>
    <div className={s['upload-page']}>
      <AnimatePresence>
        {showSuccess && (
          <div className={s['toast-overlay']}>
            <motion.div
              className={s.toast}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', damping: 20, stiffness: 280 }}
            >
              <span className={s['toast-check']} aria-hidden="true">✓</span>
              Code successfully uploaded
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className={`${s['step-indicator']} ${s['step-indicator-wide']}`} aria-label="Step 2 of 2: Code integration">
        <span className={s['step-count']}>Step 2 of 2</span>
        <span className={s['step-divider']} aria-hidden="true">·</span>
        <span className={s['step-name']}>Code integration</span>
      </div>
      <form className={`${s['form-card']} ${s['code-card']}`} onSubmit={handleSave}>
        <h2 className={s.heading}>Paste code</h2>

        <div className={s['editor-shell']}>
          <div className={s['editor-toolbar']}>
            <span className={s['editor-label']}>
              <span className={s['editor-icon']}>&lt;/&gt;</span>
              Source code <span className={s.required} aria-hidden="true">*</span>
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
            required
            aria-required="true"
          />
        </div>

        <button type="submit" className={s['save-btn']} disabled={saving}>
          {saving ? (
            'Saving…'
          ) : (
            <>
              Save &amp; push
              <span className={s['next-btn-arrow']} aria-hidden="true">→</span>
            </>
          )}
        </button>
      </form>
    </div>
    <Footer />
    </>
  )
}

export default UploadAnimCode
