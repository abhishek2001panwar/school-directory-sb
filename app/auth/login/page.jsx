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
          
          // Check if there's a redirect URL
          const redirectTo = typeof window !== 'undefined' 
            ? sessionStorage.getItem('redirectAfterLogin') 
            : null;
          
          if (redirectTo) {
            sessionStorage.removeItem('redirectAfterLogin');
            router.push(redirectTo);
          } else {
            router.push('/');
          }
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
        
        // Check if there's a redirect URL
        const redirectTo = typeof window !== 'undefined' 
          ? sessionStorage.getItem('redirectAfterLogin') 
          : null;
        
        if (redirectTo) {
          sessionStorage.removeItem('redirectAfterLogin');
          router.push(redirectTo);
        } else {
          router.push('/');
        }
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex justify-center items-center p-4">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
          
          <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/50 relative">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
              <p className="text-gray-600">
                We sent a 6-digit code to
              </p>
              <p className="font-semibold text-indigo-600">{email}</p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Verification Code</label>
                <input
                  type="text"
                  placeholder="000000"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest focus:border-indigo-500 focus:outline-none transition-colors bg-white/70 backdrop-blur-sm"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Verifying...
                  </span>
                ) : (
                  "✅ Verify Code"
                )}
              </button>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full py-2 text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50 transition-colors"
                >
                  🔄 Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpInput(false);
                    setOtp("");
                    setMessage("");
                  }}
                  className="w-full py-2 text-gray-500 hover:text-gray-600 transition-colors"
                >
                  ← Back to Sign Up
                </button>
              </div>

              {message && (
                <div className={`p-4 rounded-xl border-2 ${
                  message.includes("✅") 
                    ? "bg-green-50 border-green-200 text-green-700" 
                    : "bg-red-50 border-red-200 text-red-700"
                }`}>
                  <p className="text-sm font-medium">{message}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex justify-center items-center p-4">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/50 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏫</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="text-gray-600">Access your school directory account</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex mb-8 p-1 bg-gray-100 rounded-2xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                isLogin 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🔐 Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                !isLogin 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ✨ Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">📧 Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors bg-white/70 backdrop-blur-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">🔒 Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors bg-white/70 backdrop-blur-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? "🚀 Login" : "✨ Create Account"}
                </span>
              )}
            </button>
            
            {message && (
              <div className={`p-4 rounded-xl border-2 ${
                message.includes("✅") 
                  ? "bg-green-50 border-green-200 text-green-700" 
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
