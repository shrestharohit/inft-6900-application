import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="row"
      minHeight="100vh"
      padding={2}
    >
      {/* Left-side image */}
      <div style={styles.imageContainer}>
        <img src={registration_image} alt="Registration" style={styles.image} />
      </div>

      {/* Reset form */}
      <div style={styles.formWrapper}>
        <Typography variant="h5" gutterBottom>
          Reset Your Password
        </Typography>
        <Typography variant="body1" paragraph>
          Please enter your email, new password, and confirm your new password.
        </Typography>

        <form onSubmit={handleResetSubmit}>
          <Stack spacing={2} width="100%" maxWidth="400px">
            <TextField
              label="Enter Email"
              variant="outlined"
              fullWidth
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />

            <div style={styles.passwordWrapper}>
              <TextField
                label="New Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                fullWidth
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                required
                style={styles.passwordInput}
              />
              <Button
                type="button"
                onClick={togglePasswordVisibility}
                style={styles.toggleButton}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>

            <div style={styles.passwordWrapper}>
              <TextField
                label="Confirm Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                fullWidth
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                required
                style={styles.passwordInput}
              />
              <Button
                type="button"
                onClick={togglePasswordVisibility}
                style={styles.toggleButton}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>

            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button
                variant="contained"
                color="success"
                type="submit"
                disabled={isSubmitting || newPassword !== confirmPassword}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </Stack>

            <Stack direction="row" justifyContent="center" marginTop={2}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button variant="text" color="secondary">
                  Back to Login
                </Button>
              </Link>
            </Stack>
          </Stack>
        </form>
      </div>
    </Box>
  );
};

const styles = {
  imageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "30px",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "8px",
  },
  formWrapper: {
    flex: 1,
    padding: "20px",
  },
  passwordWrapper: {
    position: "relative",
  },
  passwordInput: {
    marginBottom: "10px",
  },
  toggleButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#4CAF50",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default beforeAuthLayout(ForgotPassword);
