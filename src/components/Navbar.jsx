import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
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

//   const navigate = useNavigate();
//   const location = useLocation();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

            <div className={`searchbar-wrapper ${open ? "open" : ""}`}>
                <input
                    type="search"
                    id="search-input"
                    placeholder="Type to search"
                />

                <div className="search-button" onClick={() => setOpen(!open)}>
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