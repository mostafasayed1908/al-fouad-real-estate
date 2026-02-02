import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../utils/supabase/client';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        onLoginSuccess();
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a74b48] to-[#8a3a37] flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#a74b48] to-[#8a3a37] p-8 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white text-[32px] font-bold mb-2">Admin Dashboard</h1>
          <p className="text-white/80 text-[16px]">Al-Fouad Real Estate</p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <h2 className="text-[24px] font-bold text-black mb-2">Welcome Back</h2>
          <p className="text-[#666] text-[14px] mb-6">Sign in to manage your website content</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-[14px]">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@alfouad.com"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-[#a74b48] focus:border-transparent"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[14px] font-semibold text-black mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-[#a74b48] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#a74b48] hover:bg-[#8a3a37] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-[16px]"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-[12px] text-[#666] text-center">
              🔒 This is a secure admin area. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
