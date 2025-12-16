import React from "react";
import "../styles/TypingIndicator.css";

const TypingIndicator = () => {
  return (
    <div className="message bot">
      <div className="message-avatar">🤖</div>
      <div className="typing-indicator">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
