import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { agentLogin } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { Mail, Lock, ArrowLeft, User } from 'lucide-react';

const AgentLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await agentLogin(formData.email, formData.password);
      login(response.agent, 'agent');
      navigate('/agent/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-navy-500 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-slate-600 hover:text-teal-600 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to home
        </Link>

        {/* Login Card */}
        <div className="card-elevated p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
              Agent Portal
            </h1>
            <p className="text-slate-600">
              Sign in to manage your listings
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-down">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="agent@example.com"
                  required
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              icon={User}
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 text-center mb-4">
              Don't have an account?{' '}
              <Link to="/agent/register" className="text-teal-600 hover:text-teal-700 font-semibold">
                Register as Agent
              </Link>
            </p>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLogin;