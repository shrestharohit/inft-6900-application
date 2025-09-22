import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import registration_image from "../assets/Images/registration_image.png";
import { useAuth } from "../contexts/AuthContext";
import useUserApi from "../hooks/useUserApi";
import beforeAuthLayout from "../components/BeforeAuth";

const Login2FA = () => {
  const location = useLocation();
  const email = location.state?.email || ""; // passed from Registration

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUserDataInState } = useAuth();
  const { verifyOTP, resendOTP } = useUserApi();

  // Countdown for OTP expiry
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle OTP input
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Submit OTP to backend
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await verifyOTP(email, otp);
      setUserDataInState(res.user);
    } catch (error) {
      alert(error.response?.data?.error || "Invalid OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      resendOTP(email);
      setTimer(60);
      alert("A new OTP has been sent to your email.");
    } catch (error) {
      alert(
        error.response?.data?.error || "Failed to resend OTP. Please try again."
      );
    }
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
      {/* Left image */}
      <div style={styles.imageContainer}>
        <img src={registration_image} alt="Registration" style={styles.image} />
      </div>

      {/* OTP Form */}
      <div style={styles.formWrapper}>
        <Typography variant="h5" gutterBottom>
          Check your inbox
        </Typography>
        <Typography variant="body1" paragraph>
          Enter the 6-digit code we sent to <strong>{email}</strong>.
        </Typography>

        <form onSubmit={handleLoginSubmit}>
          <Stack spacing={2} width="100%" maxWidth="400px">
            <TextField
              label="Enter OTP"
              variant="outlined"
              fullWidth
              value={otp}
              onChange={handleOtpChange}
              disabled={isSubmitting}
              inputProps={{ maxLength: 6 }}
            />

            <Typography variant="body2" color="textSecondary">
              OTP expires in {timer}s
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleResendCode}
                disabled={timer > 0 || isSubmitting}
              >
                Resend Code
              </Button>

              <Button
                variant="contained"
                color="success"
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Verify"}
              </Button>
            </Stack>

            <Stack direction="row" justifyContent="center" marginTop={2}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button variant="text" color="secondary">
                  Login to a different account
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
};

export default beforeAuthLayout(Login2FA);
