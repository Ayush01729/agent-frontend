import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
      <div className={`message-avatar ${sender}-avatar`}>
        {sender === "user" ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="8" r="4" fill="white" />
            <path
              d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21H4V20Z"
              fill="white"
            />
          </svg>
        ) : (
          "🤖"
        )}
      </div>
      <div className="message-bubble">
        <div className="message-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
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
              a: ({ node, ...props }) => (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: sender === "user" ? "#fff" : "#007bff",
                    textDecoration: "underline",
                    fontWeight: "500",
                  }}
                  {...props}
                />
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
