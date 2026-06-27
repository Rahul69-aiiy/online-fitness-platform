import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true, // for cookie auth
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "An unexpected error occurred";
    const customError = new Error(message);
    customError.response = error.response;
    customError.status = error.response?.status;
    throw customError;
  }
);

export default api;
