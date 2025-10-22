// index.jsx
import React, { useEffect, useRef, useState } from "react";
import Card from "./assets/card.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
export default function Eng() {
  // ==== GLOBAL SAFETIES ====
  if (typeof window !== "undefined") {
    window._rgba_tags = window._rgba_tags || [];
    window.__nb_events = window.__nb_events || [];
  }

  // ====== Flow state ======
  const [quizStep, setQuizStep] = useState(1);
  const [quizQuestion, setQuizQuestion] = useState("1. What's Your Age Range?");
  const [showStatus, setShowStatus] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [locked, setLocked] = useState(false); // lock interactions after congrats

  // ====== Counters & misc ======
  const [counter, setCounter] = useState(22563);
  const [claim, setClaim] = useState(72);
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(52);
  const timerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // ==== CALL NUMBER (dynamic based on selections) ====
  // default number
  const [telNumber, setTelNumber] = useState("+13236897861");
  const [displayNumber, setDisplayNumber] = useState("(323) 689-7861");

  // Desktop vs mobile logo switch
  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // When status OR congrats is visible, we hide everything except the header + that block
  const hideMain = showStatus || showCongrats;

  // ====== CSS (full stylesheet) ======
  const styles = `
  html {
    font-size: 0.5vw;
    font-family: Arial, Helvetica, sans-serif;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    background-image: url('./17580.jpg');
    line-height: 1.4;
  }

  /* --- Header --- */
  .div1 {
    background: linear-gradient(90deg, #003f91, #006cb8);
    color: white;
    text-align: center;
    padding: 0.8em;
    font-size: 1.2em;
    font-weight: 800;
    letter-spacing: 0.05em;
    width: 100%;
    border-top: 0.2em solid #1e3a8a;

    top: 0;
    z-index: 9999;
  }
  .div1 > p { margin: 0; }

  /* --- Live counter strip --- */
  .div2 {
    background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
    color: white;
    text-align: center;
    padding: 0.8em 1em;
    font-size: 2em;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    width: 100%;
    border-top: 0.15em solid #15803d;
    flex-wrap: wrap;
    word-break: break-word;
  }
  .div3 {
    width: 0.6em;
    height: 0.6em;
    background: #22c55e;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
    box-shadow: 0 0 0.5em rgba(34, 197, 94, 0.8);
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0.5em rgba(34, 197, 94, 0.8); }
    50% { opacity: 0.7; transform: scale(1.2); box-shadow: 0 0 1em rgba(34, 197, 94, 1); }
  }
  #counter { font-weight: 800; font-style: italic; }
  .div5 { display: none !important; } /* generic 'hide' */

  /* --- Main container --- */
  .div6 { width: 100%; margin: 0; padding: 0em 20%; border-top: 0.1em solid #e5e7eb; }
  .div7 { width: 100%; margin: 0; padding: 0; }
  .div8 {
    padding: 0.5em 1em 0.8em 1em;
    text-align: center;
    font-size: 4.3em;
    font-weight: 900;
    color: #1f2937;
    line-height: 1.2;
  }
  .div9 {
    width: 85%;
    max-width: 100em;
    height: auto;
    display: block;
    margin: 0.6em auto 0.2em auto;
    border-radius: 0.5em;
    object-fit: cover;
  }
  .div10 {
    padding: 1em 1.5em;
    text-align: center;
    font-size: 2.2em;
    font-weight: 900;
    color: #374151;
    line-height: 1.5;
  }
  .arrow-section { text-align: center; padding: 1em 0 1.5em 0; color: #6b7280; }
  .arrow-section i { font-size: 2.8em; animation: bounce 2s infinite; }
  @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-0.3em); } 60% { transform: translateY(-0.15em); } }

  .div11 { background: #f1f5f9; padding: 0.1em; width: 100%; }
  .div12 {
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    color: white; font-size: 2.3em; font-weight: 500; padding: 1em 0.5em; border-radius: 0.8em; text-align: center; margin: 0.3em;
    box-shadow: 0 0.3em 0 #16a34a; letter-spacing: 0.05em;
  }

  /* --- Quiz card --- */
  .div13 {
    background: #ebebeb;
    padding: 0.8em 1.2em 1.2em 1.2em;
    border-radius: 0.9em;
    width: 100%;
  }
  .div14 { text-align: center; padding: 0.2em 0 0.5em 0; font-size: 3.2em; font-weight: 700; color: #1f2937; }

  .div15 { display: flex; flex-direction: column; gap: 0.8em; margin-bottom: 1.2em; }

  :root { --anim-4: scaleUp 2s infinite; }
  @keyframes scaleUp { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
  .glow {
    box-shadow: 0 0 0.375rem rgba(40, 167, 69, 0.4), 0 0 0.625rem rgba(40, 167, 69, 0.2);
  }
  .shimmer { position: relative; overflow: hidden; }
  .shimmer::before {
    content: "";
    position: absolute; top: 0; left: -75%; width: 50%; height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shimmer 2s infinite;
  }
  @keyframes shimmer { 0% { left: -75%; } 100% { left: 125%; } }

  .div16 {
    background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
    color: white; padding: 1em; border-radius: 2.5em; text-align: center; font-size: 2.2em; font-weight: 700;
    cursor: pointer; border: none; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 0.3em 0.6em rgba(22, 163, 74, 0.3);
    animation: scaleUp 2s infinite; max-width: 95%; width: 100%; margin: 0.3em auto; transition: all 0.3s ease;
    user-select: none;
  }
  .div16:hover { transform: translateY(-0.1em); box-shadow: 0 0.5em 1em rgba(22, 163, 74, 0.4); background: linear-gradient(135deg, #15803d 0%, #16a34a 100%); }
  .div16:active { transform: translateY(0); box-shadow: 0 0.2em 0.4em rgba(22, 163, 74, 0.3); }

  .div17 { display: flex; align-items: center; justify-content: center; gap: 0.5em; font-size: 2.1em; color: #374151; font-weight: 600; }
  .div18 {
    width: 0.5em; height: 0.5em; background: #22c55e; border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite; box-shadow: 0 0 0.3em rgba(34, 197, 94, 0.8);
  }
  #claim { color: #16a34a; font-weight: 800; }

  /* --- Status & Congrats blocks --- */
  .div4 {
    background: #e9f2ff; color: #1f2937; text-align: center; padding: 3em 1em; margin: 3em 18%;
    font-size: 1.2em; font-weight: 700; border-top: 0.2em solid #2196f3;
  }
  #statusMessage { font-size: 2.5em; }
  #congratulations.div4 { margin: 3em 18%; background: #e3f2fd; border-top: 0.2em solid #2196f3; }
  .div19 { color: rgb(34 197 94); text-align: center; font-size: 3em; font-weight: 700; margin-bottom: 0.3em; }
  .div20 {
    background: rgb(254 240 138);
    text-align: center; font-size: 3em; font-weight: 200; margin: 0.2em 1em; line-height: 1.5; padding: 0.08em;
  }
  .div20 span { font-weight: 700; }
  .div21 {
    background: rgb(253 224 71); color: #1f2937; text-align: center; font-size: 2.5em; font-weight: 700;
    padding: 0.7em 1.2em; border-radius: 0.5em; width: max-content; display: inline-block; margin-top: 0.5em;
  }
  .div22 {
    background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
    color: white; text-align: center; font-size: 3.2em; font-weight: 800; padding: 1.1em; border-radius: 0.8em; margin: 1em 1em;
    cursor: pointer; transition: all 0.3s ease; box-shadow: 0 0.4em 0.8em rgba(22, 163, 74, 0.3);
    text-decoration: none; display: block; animation: glow 1.5s ease-in-out infinite;
  }
  @keyframes glow {
    0%, 100% { opacity: 1; box-shadow: 0 0 0.5em rgba(34, 197, 94, 0.8); }
    50% { opacity: 0.85; box-shadow: 0 0 1em rgba(34, 197, 94, 1); }
  }
  .div22:hover { transform: translateY(-0.1em); box-shadow: 0 0.5em 1em rgba(22, 163, 74, 0.4); }
  .div23 { text-align: center; font-size: 1.9em; color: #374151; margin: 1.5em 1em; line-height: 1.4; font-weight: 500; }
  .div24 {
    display: flex; justify-content: center; align-items: center; gap: 0.1em; font-size: 2.2em; font-weight: 900; color: #dc2626;
    border: 0.08em dashed #dc2626; margin: 1.2em auto; width: fit-content; padding: 0.1em 0.35em;
  }
  .div25 {
    background: transparent; border-radius: 0.15em; text-align: center; color: #dc2626;
    font-family: Arial, Helvetica, sans-serif; font-weight: 700; font-size: 1em; min-width: 1.4em;
  }

  /* --- Footer (hidden on status/congrats) --- */
  .div26 {
    color: #374151; padding: 2.5em 20%; font-size: 2em; line-height: 1.6; text-align: center; width: 100%; margin-top: 10em;
  }
  .div27 { margin: 1em 0; display: flex; justify-content: center; gap: 0.5em; flex-wrap: wrap; }
  .div27 a { color: #374151; text-decoration: none; }
  .div27 a:hover { text-decoration: underline; }

  /* NB chip */
  #nb-chip {
    position: fixed; right: 12px; bottom: 12px; z-index: 99999; padding: 8px 12px;
    font-size: 12px; font-weight: 800; border-radius: 999px; background: rgba(20, 180, 90, 0.95);
    color: #fff; box-shadow: 0 6px 20px rgba(0,0,0,0.2); display: none; pointer-events: none;
  }

  @media (max-width: 48em) {
    html { font-size: 3vw; }
    .div1 { font-size: 1em; }
    .div2 { font-size: 1.2em; padding: 0.7em 0.6em; }
    .div6 { padding: 0em 5%; }
    .div8 { font-size: 2.2em; padding: 1em 0.8em 0.8em 0.8em; }
    .div10 { font-size: 1.2em; padding: 0.7em 0.8em; }
    .div12 { font-size: 1.2em; }
    .div13 { padding: 0.6em 0.9em 0.9em 0.9em; }
    .div14 { font-size: 1.8em; }
    .div16 { font-size: 1.5em; padding: 0.8em; }
    .div17 { font-size: 1.2em; }
    .div4 { font-size: 1em; padding: 1.5em 0.8em; margin: 1em 5%; }
    #statusMessage { font-size: 1.5em; }
    #congratulations.div4 { margin: 1em 5%; }
    .div19 { font-size: 1.9em; }
    .div20 { font-size: 1.6em; margin-top: 0.6em; }
    .div21 { font-size: 1.4em; margin-top: 0.4em; }
    .div22 { font-size: 1.8em; }
    .div23 { font-size: 1.3em; }
    .div24 { font-size: 1.7em; }
    .div26 { font-size: 1.1em; padding: 1em 5%; }
  }
  `;

  // ====== Utilities ======
  function scrollTopNow() {
    // Instant jump to top for status/congrats
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function smoothScrollToTop(duration, targetPosition = 0) {
    if (locked || hideMain) return; // disable while status/congrats or locked
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (!locked && !hideMain && timeElapsed < duration) requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
  }

  const showNbChip = (text) => {
    const el = document.getElementById("nb-chip");
    if (!el) return;
    el.textContent = text;
    el.style.display = "inline-block";
    clearTimeout(window.__nb_chip_to);
    window.__nb_chip_to = setTimeout(() => (el.style.display = "none"), 2000);
  };

  // NB raw_call (kept active always)
  const fireNbRawCall = () => {
    try {
      const evt = { event: "raw_call", at: new Date().toISOString() };
      window.__nb_events.push(evt);
      console.log("[NB Pixel] Firing raw_call", evt);
      if (typeof window.nbpix === "function") {
        window.nbpix("event", "raw_call");
      } else {
        window.__nb_fallback_queue = window.__nb_fallback_queue || [];
        window.__nb_fallback_queue.push(["event", "raw_call"]);
      }
      showNbChip("NB: raw_call sent");
    } catch (e) {
      console.warn("[NB Pixel] raw_call fire failed", e);
    }
  };

  // ====== Ringba queue-only (no external script) ======
  const RINGBA_AGE_KEY = "age";           // change to 'Age' if your Ringba expects capitalized
  const RINGBA_MEDICARE_KEY = "ab";       // key for Medicare Part A/B selection

  // Helper to push a tag to Ringba queue with optional newsbreak_cid
  function pushRingbaTag(tagObj) {
    try {
      const withCid = { ...tagObj };
      if (typeof window !== "undefined" && window.newsbreak_cid) {
        withCid.newsbreak_cid = window.newsbreak_cid;
      }
      window._rgba_tags.push(withCid);
      console.log("[Ringba] pushed:", withCid, "→ _rgba_tags:", window._rgba_tags);
    } catch (e) {
      console.warn("[Ringba] push failed", e);
    }
  }

  // Age tag (force lowercase values as requested)
  const rbAge = (value) => {
    if (locked || hideMain) return; // stop pushes during/after status/congrats
    pushRingbaTag({ [RINGBA_AGE_KEY]: String(value).toLowerCase() });
  };

  // Medicare A/B tag
  const rbMedicare = (value) => {
    // value should be "yes" or "no"
    pushRingbaTag({ [RINGBA_MEDICARE_KEY]: value });
  };

  // ====== Animated counters ======
  useEffect(() => {
    const id = setInterval(() => setCounter((p) => p + (Math.floor(Math.random() * 3) + 1)), 3000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const id = setInterval(() => setClaim((p) => p + (Math.floor(Math.random() * 2) + 1)), 3000);
    return () => clearInterval(id);
  }, []);

  // Fallback flush if nbpix appears later
  useEffect(() => {
    const onLoad = () => {
      if (window.__nb_fallback_queue && typeof window.nbpix === "function") {
        window.__nb_fallback_queue.forEach((args) => {
          try { window.nbpix.apply(null, args); } catch {}
        });
        window.__nb_fallback_queue.length = 0;
      }
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  // ====== Flow functions ======
  const updateToCitizenStep = () => {
    setQuizStep(2);
    setQuizQuestion("2. Are you a U.S. Citizen?");
    smoothScrollToTop(900, 432);
  };

  const updateToMedicareStep = () => {
    setQuizStep(3);
    setQuizQuestion("3. Are You Currently Enrolled in Medicare Part A or Part B?");
    smoothScrollToTop(900, 532);
  };

  const stepProcess = () => {
    if (locked || hideMain) return;
    // Show STATUS at the top, hide everything except header
    setShowStatus(true);
    scrollTopNow();

    // Update status messages
    const statusMessage = () => document.getElementById("statusMessage");
    setTimeout(() => {
      if (statusMessage()) statusMessage().textContent = "Verifying Availability...";
      setTimeout(() => {
        if (statusMessage()) statusMessage().textContent = "Confirming Eligibility...";
        setTimeout(() => showCongratulations(), 1500);
      }, 1500);
    }, 1500);
  };

  const showCongratulations = () => {
    if (locked) return; // avoid duplicate
    // Hide status, show CONGRATS at the top, keep header
    setShowStatus(false);
    setShowCongrats(true);
    setLocked(true);
    scrollTopNow();
    startTimer();
  };

  const startTimer = () => {
    let totalSeconds = 172;
    if (timerRef.current) clearInterval(timerRef.current);
    setMinutes(Math.floor(totalSeconds / 60));
    setSeconds(totalSeconds % 60);
    timerRef.current = setInterval(() => {
      totalSeconds -= 1;
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      setMinutes(m);
      setSeconds(s < 10 ? `0${s}` : s);
      if (totalSeconds < 0) clearInterval(timerRef.current);
    }, 1000);
  };

  useEffect(() => () => timerRef.current && clearInterval(timerRef.current), []);

  // ====== Quiz handlers ======
  // Step 1 (Age) buttons call this and push Ringba age tag
  const handleAgeSelect = (ageValue) => {
    if (locked || hideMain) return;

    // force lowercase for Ringba; UI labels remain as-is
    rbAge(ageValue);

    // DYNAMIC CALL NUMBER SWITCH:
    // when "Under 64" is selected, switch to +18336638513
    if (String(ageValue).toLowerCase() === "under 64") {
      setTelNumber("+18336638513");
      setDisplayNumber("(833) 748-0815");
    } else {
      // keep / reset to default for other ranges
      setTelNumber("+13236897861");
      setDisplayNumber("(323) 689-7861");
    }

    updateToCitizenStep();
  };

  // Step 2: Citizen (yes/no)
  const handleCitizen = (answer) => {
    if (locked || hideMain) return;
    updateToMedicareStep();
  };

  // Step 3: Medicare (yes/no) → push Ringba 'ab' + proceed
  const handleMedicare = (answer) => {
    if (locked || hideMain) return;
    const norm = String(answer).toLowerCase() === "yes" ? "yes" : "no";
    rbMedicare(norm);
    stepProcess();
  };

  // ====== Render ======
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* HEADER — always visible */}
      <div
        className="div1"
        onClick={() => smoothScrollToTop(1000, 432)}
        style={{ cursor: hideMain ? "default" : "pointer" }}
      >
        <p style={{ fontSize: "1.3em", margin: 0 }}>Live Benefits</p>
      </div>

      {/* Hero / Quiz — hidden when status OR congrats */}
      <div className={`div6 ${hideMain ? "div5" : ""}`}>
        <div className="div7">
          <div
            className="div8"
            onClick={() => smoothScrollToTop(1000, 432)}
            style={{ cursor: hideMain ? "default" : "pointer" }}
          >
            Final Call For Seniors Over 64 To Claim Their Spending Allowance Card Worth Thousands!
          </div>

          {/* Placeholder image (replace with your asset if needed) */}
          <img
            className="div9"
            src={Card}
            alt="Hero"
            onClick={() => smoothScrollToTop(1000, 432)}
            style={{ cursor: hideMain ? "default" : "pointer" }}
          />

          <div className="div10">
            Checking your eligibility is very simple and takes just 60 seconds, simply answer the questions below to see if you qualify now.
          </div>

          {/* <div className="arrow-section" title="Scroll for questions">⬇️</div> */}
 <div
      className="arrow-section"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100px",
      }}
    >
      <FontAwesomeIcon
        icon={faAngleDown}
        style={{
          fontSize: "40px",
          color: "#333",
          animation: "bounce 1.5s infinite ease-in-out",
        }}
      />

      {/* Inline keyframes */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(10px);
            }
          }
        `}
      </style>
    </div>


          <div className="div11">
            <div className="div12">Answer The Question Below To Proceed:</div>
          </div>
        </div>

        <div className="div13">
          <div className="div14">
            <span id="quizQuestion">{quizQuestion}</span>
          </div>

          {/* STEP 1: Age range */}
          {quizStep === 1 && (
            <div className="div15" id="answerOptions">
              <div className="div16 glow shimmer" onClick={() => handleAgeSelect("Under 64")}>Under 64</div>
              <div className="div16 glow shimmer" onClick={() => handleAgeSelect("64-69")}>64-69</div>
              <div className="div16 glow shimmer" onClick={() => handleAgeSelect("70-74")}>70-74</div>
              <div className="div16 glow shimmer" onClick={() => handleAgeSelect("75+")}>75+</div>
            </div>
          )}

          {/* STEP 2: U.S. Citizen */}
          {quizStep === 2 && (
            <div className="div15" id="answerOptions">
              <div className="div16 glow shimmer" onClick={() => handleCitizen("yes")}>Yes</div>
              <div className="div16 glow shimmer" onClick={() => handleCitizen("no")}>No</div>
            </div>
          )}

          {/* STEP 3: Medicare A/B */}
          {quizStep === 3 && (
            <div className="div15" id="answerOptions">
              <div className="div16 glow shimmer" onClick={() => handleMedicare("yes")}>Yes</div>
              <div className="div16 glow shimmer" onClick={() => handleMedicare("no")}>No</div>
            </div>
          )}
        </div>
      </div>

      {/* STATUS — only visible (with header) when showStatus = true */}
      <div className={`div4 ${showStatus ? "" : "div5"}`} id="status" aria-live="polite">
        <span id="statusMessage">Reviewing Your Answers...</span>
      </div>

      {/* CONGRATULATIONS — only visible (with header) when showCongrats = true */}
      <div className={`div4 ${showCongrats ? "" : "div5"}`} id="congratulations">
        <div className="div19">Congratulations, You Qualify 🎉</div>
        <div className="div20">
          Make A <span>Quick Call</span> To Claim Your Spending Allowance Worth Thousands Now!
        </div>
        <div className="div21">Spots remaining: 4</div>
        <div className="div99"><h2 style={{ margin: 0 }}>Tap Below To Call Now! 👇</h2></div>

        {/* CTA anchor — active even after locked */}
        <a
          href={`tel:${telNumber}`}
          id="callLink"
          className="div22 glow shimmer"
          onPointerDown={fireNbRawCall}
          onClick={fireNbRawCall}
        >
          CALL {displayNumber}
        </a>

        <div className="div23">
          Due to high call volume, your official agent is waiting for only <strong>3 minutes</strong>, then your spot will not be reserved.
        </div>
        <div className="div24" aria-live="polite">
          <div className="div25" id="minutes">{minutes}</div>
          <div className="div25">:</div>
          <div className="div25" id="seconds">{seconds}</div>
        </div>
      </div>

      {/* Footer — hidden when status OR congrats */}
      <div className={`div26 ${hideMain ? "div5" : ""}`}>
        <img
          src={isMobile ? "./dis-mobile.png" : "./dis-desktop.png"}
          alt="Logo"
          style={{ width: "auto", marginBottom: "0.5em" }}
        />
        This website is operated by a marketing and lead generation company. We are not a government agency, insurance provider, or financial institution.
        Our role is to connect consumers with licensed professionals, carriers, or service providers who can discuss available options. We do not make eligibility
        determinations or provide coverage, financing, or government benefits directly.
        <br /><br />
        Beware of other fraudulent &amp; similar-looking websites that might look exactly like ours, we have no affiliation with them.
        This is the only official website to claim your Spending Allowance Benefit with the domain name boostbenefitshub.com
        <div className="div27">
          <a href="/terms.html">Terms &amp; Conditions</a> | <a href="/privacy.html">Privacy Policy</a>
        </div>
      </div>

      {/* NB chip (small debug toast) */}
      {/* <div id="nb-chip">NB: raw_call sent</div> */}
    </>
  );
}
