export const localAnimations = [
    {
        id: "local-gsap-rotate", // Hardcode the ID for local file
        title: "GSAP Rotate",
        engine: "gsap",
        tags: ["rotation", "modern"],
        dependencies: {
            gsap: "latest"
        },
        code: `import gsap from "gsap"; import { useEffect, useRef } from "react"; export default function App() { const boxRef = useRef(); useEffect(() => { gsap.to(boxRef.current, { rotation: 360, repeat: -1, duration: 2, ease: "none" }); }, []); return ( <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div ref={boxRef} style={{ width: 100, height: 100, background: '#00d2ff', borderRadius: 20 }} /></div> ); }`,
        description: "This animation creates a smooth spinning element using GSAP..."
    },
    {
        id: "local-gsap-pulse",
        title: "Pulsing Glow Animation",
        engine: "gsap",
        tags: ["gsap", "bounce", "modern"],
        dependencies: {
            gsap: "latest",
            gsap_react: "latest"
        },
        code: `import gsap from "gsap"; import { useEffect, useRef } from "react"; export default function App() { const circleRef = useRef(null); useEffect(() => { gsap.to(circleRef.current, { scale: 1.4, boxShadow: "0 0 80px #00ff99", repeat: -1, yoyo: true, duration: 0.7, ease: "power2.inOut", }); }, []); return ( <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", }} > <div ref={circleRef} style={{ width: 140, height: 140, borderRadius: "50%", background: "#00ff99", }} /> </div> ); }`,
        description: "Creates a glowing pulse effect ideal for buttons or music visualizers."
    },


];