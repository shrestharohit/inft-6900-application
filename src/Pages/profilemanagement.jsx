import React, { useState } from "react";
import { Box, Button, TextField, Stack, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // For navigation

const ProfileManagement = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState("");

    const navigate = useNavigate(); // Hook for navigation after logout

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "fullName") setFullName(value);
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "confirmPassword") setConfirmPassword(value);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setIsSubmitting(true);
        setNotification("");

        // Simulate form submission (you can connect with API/backend later)
        setTimeout(() => {
            setIsSubmitting(false);
            setNotification("Your profile has been updated successfully. A confirmation email has been sent.");
            // Simulate sending email notification
            console.log("Email notification sent to", email);
        }, 2000);
    };

    // Handle Logout
    const handleLogout = () => {
        // Clear user session data (localStorage/sessionStorage)
        localStorage.removeItem('userToken');
        sessionStorage.removeItem('userToken');

        // Redirect to homepage
        navigate('/'); // This will take the user back to the homepage
    };

    return (
        <Box sx={styles.container}>
            <Typography variant="h4" gutterBottom>
                Edit Profile
            </Typography>

            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        label="Full Name"
                        name="fullName"
                        value={fullName}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        required
                    />
                    <TextField
                        label="New Password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        required
                    />

                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isSubmitting || !fullName || !email || !password || !confirmPassword || password !== confirmPassword}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : "Update Profile"}
                        </Button>
                    </Stack>

                    {notification && (
                        <Typography variant="body1" color="success.main" style={{ marginTop: "20px" }}>
                            {notification}
                        </Typography>
                    )}
                </Stack>
            </form>

            {/* Logout Button */}
            <Button variant="contained" color="error" onClick={handleLogout} style={{ marginTop: "20px" }}>
                Logout
            </Button>
        </Box>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "30px ",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
};

export default ProfileManagement;
