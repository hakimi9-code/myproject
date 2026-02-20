import React from "react";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <div className="spinner"></div>
      <p style={{ color: "#666", marginTop: "10px" }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
