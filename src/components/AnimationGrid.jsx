import React, { Component, useEffect, useMemo, useState } from 'react'
import { collection, getDocs } from "firebase/firestore"
import { Link, useSearchParams } from "react-router-dom"
import { db } from '../firebaseconfig'
import { SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react"
import '../styles/AnimationGrid.css'
import SearchFunction from './Search-function'

class CardErrorBoundary extends Component {
    state = { hasError: false }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, info) {
        console.error("Animation card failed to render:", error, info)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="ag-card-error">
                    <p className="ag-card-error-title">Couldn't load preview</p>
                    <p className="ag-card-error-sub">This animation has invalid code.</p>
                </div>
            )
        }
        return this.props.children
    }
}

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
    const [reactOnly, setReactOnly] = useState(false)
    const [favorites, setFavorites] = useState({})
    
    // --- Search function start ---
    // Search state is synced with the URL query parameter `q`.
    // The handler below updates the search query in the URL,
    // and the filtered list is derived from this query.
    const [searchParams, setSearchParams] = useSearchParams()
    const searchQuery = searchParams.get('q') || ""

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

    const getCleanDependencies = (selectedAnim) => {
        if (!selectedAnim || !selectedAnim.dependencies) return {}
        const dependencies = { ...selectedAnim.dependencies }
        if (dependencies.gsap_react) {
            dependencies["@gsap/react"] = dependencies.gsap_react
            delete dependencies.gsap_react
        }
        return dependencies
    }

    const isReactCompatible = React.useCallback((anim) => {
        const deps = anim?.dependencies || {}
        return Boolean(deps.gsap_react || deps["@gsap/react"] || deps.react)
    }, [])

    const handleSearchQueryChange = (value) => {
        const params = new URLSearchParams()
        if (value.trim()) params.set('q', value.trim())
        setSearchParams(params, { replace: true })
    }

    const query = searchQuery.trim().toLowerCase()

    const filtered = useMemo(() => {
        return animations.filter(anim => {
            if (activeCategory !== "All") {
                const haystack = [anim.category, anim.tag, ...(Array.isArray(anim.tags) ? anim.tags : [])]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase()
                if (!haystack.includes(activeCategory.toLowerCase())) return false
            }

            if (reactOnly && !isReactCompatible(anim)) return false

            if (query) {
                const haystack = [
                    anim.title,
                    anim.category,
                    anim.tag,
                    anim.description,
                    anim.subtitle,
                    ...(Array.isArray(anim.tags) ? anim.tags : []),
                ].filter(Boolean).join(" ").toLowerCase()
                if (!haystack.includes(query)) return false
            }

            return true
        })
    }, [animations, activeCategory, reactOnly, query, isReactCompatible])
    // --- Search function end ---

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
                        <button
                            type="button"
                            className={`ag-toggle ${reactOnly ? "is-on" : ""}`}
                            onClick={() => setReactOnly(v => !v)}
                            aria-pressed={reactOnly}
                        >
                            <span className="ag-toggle-dot" /> React only
                        </button>
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

                <div className="ag-search-row">
                    <SearchFunction searchQuery={searchQuery} setSearchQuery={handleSearchQueryChange} />
                </div>

                <p className="ag-count">
                    Showing <strong>{filtered.length}</strong> of {animations.length}
                </p>

                <div className="ag-grid">
                    {filtered.map(anim => {
                        const tested = anim.tested ?? true
                        const lib = (anim.library || anim.engine || "GSAP").toUpperCase()
                        const tags = Array.isArray(anim.tags) && anim.tags.length
                            ? anim.tags
                            : [anim.category, anim.trigger].filter(Boolean)
                        const author = anim.author || "—"
                        return (
                            <CardErrorBoundary key={anim.id}>
                                <article className="ag-card">
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

                                    <div className="ag-card-preview">
                                        <div className="ag-card-sandpack">
                                            {(anim.files || anim.code) ? (
                                                <SandpackProvider
                                                    template='react'
                                                    theme='dark'
                                                    files={anim.files
                                                        ? Object.fromEntries(
                                                            Object.entries(anim.files).map(([key, value]) => [`/${key}`, value])
                                                        )
                                                        : { '/App.js': anim.code }
                                                    }
                                                    customSetup={{ dependencies: getCleanDependencies(anim) }}
                                                >
                                                    <SandpackLayout>
                                                        <SandpackPreview />
                                                    </SandpackLayout>
                                                </SandpackProvider>
                                            ) : (
                                                <div className="ag-card-placeholder" aria-hidden="true" />
                                            )}
                                        </div>

                                        <Link to={`/animation/${anim.id}`} className="ag-card-clickoverlay" aria-label={`Open ${anim.title}`}>
                                            <span className="ag-card-hover-cta">
                                                Click to open <span aria-hidden="true">↗</span>
                                            </span>
                                        </Link>
                                    </div>

                                    <div className="ag-card-body">
                                        <div className="ag-card-headrow">
                                            <h3 className="ag-card-title">{anim.title}</h3>
                                            <span className="ag-lib-tag">{lib}</span>
                                        </div>
                                        {(anim.subtitle || anim.description) && (
                                            <p className="ag-card-desc">{anim.subtitle || anim.description}</p>
                                        )}
                                        {tags.length > 0 && (
                                            <div className="ag-card-tags">
                                                {tags.map((t, idx) => (
                                                    <span className="ag-tag" key={`${t}-${idx}`}>{t}</span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="ag-card-foot">
                                            <span>{author}</span>
                                        </div>
                                    </div>
                                </article>
                            </CardErrorBoundary>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default AnimationGrid
