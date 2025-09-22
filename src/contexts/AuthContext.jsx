import { createContext, useContext, useEffect, useState } from "react";
import { ROUTES } from "../utils/common";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const getTargetRoute = (role) => {
    switch (role) {
      case "admin":
        return ROUTES.ADMIN;
      case "course_owner":
        return ROUTES.COURSE_OWNER;
      default:
        return ROUTES.DEFAULT;
    }
  };

  const redirectBasedOnRole = (user) => {
    if (!user) return;

    const role = String(user.role) || "";
    const target = getTargetRoute(role);

    if (window.location.pathname !== target) {
      window.location.href = target;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || null;
    const parsedUser = JSON.parse(storedUser);

    if (parsedUser) {
      setLoggedInUser(parsedUser);
      redirectBasedOnRole(parsedUser);
    }
  }, []);

  const setUserDataInState = (user) => {
    if (!user) return;
    localStorage.setItem("user", JSON.stringify(user));
    setLoggedInUser(user);
    redirectBasedOnRole(user);
  };

  const clearUserDataFromState = () => {
    localStorage.removeItem("user");
    setLoggedInUser(null);
    window.location.href = ROUTES.DEFAULT;
  };

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        isLoggedIn: !!loggedInUser,
        setUserDataInState,
        clearUserDataFromState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export default AuthContext;
