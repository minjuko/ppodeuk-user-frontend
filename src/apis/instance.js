import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseURL) {
  throw new Error("VITE_API_BASE_URL is required");
}

export const instance = axios.create({
  // Railway serverless deployments can take longer than five seconds to wake.
  // Keep the request alive long enough for a cold start while React Query shows
  // an explicit loading state.
  timeout: 30000,
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});
