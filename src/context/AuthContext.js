import { createContext, useState, useContext } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await API.post("/auth/login", { email, password });

      const { accessToken, user } = response.data;
      if (!accessToken) {
        console.error("No accessToken returned from backend:", response.data);
        return { success: false, message: "No token from server" };
      }

      localStorage.setItem("token", accessToken); // ✅ fixed
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.log("Hi");
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await API.post("/auth/register", {
        name,
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
