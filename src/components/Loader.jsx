import { useState, useEffect } from "react";

function Loader({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem("loaded");

    if (alreadyLoaded) {
      onFinish();
      return;
    }

    let current = 0;

    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 10) + 5;

      if (current >= 100) {
        current = 100;
        clearInterval(interval);

        setProgress(100);

        setTimeout(() => {
          sessionStorage.setItem("loaded", "true");
          onFinish(); 
        }, 1500);
      } else {
        setProgress(current);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="loader">
      <p className="loader-progressCount">{progress}%</p>
    </div>
  );
}

export default Loader;