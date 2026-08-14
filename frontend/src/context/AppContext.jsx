import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const BASE_URL = "http://localhost:4000";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Request:", config.url, "Token:", !!token);

    return config;
  },
  (error) => Promise.reject(error)
);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  // Get user profile
  const fetchUserProfile = async () => {
    try {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setUser(null);
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/user/get-profile`
      );

      console.log("Profile response:", response.data);

      if (response.data.success) {
        setUser(response.data.userData);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/login`,
        {
          email,
          password,
        }
      );

      console.log("Login response:", response.data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);

        await fetchUserProfile();

        return {
          success: true,
          message: "Logged in successfully",
        };
      }

      return {
        success: false,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed",
      };
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/register`,
        userData
      );

      console.log("Register response:", response.data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);

        await fetchUserProfile();

        return {
          success: true,
          message: "Account created successfully",
        };
      }

      return {
        success: false,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Registration error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setAppointments([]);
  };

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/doctor/list`
      );

      if (response.data.success) {
        setDoctors(response.data.doctors);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Fetch appointments
  const fetchUserAppointments = async () => {
    try {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) return;

      const response = await axios.get(
        `${BASE_URL}/api/user/appointments`
      );

      if (response.data.success) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        await fetchUserProfile();
        await fetchUserAppointments();
      }

      await fetchDoctors();

      setLoading(false);
    };

    loadData();
  }, []);

  const contextValue = {
    backendUrl: BASE_URL,

    user,
    setUser,

    token,
    setToken,

    doctors,
    setDoctors,

    appointments,
    setAppointments,

    loading,
    setLoading,

    login,
    register,
    logout,

    fetchUserProfile,
    fetchDoctors,
    fetchUserAppointments,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};