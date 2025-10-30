import Header from "./Header";
import Footer from "./Footer";
import { Toaster, toast } from "react-hot-toast";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function beforeAuthLayout(PageComponent) {
  const Wrapped = (props) => {
    const location = useLocation();

    // 🌍 Global Pomodoro Break Reminder (delayed + stable)
    useEffect(() => {
      // Short delay so route and context settle first
      const timer = setTimeout(() => {
        try {
          const settings = JSON.parse(localStorage.getItem("pomodoroSettings"));
          const focusEnded =
            localStorage.getItem("pomodoroFocusEnded") === "true";

          console.log("🕒 [Pomodoro] Navigation detected:", location.pathname);
          console.log("🕒 [Pomodoro] Settings:", settings);
          console.log("🕒 [Pomodoro] Focus ended flag:", focusEnded);

          if (settings?.enabled && focusEnded) {
            toast("☕ Take a short break before continuing!", {
              icon: "🕒",
              style: {
                background: "#f9fafb",
                color: "#111827",
                border: "1px solid #d1d5db",
              },
            });

            localStorage.removeItem("pomodoroFocusEnded");
            console.log("🕒 [Pomodoro] Toast shown and flag cleared.");
          }
        } catch (err) {
          console.error("[Pomodoro] Error reading settings:", err);
        }
      }, 400); // 400 ms delay avoids race with auth/enrollment checks

      return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* 🔔 Toast notifications (shared globally) */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* ✅ Fixed header */}
        <div className="fixed top-0 left-0 w-full z-50">
          <Header />
        </div>

        {/* ✅ Content area with top padding to avoid overlap */}
        <main className="flex-1 overflow-auto pt-[100px] px-4 md:px-8">
          <PageComponent {...props} />
        </main>

        <Footer />
      </div>
    );
  };

  return Wrapped;
}
