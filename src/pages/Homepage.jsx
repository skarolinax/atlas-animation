import { useState, useEffect, useRef } from 'react'
import s from "../styles/Homepage.module.scss"
import arrowDown from "../assets/images/arrow-down.svg"

import Footer from '../components/Footer'
import AnimationGrid from '../components/AnimationGrid'
import Navbar from '../components/Navbar'

function Homepage() {

  const circleRef = useRef(null);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    const mouse = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };

    const ease = 0.2; // lower = slower, smoother

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    function animate() {

      const rect = circle.getBoundingClientRect();
      const halfW = rect.width / 2;
      const halfH = rect.height / 2;
      pos.x += (mouse.x - pos.x) * ease;
      pos.y += (mouse.y - pos.y) * ease;

      circle.style.transform = `translate3d(${pos.x - halfW}px, ${pos.y - halfH}px, 0)`;

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);


  return (
    <div className={s["container-wrapper"]}>
        <div ref={circleRef} className={s["circle-anim"]}></div>

        <div className={s["homepage-hero"]}>
          <div>
            <h1>
              <span className={s["line"]}>
                <span>Find, copy and ship </span>
              </span>
              <span className={`${s.line} ${s["second-line"]}`}>
                <span className={s["orange-text"]}>production-ready </span>
              </span>
              <span className={s["line"]}>
                <span><span className={s["orange-text"]}>animations.</span> Fast.</span>
              </span>
            </h1>
            <p>Explore many possibilities.</p>
          </div>
          <img src={arrowDown} alt="Arrow down" className={s["icons-inverted"]}/>
        </div>

     
        <section>
          <AnimationGrid />
        </section>

        <Footer />
    </div>
  )
}

export default Homepage
