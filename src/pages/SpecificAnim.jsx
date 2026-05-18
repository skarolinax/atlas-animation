import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebaseconfig";

function SpecificAnim() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const passedAnim = location.state?.anim;

  const [anim, setAnim] = useState(passedAnim || null);
  const [animations, setAnimations] = useState([]);
  const [activeTab, setActiveTab] = useState("preview");
  const [previewTheme, setPreviewTheme] = useState("dark");
  const [replayKey, setReplayKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchAnim = async () => {
      if (passedAnim?.id === id) {
        setAnim(passedAnim);
        return;
      }

      try {
        const docRef = doc(db, "animations", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setAnim({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Could not load animation:", err);
      }
    };

    fetchAnim();
  }, [id, passedAnim]);

  useEffect(() => {
    const fetchAnimations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "animations"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAnimations(data);
      } catch (err) {
        console.error("Could not load animation list:", err);
      }
    };

    fetchAnimations();
  }, []);

  useEffect(() => {
    setActiveTab("preview");
    setReplayKey((prev) => prev + 1);
    setSidebarOpen(false);
  }, [id]);

  const sidebarAnimations = useMemo(() => {
    if (animations.length > 0) return animations;
    if (anim) return [anim];
    return [];
  }, [animations, anim]);

  const getAnimationCategory = (item) => {
    if (item.category) return item.category;
    if (item.type) return item.type;
    if (Array.isArray(item.tags) && item.tags.length > 0) return item.tags[0];

    return "Other";
  };

  const categories = useMemo(() => {
    const uniqueCategories = sidebarAnimations.map(getAnimationCategory);
    return ["All", ...new Set(uniqueCategories)];
  }, [sidebarAnimations]);

  const groupedAnimations = useMemo(() => {
    const filteredAnimations =
      activeCategory === "All"
        ? sidebarAnimations
        : sidebarAnimations.filter(
            (item) => getAnimationCategory(item) === activeCategory
          );

    return filteredAnimations.reduce((groups, item) => {
      const category = getAnimationCategory(item);

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(item);
      return groups;
    }, {});
  }, [sidebarAnimations, activeCategory]);

  const dependencies = useMemo(() => {
    if (!anim?.dependencies) return {};

    const cleanDependencies = { ...anim.dependencies };

    if (cleanDependencies.gsap_react) {
      cleanDependencies["@gsap/react"] = cleanDependencies.gsap_react;
      delete cleanDependencies.gsap_react;
    }

    return cleanDependencies;
  }, [anim]);

  const files = useMemo(() => {
    if (!anim?.code) {
      return {
        "/App.js": `export default function App() {
  return <div>No animation code found.</div>;
}`,
      };
    }

    if (typeof anim.code === "string") {
      return {
        "/App.js": anim.code,
      };
    }

    return anim.code;
  }, [anim]);

  if (!anim) {
    return (
      <main className="specific-page">
        <section className="specific-shell loading-shell">
          <p>Loading animation...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="specific-page">
      <button
        className="mobile-sidebar-button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open animation menu"
      >
        ☰
      </button>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="mobile-sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.section
        className="specific-shell"
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <aside className={`specific-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-top">
            <p className="sidebar-label">Look up other animations</p>

            <button
              className="sidebar-close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close animation menu"
            >
              ×
            </button>
          </div>

          <div className="category-pills">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-pill ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <nav className="categorized-animation-list">
            {Object.entries(groupedAnimations).map(([category, items]) => (
              <div className="animation-category-group" key={category}>
                <h3>{category}</h3>

                <div className="category-animation-links">
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      to={`/animation/${item.id}`}
                      state={{ anim: item }}
                      replace
                      className={`animation-list-item ${
                        item.id === id ? "active" : ""
                      }`}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <section className="specific-content">
          <div className="specific-header">
            <div>
              <h1>{anim.title}</h1>
              <p>{anim.description}</p>
            </div>

            <button className="close-page-button" onClick={() => navigate("/")}>
              ×
            </button>
          </div>

          <SandpackProvider
            key={`${id}-${replayKey}`}
            template="react"
            theme="dark"
            files={files}
            customSetup={{ dependencies }}
          >
            <div className="animation-screen">
              <div className="screen-top-controls">
                <div className="small-tab-group">
                  <button
                    className={`small-tab ${
                      activeTab === "preview" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("preview")}
                  >
                    Preview
                  </button>

                  <button
                    className={`small-tab ${
                      activeTab === "code" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("code")}
                  >
                    Code
                  </button>
                </div>

                <button
                  className={`design-toggle ${previewTheme}`}
                  onClick={() =>
                    setPreviewTheme((prev) =>
                      prev === "dark" ? "light" : "dark"
                    )
                  }
                  aria-label="Toggle preview background"
                >
                  <span className="toggle-dot" />
                </button>
              </div>

              <SandpackLayout className="specific-sandpack">
                {activeTab === "preview" ? (
                  <div className={`preview-frame ${previewTheme}`}>
                    <SandpackPreview
                      showNavigator={false}
                      showOpenInCodeSandbox={false}
                    />
                  </div>
                ) : (
                  <SandpackCodeEditor
                    showTabs
                    showLineNumbers
                    wrapContent
                    className="code-frame"
                  />
                )}
              </SandpackLayout>

              <div className="screen-bottom-controls">
                <button
                  className="replay-button"
                  onClick={() => setReplayKey((prev) => prev + 1)}
                >
                  ↻ Replay
                </button>
              </div>
            </div>
          </SandpackProvider>
        </section>
      </motion.section>
    </main>
  );
}

export default SpecificAnim;