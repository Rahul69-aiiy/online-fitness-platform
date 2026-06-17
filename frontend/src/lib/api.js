import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_CLIENT_URL,
  withCredentials: true, // for cookie auth later
});

export default api;