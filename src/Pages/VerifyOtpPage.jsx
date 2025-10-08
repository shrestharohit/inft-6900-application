import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import registration_image from "../assets/Images/registration_image.png";
import beforeAuthLayout from "../components/BeforeAuth";
import useUserApi from "../hooks/useUserApi";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const { verifyResetOTP } = useUserApi();

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await verifyResetOTP(email, otp);
      alert("OTP verified successfully!");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      console.error("❌ OTP verification error:", err);
      alert("Invalid OTP. Try again.");
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
          alt="OTP Verification Illustration"
          className="w-full max-w-md rounded-lg"
        />
      </div>

      {/* OTP Form */}
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-8 text-center md:text-left text-[#1f2a60]">
          Verify OTP
        </h1>

        <p className="mb-4 text-gray-600 text-center md:text-left">
          An OTP has been sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerifySubmit} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label className="block font-semibold mb-1">Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the 6-digit OTP"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-500 text-white py-3 rounded-md font-semibold shadow-md focus:outline-none hover:bg-green-600 disabled:bg-green-300"
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
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

export default beforeAuthLayout(VerifyOtpPage);
