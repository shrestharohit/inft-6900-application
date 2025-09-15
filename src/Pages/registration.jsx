import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/user'; 
import registration_image from '../assets/Images/registration_image.png';

function RegistrationForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAgreed: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        if (!formData.termsAgreed) {
            setError('You must agree to the terms and conditions.');
            return;
        }

        try {
            setLoading(true);
            const response = await registerUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: 'student', // ✅ backend expects this
            });

            console.log("✅ Registration API response:", response);
            setSuccess(response.message || 'Registration successful! Redirecting...');


            // Redirect to 2FA page with email in state
            if (response.requiresVerification) {
                // new student must verify email first
                navigate('/login2fa', { state: { email: formData.email } });
            } else {
                // admin or instructor -> go straight to login
                navigate('/login');
            }

        } catch (err) {
            console.error("❌ Registration error:", err);
            if (err?.response?.data) {
                setError(`Server error: ${JSON.stringify(err.response.data)}`);
            } else {
                setError(err?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="registration-form-container" style={styles.formContainer}>
            <div style={styles.imageContainer}>
                <img src={registration_image} alt="Registration" style={styles.image} />
            </div>
            <div style={styles.formWrapper}>
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* First Name */}
                    <div className="form-group" style={styles.formGroup}>
                        <label htmlFor="firstName" style={styles.label}>First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    {/* Last Name */}
                    <div className="form-group" style={styles.formGroup}>
                        <label htmlFor="lastName" style={styles.label}>Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group" style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group" style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.showPasswordButton}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group" style={styles.formGroup}>
                        <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.showPasswordButton}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="form-group" style={styles.checkboxContainer}>
                        <label>
                            <input
                                type="checkbox"
                                name="termsAgreed"
                                checked={formData.termsAgreed}
                                onChange={handleChange}
                                required
                                style={styles.checkbox}
                            />
                            I agree to the <span onClick={() => setShowTerms(!showTerms)} style={styles.termsLink}>terms and conditions</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" style={styles.submitButton} disabled={loading}>
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>

                    {/* Google Login (placeholder) */}
                    <button type="button" onClick={() => console.log('Google Login')} style={styles.googleButton}>
                        Continue with Google
                    </button>

                    {/* Messages */}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}

                    <p style={styles.alreadyAccountText}>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>

            {/* Terms Modal */}
            {showTerms && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2>Terms and Conditions</h2>
                        <p>
                            These are the sample terms and conditions. Please read them carefully.
                            By using this site, you agree to these terms.
                        </p>
                        <button onClick={() => setShowTerms(false)} style={styles.closeModalButton}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}



const styles = {
    formContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        maxWidth: '1000px',
        margin: '50px auto',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    imageContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '30px',
    },
    image: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
    },
    formWrapper: {
        flex: 1,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        padding: '10px',
        marginBottom: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        width: '95%',
    },
    passwordWrapper: {
        position: 'relative',
    },
    showPasswordButton: {
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-70%)',
        background: 'none',
        border: 'none',
        color: '#4CAF50',
        cursor: 'pointer',
        fontSize: '14px',
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    checkbox: {
        marginRight: '10px',
    },
    termsLink: {
        color: '#007BFF',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
    submitButton: {
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    googleButton: {
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#db4437',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    alreadyAccountText: {
        textAlign: 'center',
        fontSize: '14px',
        marginTop: '20px',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '100%',
    },
    closeModalButton: {
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
    },
};

export default RegistrationForm;
