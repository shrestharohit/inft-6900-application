import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/user'; // ✅ must exist
import registration_image from '../assets/Images/registration_image.png';

function LoginForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await loginUser(formData);
            console.log("✅ Login API response:", response);

            // Always go straight to dashboard (skip 2FA at login)
            navigate('/dashboard');
        } catch (err) {
            console.error("❌ Login error:", err);
            if (err?.error) {
                setError(err.error);
            } else if (err?.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError(err?.message || 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-form-container" style={styles.formContainer}>
            <div style={styles.imageContainer}>
                <img src={registration_image} alt="Registration" style={styles.image} />
            </div>

            <div style={styles.formWrapper}>
                <h1>Login</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
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
                        <Link to="/forgotpassword" style={styles.forgotPasswordLink}>
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" style={styles.submitButton} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div style={styles.googleButtonContainer}>
                        <button
                            type="button"
                            onClick={() => console.log('Google Login')}
                            style={styles.googleButton}
                        >
                            Continue with Google
                        </button>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <p style={styles.noAccountText}>
                        Don't have an account? <Link to="/registration">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

const styles = {
    formContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
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
        padding: '20px',
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
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        color: '#4CAF50',
        cursor: 'pointer',
        fontSize: '14px',
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
    googleButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
        marginBottom: '20px',
    },
    googleButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#db4437',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    forgotPasswordLink: {
        fontSize: '14px',
        color: '#007BFF',
        textDecoration: 'underline',
        cursor: 'pointer',
        marginTop: '5px',
    },
    noAccountText: {
        textAlign: 'center',
        fontSize: '14px',
        marginTop: '20px',
    },
};

export default LoginForm;
