import { useState, useLayoutEffect } from 'react'
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion'
import s from '../styles/UploadAnim.module.scss'

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
  const [form, setForm] = useState({
    name: '',
    category: CATEGORIES[0],
    tags: '',
    description: '',
  })

  useLayoutEffect(() => {
    const prev = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    document.documentElement.style.scrollBehavior = prev
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = (e) => {
    e.preventDefault()
    console.log('Animation details:', form)
  }

  return (
    <div className={s['upload-page']}>
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
          <label htmlFor="name" className={s.label}>Animation name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g bounce in"
            className={s.input}
            value={form.name}
            onChange={handleChange}
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
          <input
            id="tags"
            name="tags"
            type="text"
            placeholder="Add tags..."
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

        <button type="submit" className={s['next-btn']}>Next</button>
      </form>
    </div>
  )
}

export default UploadAnim
