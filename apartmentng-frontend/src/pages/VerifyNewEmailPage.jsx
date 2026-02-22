import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const VerifyNewEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    verifyNewEmail();
  }, [token]);

  const verifyNewEmail = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/agents/verify-new-email/${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setSuccess(true);
      setNewEmail(data.newEmail);
      
      // Redirect to profile after 3 seconds
      setTimeout(() => {
        navigate('/agent/profile');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="card-elevated max-w-md w-full p-8 text-center">
          {success ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Email Updated! 🎉
              </h1>
              <p className="text-slate-600 mb-4">
                Your email has been successfully changed to:
              </p>
              <p className="text-lg font-semibold text-teal-600 mb-6">
                {newEmail}
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Redirecting to profile in 3 seconds...
              </p>
              <Link to="/agent/profile" className="btn-primary inline-flex items-center">
                Go to Profile
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Verification Failed
              </h1>
              <p className="text-slate-600 mb-6">
                {error || 'The verification link is invalid or has expired.'}
              </p>
              <Link to="/agent/profile" className="btn-primary w-full">
                Back to Profile
              </Link>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerifyNewEmailPage;