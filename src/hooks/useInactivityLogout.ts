import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

const useInactivityLogout = (timeoutMs: number = 15 * 60 * 1000) => {
  const dispatch = useDispatch();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      console.log("User inactive. Logging out...");
      dispatch(logout());
      localStorage.removeItem("token");
    }, timeoutMs);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);
};

export default useInactivityLogout;
