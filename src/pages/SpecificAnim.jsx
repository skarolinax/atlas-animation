import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebaseconfig";

function SandboxContent() {
  const { sandpack } = useSandpack();

  const [activeTab, setActiveTab] = useState("preview");
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      const currentFiles = sandpack.files;

      const codeToCopy = Object.entries(currentFiles)
        .map(([fileName, fileData]) => {
          const code =
            typeof fileData === "string" ? fileData : fileData.code || "";

          return `// ${fileName}\n${code}`;
        })
        .join("\n\n");

      await navigator.clipboard.writeText(codeToCopy);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch (err) {
      console.error("Could not copy code:", err);
    }
  };

  const openPreviewTab = () => {
    setActiveTab("preview");
    setCopied(false);
  };

  const openCodeTab = () => {
    setActiveTab("code");
    setCopied(false);
  };

  const replayPreview = () => {
    setActiveTab("preview");

    if (sandpack.runSandpack) {
      sandpack.runSandpack();
    }
  };

  return (
    <div className="animation-screen">
      <div className="screen-top-controls">
        <div className="small-tab-group">
          <button
            className={`small-tab ${activeTab === "preview" ? "active" : ""}`}
            onClick={openPreviewTab}
          >
            Preview
          </button>

          <button
            className={`small-tab ${activeTab === "code" ? "active" : ""}`}
            onClick={openCodeTab}
          >
            Code
          </button>
        </div>
      </div>

      <SandpackLayout className="specific-sandpack">
        <div
          className={`tab-panel preview-panel ${
            activeTab === "preview" ? "active" : "hidden"
          }`}
        >
          <div className="preview-frame">
            <SandpackPreview
              showNavigator={false}
              showOpenInCodeSandbox={false}
            />
          </div>
        </div>

        <div
          className={`tab-panel code-panel ${
            activeTab === "code" ? "active" : "hidden"
          }`}
        >
          <div className="code-preview-wrapper">
            <button className="copy-code-button" onClick={copyCode}>
              <span className="copy-icon">⧉</span>
              {copied ? "Copied" : "Copy"}
            </button>

            <SandpackCodeEditor
              showTabs
              showLineNumbers
              wrapContent
              showRunButton={false}
              className="code-frame"
            />
          </div>
        </div>
      </SandpackLayout>

      {activeTab === "preview" && (
        <div className="screen-bottom-controls">
          <button className="replay-button" onClick={replayPreview}>
            ↻ Replay
          </button>
        </div>
      )}
    </div>
  );
}

function SpecificAnim() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const passedAnim = location.state?.anim;

  const [anim, setAnim] = useState(passedAnim || null);
  const [animations, setAnimations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let cancelled = false;

    const fetchAnimations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "animations"));

        const data = querySnapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        if (!cancelled && data.length > 0) {
          setAnimations(data);
        }
      } catch (err) {
        console.error("Could not load animation list:", err);
      }
    };

    fetchAnimations();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchAnim = async () => {
      if (passedAnim?.id === id) {
        setAnim(passedAnim);
        return;
      }

      const existingAnim = animations.find((item) => item.id === id);

      if (existingAnim) {
        setAnim(existingAnim);
        return;
      }

      try {
        const docRef = doc(db, "animations", id);
        const snap = await getDoc(docRef);

        if (!cancelled && snap.exists()) {
          setAnim({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Could not load animation:", err);
      }
    };

    fetchAnim();

    return () => {
      cancelled = true;
    };
  }, [id, passedAnim, animations]);

  useEffect(() => {
    setSidebarOpen(false);
    setActiveCategory("All");
  }, [id]);

  const sidebarAnimations = useMemo(() => {
    if (animations.length === 0) {
      return anim ? [anim] : [];
    }

    const currentExists = animations.some((item) => item.id === anim?.id);

    if (!anim || currentExists) {
      return animations;
    }

    return [anim, ...animations];
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
    if (anim?.files) {
      return Object.fromEntries(
        Object.entries(anim.files).map(([key, value]) => [
          key.startsWith("/") ? key : `/${key}`,
          value,
        ])
      );
    }

    if (anim?.code) {
      return {
        "/App.js": anim.code,
      };
    }

    return {
      "/App.js": `export default function App() {
  return <div>No animation code found.</div>;
}`,
    };
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
      {!sidebarOpen && (
        <button
          className="mobile-sidebar-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open animation menu"
        >
          ☰
        </button>
      )}

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
                      onClick={() => {
                        setActiveCategory("All");
                        setSidebarOpen(false);
                      }}
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
            <h1>{anim.title}</h1>

            <button className="close-page-button" onClick={() => navigate("/")}>
              ×
            </button>
          </div>

          <SandpackProvider
            key={id}
            template="react"
            theme="dark"
            files={files}
            customSetup={{ dependencies }}
            options={{
              recompileMode: "delayed",
              recompileDelay: 800,
            }}
          >
            <SandboxContent />
          </SandpackProvider>

          <p className="animation-description-under">
            {anim.description || anim.subtitle}
          </p>
        </section>
      </motion.section>
    </main>
  );
}

export default SpecificAnim;