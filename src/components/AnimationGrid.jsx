import React, { useEffect, useState, useMemo, useRef, Component } from 'react'
import { collection, getDocs } from "firebase/firestore"
import { Link } from "react-router-dom"
import { db } from '../firebaseconfig'
import { SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react"
import '../styles/AnimationGrid.css'

const PAGE_SIZE = 9

class CardErrorBoundary extends Component {
    state = { hasError: false }
    static getDerivedStateFromError() { return { hasError: true } }
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

function LazyPreview({ children }) {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const node = ref.current
        if (!node || visible) return
        const obs = new IntersectionObserver(
            entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        setVisible(true)
                        obs.disconnect()
                    }
                })
            },
            { rootMargin: "300px" }
        )
        obs.observe(node)
        return () => obs.disconnect()
    }, [visible])

    return (
        <div ref={ref} className="ag-card-sandpack">
            {visible ? children : <div className="ag-card-placeholder" aria-hidden="true" />}
        </div>
    )
}

const CATEGORY_GROUPS = [
    { label: "Interactions", items: ["Hover", "Scroll", "Loading"] },
    { label: "Style", items: ["Elegant", "Modern", "3D"] },
]
const LIBRARIES = [
    { id: "gsap", label: "Web · GSAP" },
    { id: "reanimated", label: "Mobile · Reanimated" },
]

function AnimationGrid() {
    const [animations, setAnimations] = useState([])
    const [activeLib, setActiveLib] = useState("gsap")
    const [activeCategory, setActiveCategory] = useState("All")
    const [reactOnly, setReactOnly] = useState(false)
    const [favorites, setFavorites] = useState({})
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    const getCleanDependencies = (selectedAnim) => {
        if (!selectedAnim || !selectedAnim.dependencies) return {}
        const dependencies = { ...selectedAnim.dependencies }
        if (dependencies.gsap_react) {
            dependencies["@gsap/react"] = dependencies.gsap_react
            delete dependencies.gsap_react
        }
        return dependencies
    }

    const isReactCompatible = (anim) => {
        const deps = anim?.dependencies || {}
        return Boolean(deps.gsap_react || deps["@gsap/react"] || deps.react)
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
                const haystack = [
                    a.category,
                    a.tag,
                    ...(Array.isArray(a.tags) ? a.tags : []),
                ].join(" ").toLowerCase()
                if (!haystack.includes(activeCategory.toLowerCase())) return false
            }
            if (reactOnly && !isReactCompatible(a)) return false
            return true
        })
    }, [animations, activeCategory, reactOnly])

    useEffect(() => {
        setVisibleCount(PAGE_SIZE)
    }, [activeCategory, reactOnly, activeLib])

    const visible = filtered.slice(0, visibleCount)
    const hasMore = filtered.length > visibleCount

    const toggleFav = (id, e) => {
        e.preventDefault()
        e.stopPropagation()
        setFavorites(f => ({ ...f, [id]: !f[id] }))
    }

    return (
        <div className="ag-shell">
            <aside className="ag-sidebar">
                <ul className="ag-sidebar-list">
                    <li
                        className={`ag-sidebar-item ${activeCategory === "All" ? "is-active" : ""}`}
                        onClick={() => setActiveCategory("All")}
                    >
                        <span className="ag-sidebar-bullet">*</span>
                        <span>All</span>
                    </li>

                    {CATEGORY_GROUPS.map(group => (
                        <li key={group.label} className="ag-sidebar-group">
                            <p className="ag-sidebar-group-label">{group.label}</p>
                            <ul className="ag-sidebar-sublist">
                                {group.items.map(cat => (
                                    <li
                                        key={cat}
                                        className={`ag-sidebar-item ag-sidebar-subitem ${activeCategory === cat ? "is-active" : ""}`}
                                        onClick={() => setActiveCategory(cat)}
                                    >
                                        <span>{cat}</span>
                                    </li>
                                ))}
                            </ul>
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
                    </div>
                </div>

                <p className="ag-count">
                    Showing <strong>{visible.length}</strong> of {filtered.length}
                </p>

                <div className="ag-grid">
                    {visible.map(anim => {
                        const tested = anim.tested ?? true
                        const lib = (anim.library || anim.engine || "GSAP").toUpperCase()
                        const tags = Array.isArray(anim.tags) && anim.tags.length
                            ? anim.tags
                            : [anim.category, anim.trigger].filter(Boolean)
                        return (
                            <CardErrorBoundary key={anim.id}>
                                <Link
                                    to={`/animation/${anim.id}`}
                                    className="ag-card-link"
                                    aria-label={`Open ${anim.title}`}
                                >
                                    <article className="ag-card">
                                        <div className="ag-card-top">
                                            {tested && (
                                                <span className="ag-badge ag-badge-tested">
                                                    <span className="ag-badge-dot">✓</span> Tested
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                className={`ag-fav ${favorites[anim.id] ? "is-on" : ""}`}
                                                onClick={(e) => toggleFav(anim.id, e)}
                                                aria-label="Favorite"
                                            >
                                                ☆
                                            </button>
                                        </div>

                                        <div className="ag-card-preview">
                                            {(anim.files || anim.code) ? (
                                                <LazyPreview>
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
                                                </LazyPreview>
                                            ) : (
                                                <div className="ag-card-sandpack">
                                                    <div className="ag-card-placeholder" aria-hidden="true" />
                                                </div>
                                            )}

                                            <div className="ag-card-clickoverlay">
                                                <span className="ag-card-hover-cta">
                                                    Click to open <span aria-hidden="true">↗</span>
                                                </span>
                                            </div>
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
                                        </div>
                                    </article>
                                </Link>
                            </CardErrorBoundary>
                        )
                    })}
                </div>

                {hasMore && (
                    <div className="ag-loadmore">
                        <button
                            type="button"
                            className="ag-loadmore-btn"
                            onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                        >
                            Load more ({filtered.length - visibleCount})
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AnimationGrid
