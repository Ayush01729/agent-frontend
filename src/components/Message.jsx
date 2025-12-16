import React from "react";
import ReactMarkdown from "react-markdown";
import "../styles/Message.css";

const Message = ({ message }) => {
  const { text, sender, timestamp, isError } = message;

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Parse text with line breaks and formatting
  const formatText = (text) => {
    // Handle numbered lists
    if (text.includes("\n")) {
      return text;
    }
    return text;
  };

  return (
    <div className={`message ${sender} ${isError ? "error" : ""}`}>
      <div className="message-avatar">{sender === "user" ? "👤" : "🤖"}</div>
      <div className="message-bubble">
        <div className="message-content">
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => <p style={{ margin: 0 }} {...props} />,
              ul: ({ node, ...props }) => (
                <ul
                  style={{ marginLeft: "20px", marginTop: "8px" }}
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  style={{ marginLeft: "20px", marginTop: "8px" }}
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li style={{ marginBottom: "4px" }} {...props} />
              ),
            }}
          >
            {formatText(text)}
          </ReactMarkdown>
        </div>
        <div className="message-time">{formatTime(timestamp)}</div>
      </div>
    </div>
  );
};

export default Message;
