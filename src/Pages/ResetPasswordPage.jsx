import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as Yup from "yup";
import registration_image from "../assets/Images/registration_image.png";
import beforeAuthLayout from "../components/BeforeAuth";
import useUserApi from "../hooks/useUserApi";

// ✅ Define Yup validation schema (same as registration)
const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one special character")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your new password"),
});

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const { resetPassword } = useUserApi();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setGeneralError("");
    setIsSubmitting(true);

    try {
      // ✅ Run Yup validation
      await resetPasswordSchema.validate(formData, { abortEarly: false });

      await resetPassword({
        email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      alert("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => (validationErrors[e.path] = e.message));
        setError(validationErrors);
      } else {
        console.error("❌ Reset password error:", err);
        setGeneralError(
          err?.response?.data?.error ||
          err?.message ||
          "Failed to reset password."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Red border helper
  const inputClass = (field) =>
    `w-full border rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 ${error[field] ? "border-red-500 focus:ring-red-500" : "border-gray-300"
    }`;

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

      {/* Right Form */}
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
              value={formData.newPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              className={inputClass("newPassword")}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-blue-600 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {error.newPassword && (
              <p className="text-red-600 text-sm mt-1">{error.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block font-semibold mb-1">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              className={inputClass("confirmPassword")}
              placeholder="Confirm your new password"
            />
            {error.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {error.confirmPassword}
              </p>
            )}
          </div>

          {/* General Error */}
          {generalError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {generalError}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
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
