import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/user"; // ✅ backend API call
import registration_image from "../assets/Images/registration_image.png";
import beforeAuthLayout from "../components/BeforeAuth";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await resetPassword({
        email,
        newPassword,
        confirmPassword,
      });
      alert(result.message || "Password reset successfully!");
      navigate("/login"); // ✅ go back to login after success
    } catch (err) {
      console.error("❌ Reset password error:", err);
      alert(err.error || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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

      {/* Reset Form */}
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-8 text-center md:text-left text-[#1f2a60]">
          Reset Your Password
        </h1>

        <form onSubmit={handleResetSubmit} className="space-y-6">
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
              placeholder="Enter your email"
            />
          </div>

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
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-blue-600 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || newPassword !== confirmPassword}
              className="w-full bg-green-500 text-white py-3 rounded-md font-semibold shadow-md focus:outline-none hover:bg-green-600 disabled:bg-green-300"
            >
              {isSubmitting ? (
                <span className="flex justify-center">
                  <CircularProgress size={24} />
                </span>
              ) : (
                "Reset Password"
              )}
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
