// src/Pages/registration.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/user";
import registration_image from "../assets/Images/registration_image.png";
import beforeAuthLayout from "../components/BeforeAuth";
import { useFormik } from "formik";
import * as Yup from "yup";

function RegistrationForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ✅ Yup Validation Schema
    const validationSchema = Yup.object({
        firstName: Yup.string()
            .min(2, "First name must have at least 2 characters")
            .max(30, "First name too long")
            .required("First name is required"),
        lastName: Yup.string()
            .min(2, "Last name must have at least 2 characters")
            .max(30, "Last name too long")
            .required("Last name is required"),
        email: Yup.string()
            .matches(
                /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/,
                "Please enter a valid email address"
            )
            .required("Email is required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Must contain at least one uppercase letter")
            .matches(/[a-z]/, "Must contain at least one lowercase letter")
            .matches(/[0-9]/, "Must contain at least one number")
            .matches(/[@$!%*?&]/, "Must contain at least one special character")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Please confirm your password"),
        termsAgreed: Yup.boolean()
            .oneOf([true], "You must agree to the terms and conditions")
            .required(),
    });

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            termsAgreed: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            setError("");
            setSuccess("");
            const registrationData = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                role: "student",
            };

            try {
                setLoading(true);
                const response = await registerUser(registrationData);
                setSuccess(response.message || "Registration successful! Redirecting...");
                if (response.requiresVerification) {
                    navigate("/login2fa", { state: { email: values.email } });
                } else {
                    navigate("/login");
                }
            } catch (err) {
                console.error("❌ Registration error:", err);
                setError(
                    err?.response?.data?.message ||
                    "Registration failed. Please try again."
                );
            } finally {
                setLoading(false);
            }
        },
    });

    const inputClass = (field) =>
        `w-full border rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 ${formik.touched[field] && formik.errors[field]
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300"
        }`;


    // ✅ Password strength helper
    const passwordValidations = [
        {
            label: "At least 8 characters",
            test: (v) => v.length >= 8,
        },
        {
            label: "Contains an uppercase letter",
            test: (v) => /[A-Z]/.test(v),
        },
        {
            label: "Contains a lowercase letter",
            test: (v) => /[a-z]/.test(v),
        },
        {
            label: "Contains a number",
            test: (v) => /[0-9]/.test(v),
        },
        {
            label: "Contains a special character (@, $, !, %, *, ?, &)",
            test: (v) => /[@$!%*?&]/.test(v),
        },
    ];

    return (
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg max-w-6xl w-full mx-auto my-16 p-10 relative">
            {/* Left Image */}
            <div className="flex-1 flex justify-center items-center mb-6 md:mb-0 md:mr-10">
                <img
                    src={registration_image}
                    alt="Registration Illustration"
                    className="w-full max-w-md rounded-lg"
                />
            </div>

            {/* Right Form */}
            <div className="flex-1">
                <h1 className="text-4xl font-bold mb-8 text-center md:text-left text-[#1f2a60]">
                    Sign Up
                </h1>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* First Name */}
                    <div>
                        <label className="block font-semibold mb-1">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={inputClass("firstName")}
                            placeholder="Enter your first name"
                        />
                        {formik.touched.firstName && formik.errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">
                                {formik.errors.firstName}
                            </p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block font-semibold mb-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={inputClass("lastName")}
                            placeholder="Enter your last name"
                        />
                        {formik.touched.lastName && formik.errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">
                                {formik.errors.lastName}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={inputClass("email")}
                            placeholder="Enter your email"
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {formik.errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block font-semibold mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={inputClass("password")}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-blue-600 text-sm"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {/* ✅ Password strength guide */}
                        <div className="bg-gray-50 p-2 rounded-md mt-2 text-xs space-y-1">
                            {passwordValidations.map((rule, i) => (
                                <p
                                    key={i}
                                    className={
                                        rule.test(formik.values.password)
                                            ? "text-green-600"
                                            : "text-gray-500"
                                    }
                                >
                                    • {rule.label}
                                </p>
                            ))}
                        </div>

                        {/* Error */}
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {formik.errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block font-semibold mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={inputClass("confirmPassword")}
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-blue-600 text-sm"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {/* ✅ Live match indicator */}
                        {formik.values.confirmPassword &&
                            formik.values.confirmPassword === formik.values.password && (
                                <p className="text-green-600 text-xs mt-1">
                                    ✅ Passwords match
                                </p>
                            )}

                        {formik.touched.confirmPassword &&
                            formik.errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.confirmPassword}
                                </p>
                            )}
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="termsAgreed"
                            checked={formik.values.termsAgreed}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`mr-2 ${formik.touched.termsAgreed && formik.errors.termsAgreed
                                    ? "accent-red-500"
                                    : "accent-blue-500"
                                }`}
                        />
                        <label className="text-gray-700">
                            I agree to the{" "}
                            <Link
                                to="/terms"
                                className="text-blue-600 underline"
                                target="_blank"
                            >
                                Terms and Conditions
                            </Link>

                        </label>
                    </div>
                    {formik.touched.termsAgreed && formik.errors.termsAgreed && (
                        <p className="text-red-500 text-sm mt-1">
                            {formik.errors.termsAgreed}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-md transition"
                    >
                        {loading ? "Registering..." : "Create Account"}
                    </button>

                    {/* Messages */}
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
                            {success}
                        </div>
                    )}

                    <p className="text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>

            {/* 🧾 Terms Modal */}
        </div>
    );
}

export default beforeAuthLayout(RegistrationForm);
