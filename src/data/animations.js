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
    {
        id: "local-framer-magnetic",
        title: "Magnetic Hover Button",
        engine: "framer-motion",
        tags: ["framer-motion", "hover", "modern", "micro-interaction"],
        dependencies: {
            "framer-motion": "latest",
            "lucide-react": "latest"
        },
        code: `import { motion } from "framer-motion";
            import { useState, useRef } from "react";

            export default function App() {
            const ref = useRef(null);
            const [position, setPosition] = useState({ x: 0, y: 0 });

            const handleMouseMove = (e) => {
                const { clientX, clientY } = e;
                const { left, top, width, height } = ref.current.getBoundingClientRect();
                const x = clientX - (left + width / 2);
                const y = clientY - (top + height / 2);
                // Limit the magnetic pull distance
                setPosition({ x: x * 0.35, y: y * 0.35 });
            };

            const handleMouseLeave = () => {
                setPosition({ x: 0, y: 0 });
            };

            return (
                <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#0b0b0f" }}>
                <motion.button
                    ref={ref}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    animate={{ x: position.x, y: position.y }}
                    transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
                    style={{
                    padding: "16px 32px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#fff",
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    }}
                >
                    Hover Near Me
                </motion.button>
                </div>
            );
            }`,
        description: "A magnetic button effect that gently pulls toward the user's cursor on hover."
    },

    {
    id: "local-framer-orbit",
    title: "Infinite Orbit Loader",
    engine: "framer-motion",
    tags: ["framer-motion", "infinite", "loader", "svg"],
    dependencies: {
        "framer-motion": "latest"
    },
    code: `import { motion } from "framer-motion";
    export default function App() {
    return (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#050505" }}>
        <div style={{ position: "relative", width: 100, height: 100 }}>
            <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: "3px solid transparent",
                borderTopColor: "#3b82f6",
                borderBottomColor: "#3b82f6",
            }}
            />
            <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            style={{
                position: "absolute",
                width: "70%",
                height: "70%",
                top: "15%",
                left: "15%",
                borderRadius: "50%",
                border: "3px solid transparent",
                borderLeftColor: "#ec4899",
                borderRightColor: "#ec4899",
            }}
            />
        </div>
        </div>
    );
    }`,
        description: "A continuous, high-performance loading state featuring nested orbital rings. Utilizing synchronized but inverted infinite timelines, the outer ring spins clockwise while the inner accent ring rotates counter-clockwise at a faster tempo, providing a sophisticated, mesmerizing visual loop for async state changes."
    }

];