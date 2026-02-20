import React, { useEffect, useState } from "react";

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success": return "✓";
      case "error": return "✕";
      case "warning": return "⚠";
      default: return "ℹ";
    }
  };

  return (
    <div className={`toast ${type}`} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(20px)", transition: "all 0.3s ease" }}>
      <span style={{ marginRight: "10px" }}>{getIcon()}</span>
      <span>{message}</span>
      <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} style={{ marginLeft: "15px", background: "none", border: "none", color: "white", cursor: "pointer" }}>✕</button>
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  return { toasts, showToast, removeToast };
};

export default Toast;

