import React from "react";

const EmptyState = ({ 
  icon = "📭", 
  title = "No items found", 
  message = "There's nothing to display here yet.",
  actionLabel,
  onAction 
}) => {
  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{icon}</div>
      <h3 style={{ color: "#2d3748", marginBottom: "0.5rem" }}>{title}</h3>
      <p style={{ color: "#718096", marginBottom: "1.5rem" }}>{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#4299e1",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

