import axios from "axios";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
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
 * Send a message to the chatbot API
 * @param {string} query - The user's message
 * @returns {Promise<string>} - The bot's response
 */
export const sendMessageToAPI = async (query) => {
  try {
    const response = await api.post("/chat", { query });

    // Parse the response - handle both string and object responses
    if (typeof response.data === "string") {
      return response.data;
    } else if (response.data.response) {
      return response.data.response;
    } else if (response.data.message) {
      return response.data.message;
    } else {
      // If response is an object, try to stringify it nicely
      return JSON.stringify(response.data, null, 2);
    }
  } catch (error) {
    console.error("API Error:", error);
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
