import React, { useEffect, useState } from 'react'
import { collection, getDocs } from "firebase/firestore"
import { Link, useSearchParams } from "react-router-dom"
import { db } from '../firebaseconfig'
import { SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react"
import SearchFunction from './Search-function'

function AnimationGrid() {
    const [animations, setAnimations] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || "";

    const getCleanDependencies = (selectedAnim) => {
        if (!selectedAnim || !selectedAnim.dependencies) return {};
        const dependencies = { ...selectedAnim.dependencies };
        if (dependencies.gsap_react) {
            dependencies["@gsap/react"] = dependencies.gsap_react;
            delete dependencies.gsap_react;
        }
        return dependencies;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Attempting to connect to Firebase...");
                const querySnapshot = await getDocs(collection(db, "animations"));
                if (querySnapshot.empty) {
                    console.warn("Connected! 'animations' collection is empty.");
                } else {
                    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    console.log("Success! Data received:", data);
                    setAnimations(data);
                }
            } catch (error) {
                console.error("Connection failed:", error.message);
            }
        };
        fetchData();
    }, []);

    // Search state and filter logic for animation matching.
    // The search input is rendered below and updates `searchQuery` in this component.
    // When the search value changes, store it in the URL as ?q=...
    // This lets the navbar and page search stay in sync.
    const handleSearchQueryChange = (value) => {
        const params = new URLSearchParams();
        if (value.trim()) params.set('q', value.trim());
        setSearchParams(params, { replace: true });
    };

    const query = searchQuery.trim().toLowerCase();

    const valueIncludesQuery = (value) => {
        if (!value) return false;
        if (typeof value === "string") return value.toLowerCase().includes(query);
        if (Array.isArray(value)) return value.some(item => valueIncludesQuery(item));
        if (typeof value === "object") return Object.values(value).some(item => valueIncludesQuery(item));
        return false;
    };

    const filtered = !query
        ? animations
        : animations.filter(anim =>
            valueIncludesQuery(anim.title) ||
            valueIncludesQuery(anim.category) ||
            valueIncludesQuery(anim.tag) ||
            valueIncludesQuery(anim.description)
        );

    return (
        <div className="animation-grid">
            <h3>Explore</h3>

            <SearchFunction searchQuery={searchQuery} setSearchQuery={handleSearchQueryChange} />
            <p>Current search: "{searchQuery}"</p>

            <button>Web animations</button>
            <button>Mobile animations</button>

            <p>Filters</p>

            <p>Showing {filtered.length} out of {animations.length} animations</p>

            <div className="container">
                {filtered.length === 0 ? (
                    <p>No animations found for "{searchQuery}".</p>
                ) : (
                    filtered.map(anim => (
                        anim.code ? (
                            <div key={anim.id}>
                                <h3>{anim.title}</h3>
                                <Link to={`/animation/${anim.id}`}>Open Animation</Link>

                                <SandpackProvider
                                    template='react'
                                    theme='dark'
                                    files={{ '/App.js': anim.code }}
                                    customSetup={{ dependencies: getCleanDependencies(anim) }}
                                >
                                    <SandpackLayout>
                                        <SandpackPreview />
                                    </SandpackLayout>
                                </SandpackProvider>
                            </div>
                        ) : null
                    ))
                )}
            </div>
        </div>
    )
}

export default AnimationGrid