import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import registration_image from "../assets/Images/registration_image.png";
import beforeAuthLayout from "../components/BeforeAuth";
import useUserApi from "../hooks/useUserApi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { sendResetOTP } = useUserApi();
  
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendResetOTP(email).then(() => {
        alert("OTP sent to your email!");
        navigate("/verify-otp", { state: { email } });
      });
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg max-w-6xl w-full mx-auto my-16 p-10">
      {/* Left Image */}
      <div className="flex-1 flex justify-center items-center mb-6 md:mb-0 md:mr-10">
        <img
          src={registration_image}
          alt="Forgot Password Illustration"
          className="w-full max-w-md rounded-lg"
        />
      </div>

      {/* Forgot Form */}
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-8 text-center md:text-left text-[#1f2a60]">
          Forgot Password
        </h1>

        <form onSubmit={handleForgotSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Enter Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your registered email"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold shadow-md focus:outline-none hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>

          {/* Back to Login Link */}
          <div className="text-center mt-4">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default beforeAuthLayout(ForgotPassword);
