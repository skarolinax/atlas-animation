import { useState, useEffect } from 'react'
import s from "../styles/Homepage.module.scss"
import arrowDown from "../assets/images/arrow-down.svg"

import { collection, getDocs, addDoc  } from "firebase/firestore";
import { db } from '../firebaseConfig';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar'

function Homepage() {

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Attempting to connect to Firebase...");
        const querySnapshot = await getDocs(collection(db, "animations"));
        
        if (querySnapshot.empty) {
          console.warn("Connected! 'animations' collection is empty.");
        } else {
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log("Success! Data received:", data);
        }
      } catch (error) {
        console.error("Connection failed! Error details:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <>

        <h1>Find, copy and ship</h1>
        <h1>production ready animations. Fast.</h1>
        <p>Explore many possibilities.</p>
        <img src={arrowDown} alt="Arrow down" className={s["icons-inverted"]}/>

        <main></main>

        <main></main>

        <Footer />
    </>
  )
}

export default Homepage
