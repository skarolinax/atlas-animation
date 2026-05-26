import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"
import s from "../styles/Homepage.module.scss"
import upArrow from "../assets/images/go-up.svg"

import { collection, getDocs } from "firebase/firestore"
import { db } from '../firebaseconfig'

function Footer() {
    const [animations, setAnimations] = useState([]);

    function goBackUp() {
        window.scrollTo({ 
            top: 0,
            behavior: "smooth",
        });
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
    }, []);
 
  return (

    <footer className={s["footer-global"]}>
        <h3>OWOW</h3>
        
        <nav className={s["footer-links-wrapper"]}>
            <div>
                <h5>Modern</h5> 
                <ul className={s["links-list"]}>
                    {animations.slice(0, 3).map(anim => (
                        <li key={anim.id}>
                            <Link to={`/animation/${anim.id}`}>{anim.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h5>Hover</h5>
                <ul className={s["links-list"]}>
                     {animations.slice(3, 7).map(anim => (
                        <li key={anim.id}>
                            <Link to={`/animation/${anim.id}`}>{anim.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h5>Web</h5>
                <ul className={s["links-list"]}>
                    {animations.slice(7, 11).map(anim => (
                        <li key={anim.id}>
                            <Link to={`/animation/${anim.id}`}>{anim.title}</Link>
                        </li>
                    ))}
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