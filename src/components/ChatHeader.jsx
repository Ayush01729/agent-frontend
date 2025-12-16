import React from "react";
import "../styles/ChatHeader.css";

const ChatHeader = () => {
  return (
    <header className="chat-header">
      <div className="header-content">
        <div className="logo">🛍️</div>
        <div className="header-text">
          <h1>Lulu Mall Assistant</h1>
          <p>Your personal shopping guide</p>
        </div>
        <div className="status-indicator" title="Online">
          <span className="status-dot"></span>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
