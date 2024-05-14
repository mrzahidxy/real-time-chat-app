import axios from "axios";

const BASE_URL = "http://social-media-api-zahid.vercel.app:8080/api";
const user = JSON.parse(localStorage.getItem("currentUser"));
const TOKEN = user?.accessToken;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const privateRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    token: `Bearer ${TOKEN}`,
  },
});
