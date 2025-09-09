import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Stack, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import registration_image from '../assets/Images/registration_image.png'; // Update this with the correct path

const Login2FA = () => {
    // State for managing OTP input and Timer
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60); // 60 seconds for OTP expiry
    const [isSubmitting, setIsSubmitting] = useState(false); // For controlling the button during submission

    // Start countdown when the OTP is sent
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);

            return () => clearInterval(interval); // Clean up interval on unmount
        }
    }, [timer]);

    // Handle OTP input change
    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    // Handle OTP submission (simulated)
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate an API call or validation
        setTimeout(() => {
            setIsSubmitting(false);
            alert('OTP submitted');
        }, 1500);
    };

    // Resend OTP functionality
    const handleResendCode = () => {
        setTimer(60); // Reset timer to 60 seconds
        alert('OTP resent');
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="row"  // Align image and form side by side
            minHeight="100vh"
            padding={2}
        >
            {/* Image on the left side */}
            <div style={styles.imageContainer}>
                <img
                    src={registration_image}
                    alt="Registration"
                    style={styles.image}
                />
            </div>

            {/* OTP Form on the right side */}
            <div style={styles.formWrapper}>
                <Typography variant="h5" gutterBottom>Check your inbox</Typography>
                <Typography variant="body1" paragraph>
                    Enter the 6-digit code we sent you on your email.
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
                            inputProps={{ maxLength: 6 }} // OTP length is 6 digits
                        />

                        <Typography variant="body2" color="textSecondary">
                            OTP expires in {timer}s
                        </Typography>

                        <Stack direction="row" spacing={2} justifyContent="space-between">
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleResendCode}
                                disabled={timer > 0 || isSubmitting} // Disable if timer > 0 or submitting
                            >
                                Resend Code
                            </Button>

                            <Button
                                variant="contained"
                                color="success"  // Green color for the login button
                                type="submit"
                                disabled={isSubmitting || otp.length !== 6} // Disable submit if OTP is not 6 digits
                            >
                                {isSubmitting ? <CircularProgress size={24} /> : 'Login'}
                            </Button>
                        </Stack>

                        <Stack direction="row" justifyContent="center" marginTop={2}>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '30px', // Space between image and form
    },
    image: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
    },
    formWrapper: {
        flex: 1,
        padding: '20px',
    },
};

export default Login2FA;
