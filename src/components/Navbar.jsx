import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const SEARCH_STORAGE_KEY = "owow.searchQuery";
import Logo from "../assets/images/logo.svg";
import searchIcon from "../assets/images/search-icon.svg";
import closeIcon from "../assets/images/close.svg";
import addIcon from "../assets/images/add-symbol.svg";
// import {
//   Link,
//   NavLink,
//   useNavigate,
//   useLocation,
// } from "react-router-dom";

function Navbar() {

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
  const [scrolled, setScrolled] = useState(false);
  const wrapperRef = useRef(null);

  // If a `?q=` param is present in the URL, keep the input in sync with it.
  // Don't clear the input when the URL has no `q` — preserve the user's last query.
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

  useEffect(() => {
    const handleScroll = () => {
        if (window.scrollY > 40) { 
            setScrolled(true);}
        else {
            setScrolled(false);
        }
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  });
 
  return (

    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}> {/*Add the class when scrolled */}
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
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            if (query.trim()) {
                                navigate(`/?q=${encodeURIComponent(query.trim())}`, { replace: true });
                            }
                            // Defer to next tick so the home grid is mounted before we scroll
                            requestAnimationFrame(() => {
                                const grid = document.querySelector(".ag-grid") || document.querySelector(".ag-main");
                                if (grid) {
                                    grid.scrollIntoView({ behavior: "smooth", block: "start" });
                                }
                            });
                            setOpen(false);
                            e.currentTarget.blur();
                        }
                    }}
                />

                <div className="search-button" onClick={() => {
                    const next = !open;
                    setOpen(next);
                    // When reopening with a saved query, re-apply the filter via the URL
                    if (next && query && !searchParams.get("q")) {
                        navigate(`/?q=${encodeURIComponent(query)}`, { replace: true });
                    }
                }}>
                    <img src={searchIcon} className="searchbtn" />
                    <img src={closeIcon} className="search-closebtn" />
                </div>
            </div>   

            <Link to="/upload" className="upload-btn">
                <span className="uploadbtn-text">Upload animation</span>
                <img src={addIcon} alt="Add symbol" className="upload-plusbtn" />
            </Link>
        </div>
    </nav>

  );
}

export default Navbar;