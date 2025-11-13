import { createContext, useContext, useEffect, useState } from "react";
import { ROUTES } from "../utils/common";
import api from "../api/config";
import moment from "moment";

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  // Restore user instantly from localStorage 
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

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

  // Whenever the first login state is FetchableDevEnvironment, get the pomodoro settings and set it in local storage
  const getPomodoroSettingsAndSetInLocalStorage = async (userId) => {
    if (!userId) return;

    try {
      const response = await api.get(`/api/pomodoro/user/${userId}`);
      const data = {
        enabled: response.data.isEnabled,
        focusMinutes: moment.duration(response.data.focusPeriod).asMinutes(),
        shortBreakMinutes: moment.duration(response.data.breakPeriod).asMinutes(),
      };
      if (data) {
        localStorage.setItem("pomodoroSettings", JSON.stringify(data));
      } else {
        console.error("Failed to fetch pomodoro settings:", data);
      }
    } catch (error) {
      console.error("Error fetching pomodoro settings:", error);
    }
  };

  // Ensure correct redirect after refresh or direct visit
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (parsedUser) {
      setLoggedInUser(parsedUser);
      getPomodoroSettingsAndSetInLocalStorage(parsedUser.id);

      const path = window.location.pathname;
      const isPublicPath = ["/", "/login", "/registration"].includes(path);

      if (isPublicPath) {
        redirectBasedOnRole(parsedUser);
      }
    }
  }, []);

  // Persist user in localStorage 
  const persistUser = (updatedUser, shouldRedirect = false) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    if (updatedUser?.id) {
      localStorage.setItem("userId", updatedUser.id);
    }
    setLoggedInUser(updatedUser);

    // Redirect only when explicitly requested
    if (shouldRedirect) {
      redirectBasedOnRole(updatedUser);
    }
  };

  // Set full user data and redirect 
  const setUserDataInState = (user, shouldRedirect = true) => {
    if (!user) return;
    persistUser(user, shouldRedirect); 
  };

  // Clear user data safely
  const clearUserDataFromState = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setLoggedInUser(null);
    window.location.href = "/";
  };

  // Update specific fields of user and persist 
  const updateUserField = (fields) => {
    if (!loggedInUser) return;
    const updatedUser = { ...loggedInUser, ...fields };
    persistUser(updatedUser, false); 
  };

  // Enroll in a pathway (auto-enroll its courses too)
  const enrollInPathway = (pathwayId) => {
    if (!loggedInUser) return;

    const enrolledPathways = [
      ...(loggedInUser.enrolledPathways || []),
      pathwayId,
    ];

    const enrolledCourses = { ...(loggedInUser.enrolledCourses || {}) };
    const pathwayCourses = pathwayCourseMap[pathwayId] || [];

    pathwayCourses.forEach((courseId, index) => {
      if (!enrolledCourses[courseId]) {
        enrolledCourses[courseId] = {
          status: index === 0 ? "unlocked" : "locked",
        };
      }
    });

    persistUser({
      ...loggedInUser,
      enrolledPathways,
      enrolledCourses,
    });
  };

  // Complete a course → unlock next in pathway
  const completeCourse = (courseId) => {
    if (!loggedInUser) return;

    const enrolledCourses = { ...(loggedInUser.enrolledCourses || {}) };
    if (!enrolledCourses[courseId]) return;

    enrolledCourses[courseId].status = "completed";

    for (const [pathwayId, courses] of Object.entries(pathwayCourseMap)) {
      const index = courses.indexOf(courseId);
      if (index !== -1 && index < courses.length - 1) {
        const nextCourseId = courses[index + 1];
        if (enrolledCourses[nextCourseId]?.status === "locked") {
          enrolledCourses[nextCourseId].status = "unlocked";
        }
      }
    }

    persistUser({ ...loggedInUser, enrolledCourses });
  };

  // Disenroll from a pathway
  const disenrollFromPathway = (pathwayId) => {
    if (!loggedInUser) return;

    const enrolledPathways = (loggedInUser.enrolledPathways || []).filter(
      (id) => id !== pathwayId
    );

    const enrolledCourses = { ...(loggedInUser.enrolledCourses || {}) };
    const pathwayCourses = pathwayCourseMap[pathwayId] || [];

    pathwayCourses.forEach((courseId) => {
      if (enrolledCourses[courseId]?.status !== "completed") {
        delete enrolledCourses[courseId];
      }
    });

    persistUser({
      ...loggedInUser,
      enrolledPathways,
      enrolledCourses,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        isLoggedIn: !!loggedInUser,
        setUserDataInState,
        clearUserDataFromState,
        enrollInPathway,
        completeCourse,
        disenrollFromPathway,
        updateUserField, 
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
