import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const delayScroll = setTimeout(() => {
      window.scrollTo({ top: 0, bottom:0});
    }, 600); //Match delay with the page transition duration for smoother effect

    return () => clearTimeout(delayScroll);
  }, [pathname]);

  return null;
};

export default ScrollToTop;