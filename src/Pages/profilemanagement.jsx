import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";
import useUserApi from "../hooks/useUserApi";

// ✅ Define Yup validation schema
const profileSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name too long")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name too long")
    .required("Last name is required"),
  currentPassword: Yup.string().when("newPassword", {
    is: (val) => val && val.length > 0,
    then: (schema) =>
      schema.required("Current password is required to change your password"),
  }),
  newPassword: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one special character")
    .notOneOf(
      [Yup.ref("currentPassword")],
      "New password cannot be the same as the current password"
    ),
  confirmPassword: Yup.string().when("newPassword", {
    is: (val) => val && val.length > 0,
    then: (schema) =>
      schema
        .required("Please confirm your new password")
        .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  }),
});

function ProfileManagement({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const { loggedInUser, setUserDataInState } = useAuth();
  const { updateUser } = useUserApi();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (loggedInUser) {
      setFormData({
        firstName: loggedInUser.firstName || "",
        lastName: loggedInUser.lastName || "",
        email: loggedInUser.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [loggedInUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setErrors({});
    setSuccessMsg("");

    try {
      // ✅ Validate form data with Yup
      await profileSchema.validate(formData, { abortEarly: false });

      setLoading(true);
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...(formData.newPassword ? { password: formData.newPassword } : {}),
      };

      const response = await updateUser(loggedInUser.id, updateData);
      setUserDataInState(response);
      setSuccessMsg("Profile updated successfully!");

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => (validationErrors[e.path] = e.message));
        setErrors(validationErrors);
      } else {
        setErrors({ general: "Failed to update profile. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors[field] ? "border-red-500 focus:ring-red-500" : "border-gray-300"
    }`;

  return (
    <div className="flex justify-center items-center p-6 min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-lg p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Profile
        </h1>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* First Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              * First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClass("firstName")}
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              * Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClass("lastName")}
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-md"
            />
          </div>

          {/* Current Password */}
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold text-gray-700">
              Current Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={inputClass("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold text-gray-700">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={inputClass("newPassword")}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 text-sm font-semibold"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.newPassword && (
              <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700">
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputClass("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* General / Success Messages */}
          {errors.general && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg mb-4">
              {errors.general}
            </div>
          )}
          {successMsg && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg mb-4">
              {successMsg}
            </div>
          )}

          {/* Save Button */}
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className={`w-full py-3 text-white font-semibold rounded-md transition ${loading ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
                }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default beforeAuthLayout(ProfileManagement);
