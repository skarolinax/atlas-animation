import Navbar from '../components/Navbar'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import s from '../styles/UploadAnim.module.scss'
import Footer from '../components/Footer'

const CATEGORIES = ['Hover', 'Click', 'Scroll', 'Loading', 'Transition', 'Entrance']
const HEADING = 'Add details of animation'

const headingContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.025, delayChildren: 0.08 },
  },
}

const headingChar = {
  hidden: { opacity: 0, y: '0.35em' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 18, stiffness: 320 },
  },
}

function UploadAnim() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    category: CATEGORIES[0],
    tags: '',
    description: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = (e) => {
    e.preventDefault()
    navigate('/upload/code', { state: form })
  }

  return (

    <>
    <div className={s['upload-page']}>
      <div className={s['step-indicator']} aria-label="Step 1 of 2: Animation details">
        <span className={s['step-count']}>Step 1 of 2</span>
        <span className={s['step-divider']} aria-hidden="true">·</span>
        <span className={s['step-name']}>Animation details</span>
      </div>
      <form className={s['form-card']} onSubmit={handleNext}>
        <h2 className={s.heading}>
          <span className={s['sr-only']}>{HEADING}</span>
          <motion.span
            className={s['heading-chars']}
            aria-hidden="true"
            variants={headingContainer}
            initial="hidden"
            animate="visible"
          >
            {HEADING.split('').map((char, i) => (
              <motion.span
                key={`${i}-${char}`}
                className={s['heading-char']}
                variants={headingChar}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.span>
        </h2>

        <div className={s.field}>
          <label htmlFor="name" className={s.label}>
            Animation name <span className={s.required} aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g bounce in"
            className={s.input}
            value={form.name}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className={s.field}>
          <label htmlFor="category" className={s.label}>Category</label>
          <div className={s['select-wrapper']}>
            <select
              id="category"
              name="category"
              className={s.select}
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={s.field}>
          <label htmlFor="tags" className={s.label}>Tags</label>
          <p className={s.hint}>Separate tags with a comma ( , )</p>
          <input
            id="tags"
            name="tags"
            type="text"
            placeholder="e.g. elegant, scroll, hover"
            className={s.input}
            value={form.tags}
            onChange={handleChange}
          />
        </div>

        <div className={s.field}>
          <label htmlFor="description" className={s.label}>Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Add a description..."
            className={s.textarea}
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={s['next-btn']}>
        Continue to Code Setup
          <span className={s['next-btn-arrow']} aria-hidden="true">→</span>
        </button>
      </form>
    </div>
    <Footer />
    </>
  )
}

export default UploadAnim
