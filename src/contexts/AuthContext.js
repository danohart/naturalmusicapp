import React, { createContext, useState, useContext, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  isAuthenticated,
  getUserInfo,
  getAuthToken,
} from "../lib/auth";
import { useRouter } from "next/router";

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = () => {
    if (isAuthenticated()) {
      const userInfo = getUserInfo();
      setUser(userInfo);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, [router.pathname]);

  const login = async (username, password) => {
    setLoading(true); // Set loading to true when login starts
    const result = await loginUser(username, password);

    if (result.success) {
      const freshUserInfo = getUserInfo();
      console.log("Login successful, user info:", freshUserInfo);
      setUser(freshUserInfo);
    }

    setLoading(false);
    return result;
  };

  // Logout function with improved state cleanup
  const logout = () => {
    setLoading(true);
    logoutUser();
    setUser(null);
    setLoading(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
