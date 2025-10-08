import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import registration_image from "../assets/Images/registration_image.png";
import beforeAuthLayout from "../components/BeforeAuth";
import useUserApi from "../hooks/useUserApi";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const { resetPassword } = useUserApi();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      setIsSubmitting(false);
      return;
    }

    try {
      await resetPassword({ email, newPassword, confirmPassword });
      alert("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("❌ Reset password error:", err);
      alert("Failed to reset password.");
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
          alt="Reset Password Illustration"
          className="w-full max-w-md rounded-lg"
        />
      </div>

      {/* Reset Form */}
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-8 text-center md:text-left text-[#1f2a60]">
          Reset Password
        </h1>

        <form onSubmit={handleResetSubmit} className="space-y-6">
          {/* New Password */}
          <div className="relative">
            <label className="block font-semibold mb-1">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-blue-600 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block font-semibold mb-1">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your new password"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || newPassword !== confirmPassword}
              className="w-full bg-purple-500 text-white py-3 rounded-md font-semibold shadow-md focus:outline-none hover:bg-purple-600 disabled:bg-purple-300"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
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

export default beforeAuthLayout(ResetPasswordPage);
