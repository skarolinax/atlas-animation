import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useScramble } from "../hooks/useScramble";
import Logo from "../assets/images/logo.svg";
import searchIcon from "../assets/images/search-icon.svg";
import closeIcon from "../assets/images/close.svg";
import addIcon from "../assets/images/add-symbol.svg";

const SEARCH_STORAGE_KEY = "owow.searchQuery";

const TICKER_ITEMS = [
    "ATTEND THE EVENT!",
    "AI BEYOND THE BULLSHIT",
    "OWOW.IO",
    "WIZKIDS FOR WIZKIDS",
    "PRODUCTION-READY ANIMATIONS",
];

function Navbar() {

  const uploadScramble = useScramble("Upload animation");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(() => {
    try {
      return localStorage.getItem(SEARCH_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [atTop, setAtTop] = useState(true);
  const [tickerHovered, setTickerHovered] = useState(false);
  const wrapperRef = useRef(null);

  // If a `?q=` param is present in the URL, keep the input in sync with it.
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null && q !== query) {
      setQuery(q);
      try { localStorage.setItem(SEARCH_STORAGE_KEY, q); } catch {}
    }
  }, [searchParams]);

  // Close the searchbar when clicking outside of it (input value is preserved).
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  // Track whether the user is at the very top of the page — controls the ticker
  useEffect(() => {
    const handleScroll = () => setAtTop(window.scrollY < 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`site-header ${atTop ? "" : "is-scrolled"}`}>
        <div
            className={`ticker-bar ${atTop ? "" : "is-hidden"}`}
            onMouseEnter={() => setTickerHovered(true)}
            onMouseLeave={() => setTickerHovered(false)}
            aria-hidden={!atTop}
        >
            <div
                className="ticker-track"
                style={{ animationPlayState: tickerHovered ? "paused" : "running" }}
            >
                {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                    <a
                        key={`ticker-${i}`}
                        href="https://owow.io"
                        target="_blank"
                        rel="noreferrer"
                        className={`ticker-link ${i % 2 === 0 ? "ticker-link--accent" : ""}`}
                    >
                        <span>{item}</span>
                        <span className="ticker-arrow" aria-hidden="true">↗</span>
                    </a>
                ))}
            </div>
        </div>

        <nav className="navbar">
            <Link to="/">
                <img src={Logo} alt="Logo of the agency" />
            </Link>

            <div className="navbar-aside">

                <div ref={wrapperRef} className={`searchbar-wrapper ${open ? "open" : ""}`}>
                    <input
                        type="search"
                        id="search-input"
                        placeholder="Type to search"
                        value={query}
                        onChange={(e) => {
                            const next = e.target.value;
                            setQuery(next);
                            try { localStorage.setItem(SEARCH_STORAGE_KEY, next); } catch {}
                            const url = next ? `/?q=${encodeURIComponent(next)}` : "/";
                            navigate(url, { replace: true });

                            if (!open) setOpen(true);

                            const grid = document.querySelector(".ag-shell");
                            grid?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                if (query.trim()) {
                                    navigate(`/?q=${encodeURIComponent(query.trim())}`, { replace: true });
                                }
                                requestAnimationFrame(() => {
                                    const grid = document.querySelector(".ag-shell");
                                    grid?.scrollIntoView({ behavior: "smooth", block: "start" });
                                });
                                setOpen(false);
                                setQuery("");
                                e.currentTarget.blur();
                            }
                        }}
                    />

                    <div className="search-button" onClick={() => {
                        const next = !open;
                        setOpen(next);
                        if (next && query && !searchParams.get("q")) {
                            navigate(`/?q=${encodeURIComponent(query)}`, { replace: true });
                        }
                    }}>
                        <img src={searchIcon} className="searchbtn" />
                        <img src={closeIcon} className="search-closebtn" />
                    </div>
                </div>

                <Link
                    to="/upload"
                    className="upload-btn"
                    onMouseEnter={uploadScramble.trigger}
                    onFocus={uploadScramble.trigger}
                >
                    <span ref={uploadScramble.ref} className="uploadbtn-text">Upload animation</span>
                    <img src={addIcon} alt="Add symbol" className="upload-plusbtn" />
                </Link>
            </div>
        </nav>
    </header>
  );
}

export default Navbar;
