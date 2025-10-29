import React from "react";
import beforeAuthLayout from "../components/BeforeAuth";

function About() {
  return (
    <div className="p-5 text-center">
      <h1 className="text-3xl font-bold mb-3">About Us</h1>
      <p>BrainWave is a platform for learning and growth.</p>
    </div>
  );
}

// ✅ Wrap with layout HOC — this injects Header & Footer
export default beforeAuthLayout(About);
