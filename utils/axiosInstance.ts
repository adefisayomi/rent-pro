import { NEXT_PUBLIC_BASE_URL } from "@/constants";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_BASE_URL, // ✅ Set base URL
  withCredentials: true, // ✅ Ensures cookies are sent with requests
});

export default axiosInstance;
