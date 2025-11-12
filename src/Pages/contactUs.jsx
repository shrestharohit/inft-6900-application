import React from "react";
import beforeAuthLayout from "../components/BeforeAuth";

function Contact() {
  return (
    <div className="p-5 text-center">
      <h1 className="text-3xl font-bold mb-3">Contact Us</h1>
      <p>You can reach us at brainwave.inft6900@gmail.com</p>
    </div>
  );
}

export default beforeAuthLayout(Contact);


