// src/contexts/TTSContext.jsx
import React, { createContext, useContext } from "react";
import useTextToSpeech from "../hooks/useTextToSpeech";

const TTSContext = createContext();

export const TTSProvider = ({ children }) => {
  const { speak, stop } = useTextToSpeech();
  return (
    <TTSContext.Provider value={{ speak, stop }}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = () => useContext(TTSContext);
