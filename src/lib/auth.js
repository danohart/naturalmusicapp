// lib/auth.js
import axios from "axios";
import Cookies from "js-cookie";

const WORDPRESS_API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_URL + "/wp-json"
    : process.env.NEXT_PUBLIC_DEV_URL + "/wp-json";
const AUTH_COOKIE_NAME = "wp_auth_token";
const USER_COOKIE_NAME = "wp_user_info";

// Initialize axios instance for WordPress API
const wpApi = axios.create({
  baseURL: WORDPRESS_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
wpApi.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get auth token from cookies
export function getAuthToken() {
  return typeof window !== "undefined" ? Cookies.get(AUTH_COOKIE_NAME) : null;
}

// Get user info from cookies
export function getUserInfo() {
  const userInfoStr =
    typeof window !== "undefined" ? Cookies.get(USER_COOKIE_NAME) : null;
  return userInfoStr ? JSON.parse(userInfoStr) : null;
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getAuthToken();
}

// Login user
export async function loginUser(username, password) {
  try {
    const response = await axios.post(
      `${WORDPRESS_API_URL}/jwt-auth/v1/token`,
      {
        username,
        password,
      }
    );

    const { token, user_email, user_nicename, user_display_name } =
      response.data;

    // Store token and user info in cookies
    Cookies.set(AUTH_COOKIE_NAME, token, { expires: 7 }); // 7 days expiry
    Cookies.set(
      USER_COOKIE_NAME,
      JSON.stringify({
        id: response.data.user_id,
        email: user_email,
        username: user_nicename,
        displayName: user_display_name,
      }),
      { expires: 7 }
    );

    return {
      success: true,
      user: {
        id: response.data.user_id,
        email: user_email,
        name: user_display_name,
      },
    };
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || "Login failed. Please try again.",
    };
  }
}

export function logoutUser() {
  Cookies.remove(AUTH_COOKIE_NAME);
  Cookies.remove(USER_COOKIE_NAME);
}

// Validate token on server-side
export async function validateToken(token) {
  try {
    const response = await axios.post(
      `${WORDPRESS_API_URL}/jwt-auth/v1/token/validate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { valid: response.data.success };
  } catch (error) {
    return { valid: false };
  }
}

// Server-side function to get user from token
export async function getUserFromToken(token) {
  try {
    const { valid } = await validateToken(token);
    if (!valid) return null;

    // Get user info from WordPress
    const response = await axios.get(`${WORDPRESS_API_URL}/wp/v2/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      id: response.data.id,
      email: response.data.email,
      name: response.data.name,
    };
  } catch (error) {
    console.error("Error getting user from token:", error);
    return null;
  }
}

// Wrapper for API requests that need authentication
export const api = wpApi;

export default {
  loginUser,
  logoutUser,
  isAuthenticated,
  getAuthToken,
  getUserInfo,
  validateToken,
  getUserFromToken,
  api,
};
