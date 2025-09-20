import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCourseOwnerRoute = location.pathname.startsWith("/courseowner");

  return (
    <>
      {!isAdminRoute && !isCourseOwnerRoute && (
        <>
          <footer style={styles.footer}>
            <div style={styles.footerLinks}>
              <Link to="/about" style={styles.footerLink}>
                About
              </Link>
              <Link to="/contact" style={styles.footerLink}>
                Contact Us
              </Link>
              <Link to="/terms" style={styles.footerLink}>
                Terms & Conditions
              </Link>
            </div>
            <div style={styles.footerText}>
              <p>
                &copy; {new Date().getFullYear()} BrainWave. All rights
                reserved.
              </p>
            </div>
          </footer>
        </>
      )}
    </>
  );
};

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    height: "80px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    fontSize: "30px",
    fontWeight: "bold",
  },
  logoImage: {
    width: "200px",
    height: "140px",
    marginRight: "10px",
    cursor: "pointer",
  },
  searchBar: {
    padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    width: "40%",
    margin: "0 auto",
  },
  profileContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  avatar: {
    cursor: "pointer",
    width: "40px",
    height: "40px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
  },
  loginButton: { marginLeft: "20px" },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#db4437",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  navBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    padding: "0px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    padding: "8px 20px",
    margin: "0 10px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "4px",
  },
  footer: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "20px 0",
    textAlign: "center",
    marginTop: "auto",
  },
  footerLinks: { display: "flex", justifyContent: "center", gap: "20px" },
  footerLink: { color: "#fff", textDecoration: "none", fontSize: "16px" },
  footerText: { marginTop: "10px", fontSize: "14px", color: "#ccc" },
};

export default Footer;
