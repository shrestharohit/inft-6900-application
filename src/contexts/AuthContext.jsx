import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUserId =
      localStorage.getItem("userID") || sessionStorage.getItem("userID");
    if (storedUserId) {
      setLoggedInUser({ id: storedUserId });
    }
  }, []);

  const setUserID = ({ id, remember = false }) => {
    if (remember) {
      localStorage.setItem("userID", id);
    } else {
      sessionStorage.setItem("userID", id);
    }
    setLoggedInUser({ id });
  };

  const clearUserID = () => {
    localStorage.removeItem("userID");
    sessionStorage.removeItem("userID");
    setLoggedInUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        isLoggedIn: !!loggedInUser,
        setUserID,
        clearUserID,
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
