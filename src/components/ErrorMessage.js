
import React from "react";

const ErrorMessage = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
      <p style={{ color: "#e53e3e", marginBottom: "1rem" }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "0.5rem 1.5rem",
            backgroundColor: "#4299e1",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

