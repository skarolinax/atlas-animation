import React, { useEffect, useState, useMemo } from 'react'
import { collection, getDocs } from "firebase/firestore"
import { Link } from "react-router-dom"
import { db } from '../firebaseconfig'
import { SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react"
import '../styles/AnimationGrid.css'

const CATEGORIES = ["All", "Elegant", "Scroll", "Hover", "3D", "Modern", "Loading"]
const LIBRARIES = [
    { id: "gsap", label: "Web · GSAP" },
    { id: "reanimated", label: "Mobile · Reanimated" },
]

function AnimationGrid() {
    const [animations, setAnimations] = useState([])
    const [activeLib, setActiveLib] = useState("gsap")
    const [activeCategory, setActiveCategory] = useState("All")
    const [interaction, setInteraction] = useState("All interactions")
    const [complexity, setComplexity] = useState("Any complexity")
    const [favorites, setFavorites] = useState({})

    const getCleanDependencies = (selectedAnim) => {
        if (!selectedAnim || !selectedAnim.dependencies) return {}
        const dependencies = { ...selectedAnim.dependencies }
        if (dependencies.gsap_react) {
            dependencies["@gsap/react"] = dependencies.gsap_react
            delete dependencies.gsap_react
        }
        return dependencies
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "animations"))
                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                    setAnimations(data)
                }
            } catch (error) {
                console.error("Connection failed:", error.message)
            }
        }
        fetchData()
    }, [])

    const filtered = useMemo(() => {
        return animations.filter(a => {
            if (activeCategory !== "All") {
                const cat = (a.category || a.tag || "").toString().toLowerCase()
                if (!cat.includes(activeCategory.toLowerCase())) return false
            }
            return true
        })
    }, [animations, activeCategory])

    const toggleFav = (id) => setFavorites(f => ({ ...f, [id]: !f[id] }))

    return (
        <div className="ag-shell">
            <aside className="ag-sidebar">
                <ul className="ag-sidebar-list">
                    {CATEGORIES.map((cat, i) => (
                        <li
                            key={cat}
                            className={`ag-sidebar-item ${activeCategory === cat ? "is-active" : ""}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {i === 0 && <span className="ag-sidebar-bullet">*</span>}
                            <span>{cat}</span>
                        </li>
                    ))}
                </ul>

                <div className="ag-contribute">
                    <p className="ag-contribute-eyebrow">// CONTRIBUTE</p>
                    <p className="ag-contribute-title">Got a new animation?</p>
                    <Link to="/upload" className="ag-contribute-btn">+ New animation</Link>
                </div>
            </aside>

            <div className="ag-main">
                <div className="ag-toolbar">
                    <div className="ag-lib-toggle">
                        {LIBRARIES.map(lib => (
                            <button
                                key={lib.id}
                                className={`ag-lib-pill ${activeLib === lib.id ? "is-active" : ""}`}
                                onClick={() => setActiveLib(lib.id)}
                            >
                                {lib.label}
                            </button>
                        ))}
                    </div>

                    <div className="ag-dropdowns">
                        <div className="ag-select">
                            <select value={interaction} onChange={(e) => setInteraction(e.target.value)}>
                                <option>All interactions</option>
                                <option>Hover</option>
                                <option>Click</option>
                                <option>Scroll</option>
                                <option>Load</option>
                            </select>
                            <span className="ag-select-caret">▾</span>
                        </div>
                        <div className="ag-select">
                            <select value={complexity} onChange={(e) => setComplexity(e.target.value)}>
                                <option>Any complexity</option>
                                <option>Simple</option>
                                <option>Medium</option>
                                <option>Complex</option>
                            </select>
                            <span className="ag-select-caret">▾</span>
                        </div>
                    </div>
                </div>

                <div className="ag-chips">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`ag-chip ${activeCategory === cat ? "is-active" : ""}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <p className="ag-count">
                    Showing <strong>{filtered.length}</strong> of {animations.length}
                </p>

                <div className="ag-grid">
                    {filtered.map(anim => {
                        const tested = anim.tested ?? true
                        const lib = (anim.library || "GSAP").toUpperCase()
                        const category = anim.category || "Modern"
                        const trigger = anim.trigger || "Load"
                        const author = anim.author || "—"
                        return (
                            <article key={anim.id} className="ag-card">
                                <div className="ag-card-top">
                                    {tested && (
                                        <span className="ag-badge ag-badge-tested">
                                            <span className="ag-badge-dot">✓</span> Tested
                                        </span>
                                    )}
                                    <button
                                        className={`ag-fav ${favorites[anim.id] ? "is-on" : ""}`}
                                        onClick={() => toggleFav(anim.id)}
                                        aria-label="Favorite"
                                    >
                                        ☆
                                    </button>
                                </div>

                                <Link to={`/animation/${anim.id}`} className="ag-card-preview">
                                    <div className="ag-card-sandpack">
                                        <SandpackProvider
                                            template='react'
                                            theme='dark'
                                            files={anim.files
                                            ? Object.fromEntries(
                                                Object.entries(anim.files).map(([key, value]) => [`/${key}`, value])
                                                )
                                                : { "/App.js": anim.code }
                                                }
                                            customSetup={{ dependencies: getCleanDependencies(anim) }}
                                            >
                                            <SandpackLayout>
                                                <SandpackPreview />
                                            </SandpackLayout>
                                        </SandpackProvider>
                                    </div>

                                    

                                    <div className="ag-card-hover">
                                        <p className="ag-card-hover-cta">
                                            Click to open <span aria-hidden="true">↗</span>
                                        </p>
                                    </div>
                                </Link>

                                <div className="ag-card-body">
                                    <div className="ag-card-headrow">
                                        <h3 className="ag-card-title">{anim.title}</h3>
                                        <span className="ag-lib-tag">{lib}</span>
                                    </div>
                                    {anim.subtitle && (
                                        <p className="ag-card-desc">{anim.subtitle}</p>
                                    )}
                                    <div className="ag-card-tags">
                                        <span className="ag-tag">{category}</span>
                                        <span className="ag-tag">{trigger}</span>
                                    </div>
                                    <div className="ag-card-foot">
                                        <span>{author}</span>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default AnimationGrid
