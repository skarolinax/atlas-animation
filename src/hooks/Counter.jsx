import { useEffect, useRef, useState } from "react";
import Odometer from 'react-odometerjs';
import "odometer/themes/odometer-theme-default.css";

export default function Counter({ value, delay=0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true);

        setTimeout(() => {
          setCount(value);
        }, delay);
      }
    }, { threshold: 0.3 });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      observer.disconnect();
    };
  }, [started, value, delay]);

  return (
    <div ref={ref} className="card-value">
      <Odometer value={count} format="(,ddd)" />
    </div>
  );
}