import Header from "./Header";
import Footer from "./Footer";
import { toast } from "react-hot-toast";
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function LayoutWrapper({ PageComponent, ...props }) {
  const location = useLocation();
  const lastPathRef = useRef("");

  useEffect(() => {
    // Wait for the new route to mount completely
    const tryShowReminder = (attempt = 1) => {
      try {
        const onBreak = localStorage.getItem("pomodoroOnBreak") === "true";
        const breakEnd = parseInt(localStorage.getItem("pomodoroBreakEnd"), 10);

        if (
          onBreak &&
          breakEnd &&
          Date.now() < breakEnd &&
          lastPathRef.current !== location.pathname
        ) {
          lastPathRef.current = location.pathname;
          console.log(`💤 [Pomodoro] Showing break reminder (attempt ${attempt}) on:`, location.pathname);

          toast.dismiss();
          toast("💤 Remember, you’re still on break!", {
            id: "break-reminder",
            icon: "☕",
            duration: 4000,
            style: {
              background: "#fff8f0",
              color: "#111827",
              border: "1px solid #facc15",
            },
          });
        } else if (attempt < 5 && onBreak && Date.now() < breakEnd) {
       
          setTimeout(() => tryShowReminder(attempt + 1), 500);
        } else {
          console.log("⏳ [Pomodoro] No reminder (expired or already shown).");
        }
      } catch (err) {
        console.error("☕ [Pomodoro] Break reminder check failed:", err);
      }
    };

    // slight delay before first attempt 
    const initialDelay = setTimeout(() => tryShowReminder(), 400);
    return () => clearTimeout(initialDelay);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/*  Fixed header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Content area with top padding */}
      <main className="flex-1 overflow-auto pt-[100px] px-4 md:px-8">
        <PageComponent {...props} />
      </main>

      <Footer />
    </div>
  );
}

export default function beforeAuthLayout(PageComponent) {
  return function Wrapped(props) {
    return <LayoutWrapper PageComponent={PageComponent} {...props} />;
  };
}
