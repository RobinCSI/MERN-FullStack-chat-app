import { useState } from "react";
import styles from "./App.module.css";

import LandingPage from "./Pages/LandingPage/LandingPage";
import ChatPage from "./Pages/ChatPage/ChatPage";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className={styles.App}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chatPage" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
