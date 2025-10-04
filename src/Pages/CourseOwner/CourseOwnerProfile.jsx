import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext"; // adjust path if needed
import useUserApi from "../../hooks/useUserApi";     // adjust path if needed

export default function CourseOwnerProfile() {
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

    useEffect(() => {
        if (loggedInUser) {
            setFormData((prev) => ({
                ...prev,
                firstName: loggedInUser.firstName || "",
                lastName: loggedInUser.lastName || "",
                email: loggedInUser.email || "",
            }));
        }
    }, [loggedInUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (formData.newPassword) {
            if (formData.currentPassword !== loggedInUser?.password) {
                alert("Current password is incorrect!");
                return;
            }
            if (formData.currentPassword === formData.newPassword) {
                alert("New password cannot be the same as the current password.");
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                alert("New password and confirmation do not match.");
                return;
            }
        }

        try {
            setLoading(true);
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                ...(formData.newPassword ? { password: formData.newPassword } : {}),
            };

            const response = await updateUser(loggedInUser.id, updateData);
            setUserDataInState(response);
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="max-w-2xl bg-white rounded-lg shadow-md p-8 mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 pr-12"
                    />
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 pr-12"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 text-sm font-semibold"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Save Button */}
                <div className="flex flex-col gap-4">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading}
                        className={`w-full py-3 text-white font-semibold rounded-md transition ${loading
                                ? "bg-green-300"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
