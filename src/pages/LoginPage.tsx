import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineAcademicCap, HiOutlineClock, HiOutlineXCircle } from 'react-icons/hi';

export default function LoginPage() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  if (user) return <Navigate to={`/${user.role}`} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusError(null);
    try {
      await login(email, password);
      toast.success('Login successful!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';

      if (message.includes('pending')) {
        setStatusError('pending');
      } else if (message.includes('rejected')) {
        setStatusError('rejected');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/80";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute top-[40%] right-[10%] w-48 h-48 bg-purple-200/20 rounded-full blur-3xl" />

      <div className="max-w-md w-full glass rounded-2xl shadow-xl p-8 border border-white/40 relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg mb-4">
            <HiOutlineAcademicCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {statusError === 'pending' && (
          <div className="mb-5 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <HiOutlineClock className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">Account Pending Approval</p>
              <p className="text-xs text-amber-700 mt-1">
                Your account is pending approval from the TPO. You will be able to log in once approved.
              </p>
            </div>
          </div>
        )}

        {statusError === 'rejected' && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <HiOutlineXCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Account Rejected</p>
              <p className="text-xs text-red-700 mt-1">
                Your account has been rejected. Please contact the placement office for more information.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Register as Student
          </Link>
        </p>
      </div>
    </div>
  );
}
