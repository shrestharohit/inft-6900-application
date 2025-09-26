import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/user";
import registration_image from "../assets/Images/registration_image.png";
import beforeAuthLayout from "../components/BeforeAuth";

function RegistrationForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAgreed: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        // Check if terms are agreed
        if (!formData.termsAgreed) {
            setError("You must agree to the terms and conditions.");
            return;
        }

        // Prepare request data
        const registrationData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: "student", // backend expects this
        };

        try {
            setLoading(true); // Set loading state to true

            // Log the request data being sent for debugging
            console.log("Sending registration request with data:", registrationData);

            const response = await registerUser(registrationData);

            // Log the API response
            console.log("✅ Registration API response:", response);

            // Set success message
            setSuccess(response.message || "Registration successful! Redirecting...");

            // Redirect to the appropriate page based on response
            if (response.requiresVerification) {
                // If email verification is required, navigate to 2FA page
                navigate("/login2fa", { state: { email: formData.email } });
            } else {
                // If no verification needed, navigate to login page
                navigate("/login");
            }
        } catch (err) {
            // Handle API or network error
            console.error("❌ Registration error:", err);

            // Handle server error response if available
            if (err?.response?.data) {
                setError(`Server error: ${JSON.stringify(err.response.data)}`);
            } else {
                // Handle generic error
                setError(err?.message || "Registration failed. Please try again.");
            }
        } finally {
            // Ensure loading state is reset
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg max-w-6xl w-full mx-auto my-16 p-10">
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* First Name */}
                    <div>
                        <label className="block font-semibold mb-1">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your first name"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block font-semibold mb-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your last name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block font-semibold mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500"
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
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block font-semibold mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500"
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
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="termsAgreed"
                            checked={formData.termsAgreed}
                            onChange={handleChange}
                            required
                            className="mr-2"
                        />
                        <label className="text-gray-700">
                            I agree to the{" "}
                            <span
                                onClick={() => setShowTerms(!showTerms)}
                                className="text-blue-600 cursor-pointer underline"
                            >
                                terms and conditions
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
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
        </div>
    );
}

export default beforeAuthLayout(RegistrationForm);
