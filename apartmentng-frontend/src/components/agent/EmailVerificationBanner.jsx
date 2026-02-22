import { useState } from 'react';
import { Mail, AlertCircle, CheckCircle, X } from 'lucide-react';
import { resendVerificationEmail } from '../../services/agentService';

const EmailVerificationBanner = ({ agent }) => {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [dismissed, setDismissed] = useState(false);

  if (!agent || agent.email_verified === 1 || dismissed) {
    return null;
  }

  const handleResend = async () => {
    setSending(true);
    setMessage('');
    
    try {
      await resendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-strong">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Email Verification Required</p>
              <p className="text-sm text-white/90">
                Please verify your email address to unlock all features. Check your inbox for the verification link.
              </p>
              {message && (
                <p className={`text-sm mt-2 flex items-center gap-2 ${message.includes('sent') ? 'text-green-100' : 'text-red-100'}`}>
                  {message.includes('sent') ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {message}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleResend}
              disabled={sending}
              className="px-4 py-2 bg-white text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {sending ? 'Sending...' : 'Resend Email'}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;