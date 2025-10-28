import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NewCall = ({ finalMessage, switchNumber }) => {
  const [time, setTime] = useState(180);

  useEffect(() => {
    if (time <= 0) return;

    if (finalMessage) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [time, finalMessage]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <motion.div
      className="flex flex-col items-center pt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-green-100 text-green-700 text-center p-3 rounded-md w-full max-w-md"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <p className="font-semibold">
          Tap on the button below to make a quick call & that's it. You'll be
          qualified on the call by a licensed agent in minutes 👇
        </p>
      </motion.div>

      <motion.a
        href={switchNumber ? 'tel:+13236897861': 'tel:+18336638513'}
        className="mt-4 bg-green-500 text-white text-lg font-bold py-3 px-6 rounded-md w-full max-w-md text-center transition hover:bg-green-600 relative"
        style={{ height: "120%", fontSize: "140%" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {switchNumber ? "CALL (323)-689-7861": "CALL (833)-366-8513"}
        
      </motion.a>

      <motion.p
        className="mt-4 text-gray-600 text-center text-sm w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Due to high call volume, your official agent is waiting for only{" "}
        <span className="font-bold">3 minutes</span>, then your spot will not be
        reserved.
      </motion.p>

      <motion.p
        className="mt-2 text-red-500 font-bold text-lg"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        {formatTime(time)}
      </motion.p>
    </motion.div>
  );
};

export default NewCall;
