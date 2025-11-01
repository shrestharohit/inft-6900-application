import { useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import registration_image from "../assets/Images/registration_image.png";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";
import useUserApi from "../hooks/useUserApi";

// ✅ Simplified Yup schema (only ensures fields are filled and valid email)
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function LoginForm() {
  const { setUserDataInState } = useAuth();
  const { loginUser } = useUserApi();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setGeneralError("");

    try {
      // ✅ Validate only required fields
      await loginSchema.validate(formData, { abortEarly: false });

      setLoading(true);
      const response = await loginUser(formData);
      setUserDataInState(response.user);
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => (validationErrors[e.path] = e.message));
        setError(validationErrors);
      } else {
        setGeneralError(
          err?.response?.data?.error ||
          err?.error ||
          err?.message ||
          "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 ${error[field]
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300"
    }`;

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg max-w-6xl w-full mx-auto my-16 p-10">
      {/* Left Image */}
      <div className="flex-1 flex justify-center items-center mb-6 md:mb-0 md:mr-10">
        <img
          src={registration_image}
          alt="Login Illustration"
          className="w-full max-w-md rounded-lg"
        />
      </div>

      {/* Right Form */}
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-8 text-center md:text-left text-[#1f2a60]">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass("email")}
              placeholder="Enter your email"
            />
            {error.email && (
              <p className="text-red-600 text-sm mt-1">{error.email}</p>
            )}
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
            {error.password && (
              <p className="text-red-600 text-sm mt-1">{error.password}</p>
            )}
            <Link
              to="/forgotpassword"
              className="block mt-2 text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* General Error */}
          {generalError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {generalError}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-md transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm">
            Don’t have an account?{" "}
            <Link to="/registration" className="text-blue-600 underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default beforeAuthLayout(LoginForm);
