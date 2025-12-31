import axios from "axios";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://aiagent-e2dsehe7gseabqga.centralindia-01.azurewebsites.net/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 70000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout - please try again");
    }

    if (!error.response) {
      throw new Error("Network error - please check your connection");
    }

    const status = error.response.status;
    const message = error.response.data?.detail || error.message;

    if (status === 400) {
      throw new Error(`Invalid request: ${message}`);
    } else if (status === 500) {
      throw new Error(`Server error: ${message}`);
    } else {
      throw new Error(message || "Something went wrong");
    }
  }
);

/**
 * Send a message to the chatbot API with streaming support
 * @param {string} query - The user's message
 * @param {string} sessionId - Unique session identifier
 * @param {function} onToken - Callback function called for each token received
 * @returns {Promise<void>}
 */
export const sendMessageStreamingAPI = async (query, sessionId, onToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/stream/v1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        query: query,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.slice(6);
          try {
            const data = JSON.parse(dataStr);

            if (data.token) {
              onToken(data.token);
            } else if (data.done) {
              // Stream completed successfully
              return;
            } else if (data.error) {
              throw new Error(data.error);
            }
          } catch (e) {
            // If it's not the error we just threw, it's a JSON parse error
            if (e.message !== data.error) {
              console.error("JSON parse error:", e);
            } else {
              throw e;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Streaming API Error:", error);
    throw error;
  }
};

/**
 * Check if the API is healthy
 * @returns {Promise<boolean>}
 */
export const checkAPIHealth = async () => {
  try {
    const response = await api.get("/health");
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default api;
