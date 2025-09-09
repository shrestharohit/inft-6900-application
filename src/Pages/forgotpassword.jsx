import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Stack, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import registration_image from '../assets/Images/registration_image.png'; // Update this with the correct path

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // For controlling the button during submission

    const [showPassword, setShowPassword] = useState(false); // To toggle both new password and confirm password visibility

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'newPassword') setNewPassword(value);
        if (name === 'confirmPassword') setConfirmPassword(value);
    };

    // Handle form submission (simulated)
    const handleResetSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate an API call for resetting the password
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Password has been reset successfully');
        }, 1500);
    };

    // Toggle both password visibility (New and Confirm)
    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
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

            {/* Reset Password Form on the right side */}
            <div style={styles.formWrapper}>
                <Typography variant="h5" gutterBottom>Reset Your Password</Typography>
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
                            onChange={handleChange}
                            disabled={isSubmitting}
                            required
                        />

                        <div style={styles.passwordWrapper}>
                            <TextField
                                label="New Password"
                                variant="outlined"
                                type={showPassword ? 'text' : 'password'} // Toggle password visibility for both fields
                                fullWidth
                                name="newPassword"
                                value={newPassword}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                required
                                style={styles.passwordInput}
                            />
                            <Button
                                type="button"
                                onClick={togglePasswordVisibility}
                                style={styles.toggleButton}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </Button>
                        </div>

                        <div style={styles.passwordWrapper}>
                            <TextField
                                label="Confirm Password"
                                variant="outlined"
                                type={showPassword ? 'text' : 'password'} // Same toggle for Confirm Password
                                fullWidth
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                required
                                style={styles.passwordInput}
                            />
                            <Button
                                type="button"
                                onClick={togglePasswordVisibility}
                                style={styles.toggleButton}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </Button>
                        </div>

                        <Stack direction="row" spacing={2} justifyContent="space-between">
                            <Button
                                variant="contained"
                                color="success" // Green color for the reset button
                                type="submit"
                                disabled={isSubmitting || newPassword !== confirmPassword} // Disable if passwords do not match
                            >
                                {isSubmitting ? <CircularProgress size={24} /> : 'Reset Password'}
                            </Button>
                        </Stack>

                        <Stack direction="row" justifyContent="center" marginTop={2}>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
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
    passwordWrapper: {
        position: 'relative',
    },
    passwordInput: {
        marginBottom: '10px',
    },
    toggleButton: {
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        color: '#4CAF50',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default ForgotPassword;  // Updated export to match the component name
