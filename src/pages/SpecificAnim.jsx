import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

import Navbar from "../components/Navbar";

function SpecificAnim() {
  const { id } = useParams();
  const location = useLocation();

  const passedAnim = location.state?.anim;

  const [anim, setAnim] = useState(passedAnim || null);

  useEffect(() => {
    if (anim) return;

    const fetchAnim = async () => {
      try {
        const docRef = doc(db, "animations", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setAnim({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchAnim();
  }, [id, anim]);

  if (!anim) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h1>{anim.title}</h1>
    </>
  );
}

export default SpecificAnim;