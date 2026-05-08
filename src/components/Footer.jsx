import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"
import s from "../styles/Homepage.module.scss"
import upArrow from "../assets/images/go-up.svg"

function Footer() {

  function goBackUp() {
    window.scrollTo({ 
        top: 0,
        behavior: "smooth",
    });
  }
 
  return (

    <footer className={s["footer-global"]}>
        <h3>OWOW</h3>
        
        <nav className={s["footer-links-wrapper"]}>
            <div>
                <h5>Scroll</h5> {/* All hardcoded data has to be fetched*/}
                <ul className={s["links-list"]}>
                    <li><Link>GSAP Scroll</Link></li>
                    <li><Link>GSAP Scroll</Link></li>
                    <li><Link>GSAP Scroll</Link></li>
                    <li><Link>GSAP Scroll</Link></li>
                </ul>
            </div>
            <div>
                <h5>Mobile</h5>
                <ul className={s["links-list"]}>
                    <li><Link>GSAP Scroll</Link></li>
                    <li><Link>GSAP Scroll</Link></li>
                    <li><Link>GSAP Scroll</Link></li>
                    <li><Link>GSAP Scroll</Link></li>
                </ul>
            </div>
            <div>
                <h5>Web</h5>
                <ul className={s["links-list"]}>
                    <li><Link>GSAP Scroll</Link></li>
                    <li><Link>GSAP Scroll</Link></li>
                    <li><Link>GSAP Scroll</Link></li>
                    <li><Link>GSAP Scroll</Link></li>
                </ul>
            </div>
        </nav>

        <div className={s["copy-section"]}>
            <p>&#169;Atlas Animation 2026</p>
            <button onClick={goBackUp}>Go to top <img src={upArrow} alt="Arrow up icon" /></button>
        </div>
    </footer>

  );
}

export default Footer;