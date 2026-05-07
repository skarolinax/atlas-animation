import { useState, useEffect, useRef } from 'react'
import s from "../styles/Homepage.module.scss"
import arrowDown from "../assets/images/arrow-down.svg"

import Footer from '../components/Footer'
import AnimationGrid from '../components/AnimationGrid'
import Navbar from '../components/Navbar'

function Homepage() {

const [wordIndex, setWordIndex] = useState(0);
const [displayedWord, setDisplayedWord] = useState("");
const [isDeleting, setIsDeleting] = useState(false);
const words = ["Fast.", "Smooth.", "Effortless."];

// Function used for the typewriter effect 
  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout;

    const type = () => {
      if (!isDeleting) {
        setDisplayedWord(currentWord.substring(0, displayedWord.length + 1));

        if (displayedWord === currentWord) {
          timeout = setTimeout(() => setIsDeleting(true), 1000); // Wait before removing
          return;
        }
      } else {
        setDisplayedWord(currentWord.substring(0, displayedWord.length - 1));

        if (displayedWord === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
          return;
        }
      }

      timeout = setTimeout(type, 80);
    };

    timeout = setTimeout(type, 80);

    return () => clearTimeout(timeout);
  }, [displayedWord, isDeleting, wordIndex]);

  const heroRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const circle = circleRef.current;

    if (!hero || !circle) return;

    const mouse = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    const ease = 0.2;

    const rect = hero.getBoundingClientRect();

    const handleMouseMove = (e) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouse.x = Math.max(0, Math.min(rect.width, x));
      mouse.y = Math.max(0, Math.min(rect.height, y));
    };

    hero.addEventListener("mousemove", handleMouseMove);

    function animate() {
      pos.x += (mouse.x - pos.x) * ease;
      pos.y += (mouse.y - pos.y) * ease;

      circle.style.transform =
        `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className={s["container-wrapper"]}>
        <div ref={circleRef} className={s["circle-anim"]}></div>

        <div ref={heroRef} className={s["homepage-hero"]}>
          <div>
            <h1>
              <span className={s["line"]}>
                <span>Find, copy and ship </span>
              </span>
              <span className={`${s.line} ${s["second-line"]}`}>
                <span className={s["orange-text"]}>production-ready </span>
              </span>
              <span className={s["line"]}>
                <span><span className={s["orange-text"]}>animations.</span> <span className={s["text-to-change"]}>{displayedWord}</span></span>
              </span>
            </h1>
            <p>Explore many possibilities.</p>
          </div>
          <img src={arrowDown} alt="Arrow down" className={s["icons-inverted"]}/>
        </div>

        <main className={s["homepage-main"]}>
          <p>Choose from</p>
          <div className={s["container-cards"]}>
            <div>
              <p>React Native Reanimated</p>
              <p>67</p>
            </div>
            <div>
              <p>GSAP</p>
              <p>80</p>
            </div>
            <div>
              <p>Other</p>
              <p>100+</p>
            </div>
          </div>
          <div className={s["container-subcontent"]}>
            <h2>Which animation will you choose today?</h2>
            <p>Custom animations, designed and maintained by WIZKIDS for WIZKIDS.</p>
          </div>
        </main>

        <section>
          <AnimationGrid />
        </section>

        <Footer />
    </div>
  )
}

export default Homepage
