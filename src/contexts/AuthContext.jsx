import { createContext, useContext, useEffect, useState } from "react";
import { ROUTES } from "../utils/common";

const AuthContext = createContext(null);

// ✅ Global map: pathway → courses
const pathwayCourseMap = {
  101: ["1", "2", "3"], // Web Dev Pathway
  102: ["4", "5", "6"], // Data Analytics Pathway
  103: ["7", "8", "9"], // Business Skills Pathway
};

export const AuthProvider = ({ children }) => {
  // ✅ Restore user instantly from localStorage (prevents undefined on first render)
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

  // ✅ Ensure correct redirect after refresh or direct visit
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (parsedUser) {
      setLoggedInUser(parsedUser);

      const path = window.location.pathname;
      const isPublicPath = ["/", "/login", "/registration"].includes(path);

      if (isPublicPath) {
        redirectBasedOnRole(parsedUser);
      }
    }
  }, []);

  // ✅ Persist user in localStorage (optional redirect)
  const persistUser = (updatedUser, shouldRedirect = false) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    if (updatedUser?.id) {
      localStorage.setItem("userId", updatedUser.id);
    }
    setLoggedInUser(updatedUser);

    // ✅ Redirect only when explicitly requested
    if (shouldRedirect) {
      redirectBasedOnRole(updatedUser);
    }
  };

  // ✅ Set full user data and redirect (used at login)
  const setUserDataInState = (user) => {
    if (!user) return;
    persistUser(user, true); // redirect after login only
  };

  // ✅ Clear user data safely
  const clearUserDataFromState = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setLoggedInUser(null);
    window.location.href = "/";
  };

  // ✅ Update specific fields of user and persist (no redirect)
  const updateUserField = (fields) => {
    if (!loggedInUser) return;
    const updatedUser = { ...loggedInUser, ...fields };
    persistUser(updatedUser, false); // 🚫 no redirect on minor updates
  };

  // ✅ Enroll in a pathway (auto-enroll its courses too)
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

  // ✅ Complete a course → unlock next in pathway
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

  // ✅ Disenroll from a pathway (removes non-completed courses)
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
        updateUserField, // ✅ Now safe, won’t trigger redirects
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
