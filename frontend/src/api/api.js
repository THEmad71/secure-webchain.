import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

export default API;