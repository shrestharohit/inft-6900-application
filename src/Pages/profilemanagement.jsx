import React, { useState } from 'react';

function ProfileManagement() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    sessionStorage.removeItem("userToken");
    window.location.href = "/";
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const isFormComplete =
    formData.fullName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Edit Profile</h1>
        <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
          {/* Full Name */}
          <div style={styles.formGroup}>
            <label htmlFor="fullName" style={styles.label}>* Full Name</label>
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

          {/* Email */}
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>* Email</label>
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
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>* Password</label>
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

          {/* Confirm Password */}
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>* Confirm Password</label>
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

          {/* Buttons */}
          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isFormComplete}
              style={{
                ...styles.saveButton,
                backgroundColor: isFormComplete ? '#4CAF50' : '#a5d6a7',
                cursor: isFormComplete ? 'pointer' : 'not-allowed',
              }}
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px 20px',
    minHeight: '80vh',
    backgroundColor: '#f4f6f8',
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '40px 30px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
    position: 'relative',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    width: '95%',
    padding: '12px 15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: '0.3s',
    backgroundColor: '#fff',
  },
  passwordWrapper: {
    position: 'relative',
  },
  showPasswordButton: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#4CAF50',
    fontWeight: '600',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '20px',
  },
  saveButton: {
    padding: '14px',
    fontSize: '16px',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    transition: '0.3s',
  },
  logoutButton: {
    padding: '14px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#db4437',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s',
  },
};

export default ProfileManagement;
