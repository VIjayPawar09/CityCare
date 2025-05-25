import React, { useState } from "react";
import { X, Lock, Mail, User, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate=useNavigate()
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    userType: "citizen",
  });

  // API Configuration
  const API_BASE_URL = "http://localhost:3000/api";

  const handleInputChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Login API call
  const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return response.json();
  };

  // Sign up API call
  const signUpUser = async (userData) => {
    alert("register")
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return response.json();
  };

  // Store authentication token
  const storeAuthToken = (token, user) => {
    // Store in memory (you might want to use a more sophisticated state management solution)
    window.authToken = token;
    window.currentUser = user;
    
    // Optionally store in sessionStorage for persistence across page refreshes
    // Note: localStorage is not available in Claude artifacts, so using sessionStorage as fallback
    try {
      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("currentUser", JSON.stringify(user));
    } catch (e) {
      // Fallback if sessionStorage is not available
      console.log("Session storage not available, using memory storage only");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (isSignUp) {
        // Validate sign up form
        if (loginForm.password !== loginForm.confirmPassword) {
          throw new Error("Passwords do not match!");
        }

        if (loginForm.password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }

        if (!loginForm.fullName.trim()) {
          throw new Error("Full name is required");
        }

        // Sign up API call
        const signUpData = {
          fullName: loginForm.fullName.trim(),
          email: loginForm.email.toLowerCase().trim(),
          password: loginForm.password,
          confirmPassword: loginForm.confirmPassword,
          userType: loginForm.userType,
        };

        const response = await signUpUser(signUpData);
        
        // Store auth token and user info
        storeAuthToken(response.token, response.user);
        
        // Call success callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(response.user);
        }

        console.log("Sign up successful:", response);
      } else {
        // Login API call
        const loginData = {
          email: loginForm.email.toLowerCase().trim(),
          password: loginForm.password,
        };

        const response = await loginUser(loginData);
        
        // Store auth token and user info
        storeAuthToken(response.token, response.user);
        if (response.user.userType === "admin") navigate("/admin");
      else if (response.user.userType === "citizen") navigate("/citizen");
      else if (response.user.userType === "volunteer") navigate("/volunteer");
      else navigate("/");
        // Call success callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(response.user);
        }

        console.log("Login successful:", response);
      }

      // Close modal on success
      handleClose();
    } catch (err) {
      setError(err.message);
      console.error("Authentication error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setLoginForm({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      userType: "citizen",
    });
    setShowPassword(false);
    setError("");
  };

  const handleClose = () => {
    setIsSignUp(false);
    setShowPassword(false);
    setError("");
    setIsLoading(false);
    setLoginForm({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      userType: "citizen",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!isLoading ? handleClose : undefined}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Close button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-600">
              {isSignUp
                ? "Join City Connect to report issues and stay informed"
                : "Sign in to your City Connect account"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {isSignUp && (   
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="fullName"
                    value={loginForm.fullName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your full name"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      loginForm.userType === "citizen"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value="citizen"
                      checked={loginForm.userType === "citizen"}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="sr-only"
                    />
                    <User
                      className={`w-6 h-6 mb-2 ${
                        loginForm.userType === "citizen"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        loginForm.userType === "citizen"
                          ? "text-blue-700"
                          : "text-gray-600"
                      }`}
                    >
                      Citizen
                    </span>
                  </label>

                  <label
                    className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      loginForm.userType === "volunteer"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value="volunteer"
                      checked={loginForm.userType === "volunteer"}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="sr-only"
                    />
                    <User
                      className={`w-6 h-6 mb-2 ${
                        loginForm.userType === "volunteer"
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        loginForm.userType === "volunteer"
                          ? "text-green-700"
                          : "text-gray-600"
                      }`}
                    >
                      Volunteer
                    </span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {loginForm.userType === "citizen" &&
                    "Report issues and track city services"}
                  {loginForm.userType === "volunteer" &&
                    "Help resolve community issues and volunteer for city projects"}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={loginForm.confirmPassword}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Confirm your password"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    disabled={isLoading}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                </>
              )}
            </button>

            <div className="text-center">
              <span className="text-gray-600">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>
              <button
                type="button"

                onClick={switchMode}
                disabled={isLoading}
                className="ml-2 text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility function to get authentication token
export const getAuthToken = () => {
  return window.authToken || sessionStorage.getItem("authToken");
};

// Utility function to get current user
export const getCurrentUser = () => {
  if (window.currentUser) return window.currentUser;
  
  try {
    const userStr = sessionStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

// Utility function to logout
export const logout = () => {
  window.authToken = null;
  window.currentUser = null;
  
  try {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("currentUser");
  } catch (e) {
    // Ignore if sessionStorage is not available
  }
};

// Utility function to make authenticated API calls
export const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(endpoint, config);
  
  if (response.status === 401) {
    // Token expired or invalid
    logout();
    throw new Error("Authentication required");
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "API call failed");
  }

  return response.json();
};

export default LoginModal;