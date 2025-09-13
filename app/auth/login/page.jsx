"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/AuthContext";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // Login
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'login',
            email,
            password
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Use the auth context login function
          login(data.token, data.user);
          setMessage("✅ Login successful!");
          router.push('/');
        } else {
          setMessage(data.error || "Login failed");
        }
      } else {
        // Sign up
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'signup',
            email,
            password
          })
        });

        const data = await response.json();

        if (response.ok) {
          setMessage("✅ Check your email for verification code!");
          setShowOtpInput(true);
        } else {
          setMessage(data.error || "Sign up failed");
        }
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          email,
          otp
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Use the auth context login function
        login(data.token, data.user);
        setMessage("✅ Email verified successfully!");
        router.push('/');
      } else {
        setMessage(data.error || "Verification failed");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ New verification code sent to your email!");
      } else {
        setMessage(data.error || "Failed to resend code");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showOtpInput) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleVerifyOtp}
          className="bg-white shadow-lg rounded-xl p-6 w-96"
        >
          <h1 className="text-xl font-bold mb-4">Verify Your Email</h1>
          <p className="text-sm text-gray-600 mb-4">
            Enter the 6-digit code sent to {email}
          </p>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            className="w-full border p-2 mb-4 rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={loading}
            className="w-full mt-2 text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            Resend Code
          </button>
          <button
            type="button"
            onClick={() => {
              setShowOtpInput(false);
              setOtp("");
              setMessage("");
            }}
            className="w-full mt-2 text-gray-600 hover:text-gray-800"
          >
            Back to Sign Up
          </button>
          {message && (
            <p className={`mt-4 text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-96">
        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-l ${isLogin ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-r ${!isLogin ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleAuth}>
          <h1 className="text-xl font-bold mb-4">
            {isLogin ? "Login" : "Create Account"}
          </h1>
          
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-2 mb-4 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border p-2 mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
          </button>
          
          {message && (
            <p className={`mt-4 text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
