import React from "react";
import beforeAuthLayout from "../components/BeforeAuth";

function Terms() {
  return (
    <div className="p-5 text-center">
      <h1 className="text-3xl font-bold mb-3">Terms & Conditions</h1>
      <p> By using BrainWave, you agree to our terms and conditions.</p>
    </div>
  );
}

export default beforeAuthLayout(Terms);


