import React, {useEffect, useState} from 'react'
import { collection, getDocs, addDoc  } from "firebase/firestore"
import { db } from '../firebaseConfig'
import { Sandpack, SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from "@codesandbox/sandpack-react";

function AnimationGrid() {
    const [animations, setAnimations] = useState([]);

    const getCleanDependencies = (selectedAnim) => {
    if (!selectedAnim || !selectedAnim.dependencies) return {};

    const dependencies = { ...selectedAnim.dependencies };

    // If "gsap_react" exists, rename it to the official "@gsap/react" | needed bc Firebase can't read symbols like "@" in keys
      if (dependencies.gsap_react) {
        dependencies["@gsap/react"] = dependencies.gsap_react;
        delete dependencies.gsap_react;
      }

      return dependencies;
    };

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
              setAnimations(data);
            }
          } catch (error) {
            console.error("Connection failed! Error details:", error.message);
          }
        };
    
        fetchData();
      }, []);

    return (
        <div className="animation-grid">
            <h3>Explore</h3>

            <button>Web animations</button>
            <button>Mobile animations</button>

            <p>Filters</p>

            <p>Showing {animations.length} out of {animations.length} animations</p>

            <div className="container">
                {animations.map(anim => (
                    <div key={anim.id}>
                        <h3>{anim.title}</h3>

                        {/* <Sandpack
                            template='react'
                            theme='dark'
                            files={{
                            'App.js': anim.code
                            }}
                            customSetup={{
                            dependencies: getCleanDependencies(anim)
                            }}
                        /> */}

                        <SandpackProvider 
                            template='react'
                            theme='dark'
                            files={{
                                'App.js': anim.code
                            }}
                            customSetup={{
                                dependencies: getCleanDependencies(anim)
                            }}
                            options={{
                                showTabs: true,
                                editorHeight: 500,
                            }}
                            >
                            <SandpackLayout>
                                <SandpackPreview />
                            </SandpackLayout>
                        </SandpackProvider>
                    </div>
                ))}
            </div>
         
        </div>
    ) 
}

export default AnimationGrid