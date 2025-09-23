import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import beforeAuthLayout from "../components/BeforeAuth";
import { useAuth } from "../contexts/AuthContext";
import useUserApi from "../hooks/useUserApi";

function ProfileManagement({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const { loggedInUser, setUserDataInState } = useAuth();
  const { updateUser } = useUserApi();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Load current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setFormData({
          firstName: loggedInUser.firstName || "",
          lastName: loggedInUser.lastName || "",
          email: loggedInUser.email || "",
          password: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [loggedInUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (loggedInUser === null) {
      alert("User not logged in");
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...(formData.password ? { password: formData.password } : {}),
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

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    sessionStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Edit Profile</h1>
        <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
          {/* First Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>* First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Last Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>* Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              style={{ ...styles.input, backgroundColor: "#f5f5f5" }}
            />
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>New Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={styles.showPasswordButton}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Buttons */}
          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              style={{
                ...styles.saveButton,
                backgroundColor: !loading ? "#4CAF50" : "#a5d6a7",
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "50px 20px",
    minHeight: "80vh",
    backgroundColor: "#f4f6f8",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "40px 30px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "20px",
    position: "relative",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    width: "95%",
    padding: "12px 15px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "0.3s",
    backgroundColor: "#fff",
  },
  passwordWrapper: {
    position: "relative",
  },
  showPasswordButton: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#4CAF50",
    fontWeight: "600",
    cursor: "pointer",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px",
  },
  saveButton: {
    padding: "14px",
    fontSize: "16px",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    transition: "0.3s",
  },
  logoutButton: {
    padding: "14px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#db4437",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default beforeAuthLayout(ProfileManagement);
