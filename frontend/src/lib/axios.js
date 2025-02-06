import axios from "axios";

// Create an Axios instance with the base URL of your API
// 'withCredentials: true' allows sending cookies with requests, useful for session management
export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",  // Your backend API URL
  withCredentials: true,  // Include cookies in requests (important for auth sessions)
});
