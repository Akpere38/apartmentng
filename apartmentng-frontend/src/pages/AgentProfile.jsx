import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getMyProfile, updateMyProfile, changeMyPassword, uploadMyDocument, deleteMyDocument, requestEmailChange } from '../services/agentService';
import { User, Phone, Building, Mail, Lock, Upload, FileText, CheckCircle, Clock, XCircle, Trash2, Eye, AlertCircle } from 'lucide-react';

const AgentProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});

  // Personal Info Form
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    phone: '',
    company_name: ''
  });

  // Email Change Form
  const [emailChangeForm, setEmailChangeForm] = useState({
    new_email: '',
    confirm_email: ''
  });
  const [showEmailChange, setShowEmailChange] = useState(false);

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfileData(data);
      setPersonalInfo({
        name: data.name || '',
        phone: data.phone || '',
        company_name: data.company_name || ''
      });
    } catch (error) {
      console.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value
    });
    setErrors({});
  };

  const handleEmailChange = (e) => {
    setEmailChangeForm({
      ...emailChangeForm,
      [e.target.name]: e.target.value
    });
    setErrors({});
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
    setErrors({});
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccessMessage('');

    try {
      await updateMyProfile(personalInfo);
      setSuccessMessage('Profile updated successfully!');
      fetchProfile();
    } catch (error) {
      setErrors({ profile: error.response?.data?.error || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleRequestEmailChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccessMessage('');

    if (emailChangeForm.new_email !== emailChangeForm.confirm_email) {
      setErrors({ email: 'Email addresses do not match' });
      setSaving(false);
      return;
    }

    try {
      await requestEmailChange(emailChangeForm.new_email);
      setSuccessMessage('Verification email sent to your new address! Please check your inbox.');
      setEmailChangeForm({ new_email: '', confirm_email: '' });
      setShowEmailChange(false);
    } catch (error) {
      setErrors({ email: error.response?.data?.error || 'Failed to change email' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccessMessage('');

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setErrors({ password: 'Passwords do not match' });
      setSaving(false);
      return;
    }

    try {
      await changeMyPassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      setSuccessMessage('Password changed successfully!');
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      setErrors({ password: error.response?.data?.error || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  const handleDocumentUpload = async (documentType, file) => {
    if (!file) return;

    setUploading({ ...uploading, [documentType]: true });
    setErrors({});

    try {
      await uploadMyDocument(documentType, file);
      fetchProfile();
      setSuccessMessage('Document uploaded successfully! Waiting for admin approval.');
    } catch (error) {
      setErrors({ [documentType]: error.response?.data?.error || 'Upload failed' });
    } finally {
      setUploading({ ...uploading, [documentType]: false });
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Delete this document?')) return;

    try {
      await deleteMyDocument(documentId);
      fetchProfile();
      setSuccessMessage('Document deleted successfully');
    } catch (error) {
      alert('Failed to delete document');
    }
  };

  const getDocumentByType = (type) => {
    return profileData?.documents?.find(doc => doc.document_type === type);
  };

  const documentTypes = [
    { id: 'id_card_front', label: 'ID Card (Front)', icon: FileText },
    { id: 'id_card_back', label: 'ID Card (Back)', icon: FileText },
    { id: 'business_registration', label: 'Business Registration', icon: Building },
    { id: 'proof_of_address', label: 'Proof of Address', icon: FileText }
  ];

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-navy-700 text-white">
          <div className="container-custom py-12">
            <h1 className="text-4xl font-display font-bold mb-2">My Profile</h1>
            <p className="text-teal-100">Manage your account settings and verification documents</p>
          </div>
        </div>

        <div className="container-custom -mt-8 mb-8">
          <div className="card-elevated p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-3xl">
                  {profileData?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{profileData?.name}</h2>
                <p className="text-slate-600">{profileData?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {profileData?.is_approved === 1 ? (
                    <span className="badge badge-success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Agent
                    </span>
                  ) : (
                    <span className="badge badge-warning">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Verification
                    </span>
                  )}
                  <span className="badge badge-teal">
                    {profileData?.apartment_count} Listings
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="container-custom mb-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl animate-slide-down">
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="container-custom pb-16">
          <div className="card p-2 inline-flex gap-2 mb-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5 inline mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Personal Information</h3>
              
              {errors.profile && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700">{errors.profile}</p>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        value={personalInfo.name}
                        onChange={handlePersonalInfoChange}
                        className="input-field pl-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        className="input-field pl-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="company_name"
                        value={personalInfo.company_name}
                        onChange={handlePersonalInfoChange}
                        className="input-field pl-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          value={profileData?.email}
                          className="input-field pl-12 bg-slate-100"
                          disabled
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowEmailChange(!showEmailChange)}
                        className="btn-secondary whitespace-nowrap"
                      >
                        Change Email
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {profileData?.email_verified === 1 ? (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Not verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Updating...' : 'Update Profile'}
                </button>
              </form>

              {/* Email Change Form */}
              {showEmailChange && (
                <div className="mt-6 p-6 bg-teal-50 border-2 border-teal-200 rounded-xl">
                  <h4 className="font-semibold text-slate-900 mb-4">Change Email Address</h4>
                  
                  {errors.email && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{errors.email}</p>
                    </div>
                  )}

                  <form onSubmit={handleRequestEmailChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        New Email Address
                      </label>
                      <input
                        type="email"
                        name="new_email"
                        value={emailChangeForm.new_email}
                        onChange={handleEmailChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Confirm New Email
                      </label>
                      <input
                        type="email"
                        name="confirm_email"
                        value={emailChangeForm.confirm_email}
                        onChange={handleEmailChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs text-amber-800">
                        ⚠️ A verification email will be sent to your new address. Your email will only be updated after verification.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button type="submit" className="btn-primary flex-1" disabled={saving}>
                        {saving ? 'Sending...' : 'Send Verification Email'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEmailChange(false);
                          setEmailChangeForm({ new_email: '', confirm_email: '' });
                          setErrors({});
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="card p-6 bg-teal-50 border-2 border-teal-200">
                <h4 className="font-bold text-teal-900 mb-2">📋 Verification Documents</h4>
                <p className="text-sm text-teal-800">
                  Upload your verification documents for admin approval. Verified agents get priority listing and trust badges.
                </p>
              </div>

              {documentTypes.map(docType => {
                const Icon = docType.icon;
                const existingDoc = getDocumentByType(docType.id);
                const isUploading = uploading[docType.id];

                return (
                  <div key={docType.id} className="card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{docType.label}</h4>
                          {existingDoc && (
                            <div className="flex items-center gap-2 mt-1">
                              {existingDoc.status === 'approved' && (
                                <span className="badge badge-success">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approved
                                </span>
                              )}
                              {existingDoc.status === 'pending' && (
                                <span className="badge badge-warning">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pending Review
                                </span>
                              )}
                              {existingDoc.status === 'rejected' && (
                                <span className="badge badge-danger">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Rejected
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {existingDoc && (
                        <div className="flex gap-2">
                          <a
                            href={existingDoc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ghost text-sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </a>
                          <button
                            onClick={() => handleDeleteDocument(existingDoc.id)}
                            className="btn-ghost text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {existingDoc?.rejection_reason && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Rejection Reason:</strong> {existingDoc.rejection_reason}
                        </p>
                      </div>
                    )}

                    {errors[docType.id] && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{errors[docType.id]}</p>
                      </div>
                    )}

                    <label className="cursor-pointer">
                      <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-6 text-center transition-colors">
                        {isUploading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin h-6 w-6 text-teal-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-slate-700">Uploading...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-slate-700 font-medium">
                              {existingDoc ? 'Replace Document' : 'Upload Document'}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              PNG, JPG, PDF (Max 5MB)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleDocumentUpload(docType.id, e.target.files[0])}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Change Password</h3>

              {errors.password && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700">{errors.password}</p>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Current Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      name="current_password"
                      value={passwordForm.current_password}
                      onChange={handlePasswordChange}
                      className="input-field pl-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    New Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      name="new_password"
                      value={passwordForm.new_password}
                      onChange={handlePasswordChange}
                      className="input-field pl-12"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">At least 6 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      name="confirm_password"
                      value={passwordForm.confirm_password}
                      onChange={handlePasswordChange}
                      className="input-field pl-12"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AgentProfile;