"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/public/src/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<
    "admin" | "customer" | "driver" | null
  >(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await loginUser(username, password);

      // Store user data in localStorage
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        }),
      );

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/dashboard");
      } else if (user.role === "customer") {
        router.push("/customer-dashboard");
      } else if (user.role === "driver") {
        router.push("/driver-dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ISDN</h1>
            <p className="text-gray-600">
              Integrated Supply Distribution Network
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4 font-semibold">
              Demo Credentials:
            </p>
            <div className="space-y-3 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-semibold text-blue-900">Admin</p>
                <p className="text-blue-700">Username: admin</p>
                <p className="text-blue-700">Password: admin123</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="font-semibold text-green-900">Customer</p>
                <p className="text-green-700">Username: singer_mega</p>
                <p className="text-green-700">Password: customer123</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <p className="font-semibold text-purple-900">Driver</p>
                <p className="text-purple-700">Username: john_driver</p>
                <p className="text-purple-700">Password: driver123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
