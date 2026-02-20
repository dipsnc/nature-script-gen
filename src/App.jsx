import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

const SCRIPTS = {
  "pine-forest": [
    "Close your eyes and imagine the scent of fresh pine needles...",
    "Take a deep breath in, feeling the crisp, cool forest air fill your lungs.",
    "Exhale slowly, letting go of any tension as you hear the gentle sway of the trees.",
    "Notice the soft moss beneath your feet, grounding you in this peaceful sanctuary.",
    "Inhale the stillness of the deep woods...",
    "Exhale, becoming one with the quiet rhythm of the earth.",
  ],
  "misty-mountains": [
    "Visualize yourself standing on a high peak, surrounded by soft, white clouds.",
    "Inhale deeply, drawing in the pure, thin mountain air.",
    "Exhale, feeling as light as the mist drifting across the valley.",
    "The world below is silent; here, there is only peace and perspective.",
    "Breathe in the ancient strength of the peaks...",
    "Exhale, letting your worries dissolve into back into the vast sky.",
  ],
  "peaceful-lake": [
    "Picture a lake as clear and still as glass, reflecting the morning sun.",
    "Inhale, slowly ripple the surface of your awareness with a gentle breath.",
    "Exhale, watching the ripples fade until everything is perfectly still again.",
    "The water is calm, and so are you. Feel the gentle warmth on your skin.",
    "Inhale the clarity of the crystalline water...",
    "Exhale, sinking into a state of profound, deep relaxation.",
  ],
  generic: [
    "Find a comfortable position and gently close your eyes.",
    "Inhale deeply through your nose, counting to four...",
    "Hold for a moment, feeling the serenity within you.",
    "Exhale slowly through your mouth, releasing all that no longer serves you.",
    "Keep your breath steady, natural, and rhythmic...",
    "You are safe, you are calm, and you are exactly where you need to be.",
  ],
};

function App() {
  const [location, setLocation] = useState("");
  const [phase, setPhase] = useState("input"); // 'input', 'loading', 'meditating', 'finished'
  const [currentScript, setCurrentScript] = useState([]);
  const [scriptIndex, setScriptIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    let timer;
    if (phase === "meditating" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setPhase("finished");
    }
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  useEffect(() => {
    if (phase === "meditating") {
      const interval = 60 / currentScript.length;
      const currentIndex = Math.min(
        Math.floor((60 - timeLeft) / interval),
        currentScript.length - 1,
      );
      setScriptIndex(currentIndex);
    }
  }, [timeLeft, phase, currentScript]);

  const startMeditation = () => {
    if (!location.trim() && phase === "input") return;

    setPhase("loading");

    // Determine script and theme
    const normalizedLoc = location.toLowerCase().trim().replace(/\s+/g, "-");
    const selectedScript = SCRIPTS[normalizedLoc] || SCRIPTS["generic"];
    const selectedTheme = SCRIPTS[normalizedLoc] ? normalizedLoc : "default";

    setCurrentScript(selectedScript);
    setTheme(selectedTheme);

    // Simulate "generation" delay for premium feel
    setTimeout(() => {
      setPhase("meditating");
      setTimeLeft(60);
    }, 2500);
  };

  const reset = () => {
    setPhase("input");
    setLocation("");
    setTheme("default");
    setScriptIndex(0);
  };

  return (
    <div className={`app-container bg-${theme}`}>
      <header className="site-header">
        <div className="brand">
          <div className="brand-icon">✧</div>
          <span>AURA GEN</span>
        </div>
        <nav className="nav-links">
          <span>LIBRARY</span>
          <span>SESSIONS</span>
          <span>ABOUT</span>
        </nav>
      </header>

      <main className="main-content">
        <AnimatePresence mode="wait">
          {phase === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card"
            >
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Nature Meditation
              </motion.h1>
              <motion.p
                className="subtitle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Enter a location to generate a customized 60-second breathing
                exercise.
              </motion.p>

              <div className="input-group">
                <input
                  type="text"
                  placeholder="e.g. Pine Forest, Peaceful Lake..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startMeditation()}
                />
                <button onClick={startMeditation}>Generate Sanctuary</button>
              </div>
            </motion.div>
          )}

          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card"
            >
              <h1>Crafting...</h1>
              <p className="subtitle">Curating the atmosphere for {location}</p>
              <div className="loader-container">
                <div className="luxury-loader"></div>
              </div>
            </motion.div>
          )}

          {phase === "meditating" && (
            <motion.div
              key="meditating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card"
            >
              <div className="script-container">
                <div className="breathing-ring-container">
                  <motion.div
                    className="breathing-ring"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="breathing-core"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <div className="timer-display">
                    <div className="timer-value">{timeLeft}</div>
                    <div className="timer-label">seconds</div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={scriptIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="script-text"
                  >
                    "{currentScript[scriptIndex]}"
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {phase === "finished" && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card"
            >
              <h1>Breathe Out.</h1>
              <p className="subtitle">Your sanctuary is always here for you.</p>
              <button onClick={reset}>New Session</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="site-footer">
        <span>© 2026 AURA GEN</span>
        <span>RELAXED • FOCUSED • PRESENT</span>
        <span>SOUNDS ON</span>
      </footer>
    </div>
  );
}

export default App;
