import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { agentRegister } from '../services/authService';
import Button from '../components/common/Button';
import { User, Mail, Lock, Phone, Building, ArrowLeft, CheckCircle } from 'lucide-react';

const AgentRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await agentRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        company_name: formData.company_name,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="card-elevated p-8 md:p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">
              Registration Successful!
            </h1>
            <p className="text-slate-600 mb-8">
              Thank you for registering! Your account is pending approval from our admin team. 
              You'll receive an email notification once your account is approved.
            </p>
            <div className="space-y-3">
              <Link to="/" className="btn-primary w-full">
                Back to Home
              </Link>
              <Link to="/agent/login" className="btn-secondary w-full">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-navy-500 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-slate-600 hover:text-teal-600 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to home
        </Link>

        {/* Registration Card */}
        <div className="card-elevated p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
              Become an Agent
            </h1>
            <p className="text-slate-600">
              Join our network and start listing your properties
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="input-field pl-12"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address *
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

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 800 000 0000"
                    className="input-field pl-12"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Your Company Ltd"
                    className="input-field pl-12"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password *
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
                <p className="text-xs text-slate-500 mt-1">At least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="input-field pl-12"
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-600">
                By registering, you agree to our{' '}
                <a href="#" className="text-teal-600 hover:text-teal-700 font-semibold">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-teal-600 hover:text-teal-700 font-semibold">
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Create Agent Account
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/agent/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentRegister;