import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Importing images
import registration_image from '../assets/Images/registration_image.png'; // Registration image

function RegistrationForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAgreed: false,
    });

    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
    const [showTerms, setShowTerms] = useState(false); // State for showing Terms Modal

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle the state
    };

    const toggleTermsModal = () => {
        setShowTerms(!showTerms); // Toggle modal visibility
    };

    return (
        <div className="registration-form-container" style={styles.formContainer}>
            <div style={styles.imageContainer}>
                <img
                    src={registration_image}
                    alt="Registration"
                    style={styles.image}
                />
            </div>
            <div style={styles.formWrapper}>
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div className="form-group" style={styles.formGroup}>
                        <label htmlFor="fullName" style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
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
                                onClick={togglePasswordVisibility}
                                style={styles.showPasswordButton}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
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
                                onClick={togglePasswordVisibility}
                                style={styles.showPasswordButton}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
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
                            I agree to the <span onClick={toggleTermsModal} style={styles.termsLink}>terms and conditions</span>
                        </label>
                    </div>
                    <button type="submit" style={styles.submitButton}>Create Account</button>
                    <button type="button" onClick={() => console.log('Google Login')} style={styles.googleButton}>
                        Continue with Google
                       
                    </button>
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
                        <button onClick={toggleTermsModal} style={styles.closeModalButton}>
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
