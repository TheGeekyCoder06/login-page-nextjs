'use client'

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login response:", response.data);

      toast.success("Logged in successfully ✅");

      const userRole = response.data.user.role; // Extract the role from the response

      // Role-based redirection logic
      if (userRole === 'teacher') {
        router.push('/teacher-dashboard');
      } else if (userRole === 'student') {
        router.push('/student-dashboard');
      } else {
        // Fallback for unexpected role
        router.push('/profile'); 
      }
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    // 1. Light Theme Background
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* 2. Light Theme Card */}
      <div className="w-full max-w-sm p-8 bg-gray-50 rounded-xl shadow-xl border border-gray-200">
        {/* 3. Dark Text */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {loading ? "Logging in..." : "Log In"}
        </h1>

        <div className="space-y-4">
          {/* Email */}
          <div>
            {/* 4. Dark Label Text */}
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              // 5. Light Input Fields
              className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            {/* 6. Dark Label Text */}
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              // 7. Light Input Fields
              className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Login Button (Blue) */}
          <button
            onClick={onLogin}
            disabled={buttonDisabled || loading}
            // 8. Blue Button Styling
            className={`w-full py-2 px-4 font-semibold rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              buttonDisabled || loading
                ? 'bg-blue-300 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-gray-50'
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>

        {/* Signup link */}
        <div className="text-center mt-6">
          {/* 9. Dark Link Text */}
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            {/* 10. Blue Link Color */}
            <Link
              href="/signup"
              className="font-semibold text-blue-600 hover:text-blue-500 transition duration-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}