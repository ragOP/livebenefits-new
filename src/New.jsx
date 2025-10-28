// Chatbot.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import agent from "../src/assets/pic.png";
import tick from "../src/assets/tick2.png";
import deliver from "../src/assets/delivered.svg";

import {
  EllipsisVertical,
  Paperclip,
  Phone,
  SendHorizontalIcon,
} from "lucide-react";
import NewCall from "./components/NewCall";

export default function Chatbot() {
  // ===== STATE =====
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [finalMessage, setFinalMessage] = useState(false);
  const [switchNumber, setSwitchNumber] = useState(false);
  const [step, setStep] = useState(0); // 0=start, 1=Q1(age), 2=Q2(US), 3=Q3(Part A/B)
  const messagesEndRef = useRef(null);

  const getFormattedTime = (timeString = "") => {
    try {
      return timeString.split(" ")[0].split(":").slice(0, 2).join(":");
    } catch {
      const d = new Date();
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    }
  };

  // ===== ANALYTICS HELPERS IN THIS JSX FILE =====
 useEffect(() => {
    if (typeof window === "undefined") return;

    // Ensure globals
    window._rgba_tags = window._rgba_tags || [];
    window.dataLayer = window.dataLayer || [];
    window.nbq =
      window.nbq ||
      function () {
        (window.nbq.q = window.nbq.q || []).push(arguments);
      };

    // CASE-SENSITIVE — change to your exact Tag Pipe key names if needed.
    const RINGBA_AGE_KEY = "age";
    const RINGBA_PARTAB_KEY = "ab";

    // Public helper: Age (Ringba lowercase ONLY)
    if (typeof window.rbAge !== "function") {
      window.rbAge = function rbAge(value) {
        try {
          const vOriginal = String(value || "").trim();     // as chosen (e.g., "64-69")
          const vLower = vOriginal.toLowerCase();           // for Ringba only

          // Build tag object for _rgba_tags (used by Ringba Tag Pipes)
          // Age goes LOWERCASE, newsbreak_cid stays ORIGINAL (per your requirement).
          const tag = {};
          tag[RINGBA_AGE_KEY] = vLower;                     // <- lowercase for Ringba ingestion
          tag["newsbreak_cid"] = vOriginal;                 // keep original for NB
          tag["type"] = "User";

          window._rgba_tags.push(tag);

          // Try Ringba live APIs (send lowercase for age; original for NB mirror)
          try {
            if (window.ringba?.api?.setTags) {
              // setTags gets the same tag object (age lowercased, NB original)
              window.ringba.api.setTags(tag);
            } else if (window.ringba?.setCustomProperties) {
              window.ringba.setCustomProperties(tag);
            } else if (window._rb?.tag) {
              // Explicit tags
              window._rb.tag(RINGBA_AGE_KEY, vLower);       // age LOWER
              window._rb.tag("newsbreak_cid", vOriginal);   // NB ORIGINAL
            }
          } catch {}

          // Newsbreak custom event: keep original value (not lowercased)
          try {
            window.nbq("trackCustom", "age_range", { value: vOriginal });
          } catch {}

          // dataLayer: keep original (not lowercased)
          window.dataLayer.push({ event: "age_range_selected", age_range: vOriginal });

          console.log("[Ringba] pushed age (lowercased to Ringba):", tag, "→ _rgba_tags:", window._rgba_tags);
        } catch (e) {
          console.warn("[Ringba] age push failed", e);
        }
      };
    }

    // Public helper: Part A/B (Yes/No) — unchanged
    if (typeof window.rbPartAB !== "function") {
      window.rbPartAB = function rbPartAB(value) {
        try {
          const v = String(value || "").trim(); // "Yes" | "No"
          const tag = {};
          tag[RINGBA_PARTAB_KEY] = v;
          tag["type"] = "User";

          window._rgba_tags.push(tag);

          try {
            if (window.ringba?.api?.setTags) {
              window.ringba.api.setTags(tag);
            } else if (window.ringba?.setCustomProperties) {
              window.ringba.setCustomProperties(tag);
            } else if (window._rb?.tag) {
              window._rb.tag(RINGBA_PARTAB_KEY, v);
            }
          } catch {}

          try {
            window.nbq("trackCustom", "ab", { value: v });
          } catch {}

          window.dataLayer.push({ event: "medicare_partab", ab: v });

          console.log("[Ringba] pushed ab:", tag, "→ _rgba_tags:", window._rgba_tags);
        } catch (e) {
          console.warn("[Ringba] ab push failed", e);
        }
      };
    }
  }, []);

  // ===== INITIAL GREETING =====
  useEffect(() => {
    const initialMessages = [
      { text: "Hey there! 👋", sender: "bot" },
      {
        text:
          "Emily this side. Let’s find out if you qualify for the Spending Allowance worth $186/month — it’s quick and only takes 2 minutes!",
        sender: "bot",
        time: new Date().toTimeString(),
      },
      {
        text: "Tap 'Yes' to get started! ⬇️",
        sender: "bot",
        options: ["👉 Yes! Show me how to claim!"],
        time: new Date().toTimeString(),
      },
    ];
    addMessagesWithDelay(initialMessages);
  }, []);

  // ===== MESSAGE UTIL =====
  const addMessagesWithDelay = (botResponses) => {
    let delay = 0;
    setIsTyping(true);
    botResponses.forEach((response, index) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            ...response,
            time: new Date().toTimeString(),
            lastInSequence: index === botResponses.length - 1,
          },
        ]);
        if (index === botResponses.length - 1) {
          setIsTyping(false);
          if (response.options) setCurrentOptions(response.options);
          if (response.input) setShowInput(true);
        }
      }, (delay += 900));
    });
  };

  // ===== FLOW STEPS =====
  const startQ1 = () => {
    setStep(1);
    addMessagesWithDelay([
      {
        text:
          "Awesome! Let's get you the benefit ASAP. I just need to ask you a couple of quick questions.",
        sender: "bot",
      },
      {
        text: "1. What's Your Age Range?",
        sender: "bot",
        options: ["Under 64", "64-69", "70-74", "75+"],
      },
    ]);
  };

  const goToQ2 = () => {
    setStep(2);
    addMessagesWithDelay([
      {
        text: "2. Do you live in the United States?",
        sender: "bot",
        options: ["Yes", "No"],
      },
    ]);
  };

  const goToQ3 = () => {
    setStep(3);
    addMessagesWithDelay([
      {
        text: "3. Are You Currently Enrolled in Medicare Part A or Part B?",
        sender: "bot",
        options: ["Yes", "No"],
      },
    ]);
  };

  const finishAndShowCTA = () => {
    setSwitchNumber(true);
    setTimeout(() => setFinalMessage(true), 800);
  };

  // ===== CENTRAL OPTION CLICK =====
  const handleOptionClick = (option) => {
    // Render user's bubble
    setMessages((prev) => [
      ...prev,
      {
        text: option === "👉 Yes! Show me how to claim!" ? "Yes" : option,
        sender: "user",
        time: new Date().toTimeString(),
      },
    ]);
    setShowInput(false);
    setCurrentOptions([]);

    if (option === "👉 Yes! Show me how to claim!") {
      startQ1();
      return;
    }

    if (step === 1) {
      // AGE SELECTED — SEND rbAge
      try {
        if (typeof window !== "undefined" && typeof window.rbAge === "function") {
          window.rbAge(option); // e.g., "64-69"
        }
      } catch (e) {
        console.warn("rbAge call failed", e);
      }
      goToQ2();
      return;
    }

    if (step === 2) {
      // US residency answer — move on
      goToQ3();
      return;
    }

    if (step === 3) {
      // MEDICARE PART A/B — SEND rbPartAB ("Yes" | "No")
      try {
        if (typeof window !== "undefined" && typeof window.rbPartAB === "function") {
          window.rbPartAB(option);
        }
      } catch (e) {
        console.warn("rbPartAB call failed", e);
      }

      // >>> Inject the two confirmation messages here <<<
      const confirmMessages = [
        {
          text: "Great, I’ve qualified you for the Spending Allowance Card that reloads with $186 every month!",
          sender: "bot",
        },
        {
          text: "This card can be used at all grocery & medical store across United States.",
          sender: "bot",
        },
      ];
      addMessagesWithDelay(confirmMessages);

      // After these two messages animate in, reveal final CTA
      // addMessagesWithDelay uses 900ms per message; two msgs ≈ 1800ms. Add small buffer.
      setTimeout(() => {
        setSwitchNumber(true);
        setFinalMessage(true);
      }, 1800 + 300);

      return;
    }

    // Fallback happy path (shouldn't hit if steps are followed)
    addMessagesWithDelay([
      {
        text: "🎉 Fantastic news! You're one step away from securing your benefit",
        sender: "bot",
      },
      {
        text:
          "Based on what you've told me, you’re eligible for a Spending Allowance Worth Thousands!",
        sender: "bot",
      },
    ]);
    setTimeout(() => setFinalMessage(true), 1200);
  };

  // (Optional text-input path you had)
  const handleSendInput = () => {
    if (inputValue.trim() === "") return;
    setMessages((prev) => [...prev, { text: inputValue, sender: "user" }]);
    setInputValue("");
    setShowInput(false);
    addMessagesWithDelay([
      { text: `Nice to meet you, ${inputValue}!`, sender: "bot" },
      { text: "Let's begin your Soulmate Portrait.", sender: "bot", options: ["Start"] },
    ]);
  };

  // ===== AUTO SCROLL =====
  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      container.scrollTo({
        top: container.scrollHeight - container.clientHeight,
        behavior: "smooth",
      });
    }
  }, [messages, finalMessage, isTyping]);

  // ===== RENDER =====
  return (
    <div
      className="w-full h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
      }}
    >
      {/* Header (always visible) */}
      <div className="bg-[#005e54] text-white p-4 flex items-center gap-2 shadow-md sticky top-0 right-0 left-0 z-10 h-16">
        <img src={agent} alt="Agent" className="w-10 h-10 rounded-full" />
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="flex items-center gap-3">
              <p className="font-bold text-sm">Live Benefit Helpline</p>
              <img src={tick} className="w-4 h-4" style={{ marginLeft: "-6px" }} />
            </div>
            <p className="text-sm">online</p>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-white" />
            <Paperclip className="w-5 h-5 text-white" />
            <EllipsisVertical className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Chat feed */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto flex flex-col mt-[1%] pb-52">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: msg.sender === "bot" ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`flex relative ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && msg.lastInSequence && (
              <img
                src={agent}
                alt="Bot"
                className="w-8 h-8 rounded-full mr-2 absolute bottom-0"
              />
            )}
            <motion.div
              initial={{ width: 0, height: 15 }}
              animate={{ width: "auto", height: "auto" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`pt-2 px-2 pb-0 rounded-lg text-base shadow-md ${
                msg.sender === "user"
                  ? "bg-[#dcf8c6] text-gray-800"
                  : "bg-white text-gray-800 ms-10"
              }`}
              style={{ minWidth: "70px", overflow: "hidden" }}
            >
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                {msg.text}
              </motion.span>

              <span className="flex flex-row-reverse gap-1 items-center">
                {msg.sender === "user" && <img src={deliver} className="h-4 w-4" alt="delivered" />}
                <span className="text-[10px] text-gray-400">{getFormattedTime(msg.time)}</span>
              </span>
            </motion.div>
          </motion.div>
        ))}

        {/* Typing dots */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2"
          >
            <img src={agent} alt="Bot" className="w-8 h-8 rounded-full" />
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-xs p-2 rounded-lg text-sm bg-white text-gray-800 flex items-center gap-1"
            >
              <div className="w-2 h-2 rounded-full animate-bounce bg-gray-500 [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full animate-bounce bg-gray-500 [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full animate-bounce bg-gray-500" />
            </motion.div>
          </motion.div>
        )}

        {/* Input (optional) */}
        {showInput && (
          <div className="mt-2 flex items-center gap-2 justify-end">
            <input
              type="text"
              className="border w-[60vw] p-4 rounded-2xl"
              placeholder="Type your name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button className="px-5 py-4 bg-[#005e54] text-white rounded-2xl" onClick={handleSendInput}>
              <SendHorizontalIcon className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Options */}
        {currentOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 items-center justify-start ms-10">
            {currentOptions.map((option, i) => (
              <button
                key={i}
                className="px-6 py-3 bg-[#005e54] text-white rounded-full text-lg"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
     
        {/* Final CTA */}
        {finalMessage && <NewCall finalMessage={finalMessage} switchNumber={switchNumber} />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
