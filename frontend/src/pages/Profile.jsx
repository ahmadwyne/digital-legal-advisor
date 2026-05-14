import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserCircle, Mail, Phone, Shield, Calendar,
  Edit3, Save, X, Lock, Eye, EyeOff,
  CheckCircle2, MessageCircle, FileText, BookOpen,
  Loader2, ArrowLeft, KeyRound,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { userApi } from '@/api/userApi';
import { authApi } from '@/api/authApi';
import { setAccessToken, setRefreshToken } from '@/utils/tokenManager';
import LogoSpinner from '@/components/ui/LogoSpinner';
import { useToast } from '@/hooks/use-toast.js';
import { getErrorMessage } from '@/utils/errorHandler';

// ─── Small reusable sub-components ───────────────────────────────────────────

const InfoRow = ({ icon, label, value, badge, valueClass = '' }) => (
  <div className="flex items-start gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
    <div className="mt-0.5 flex-shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5" style={{ fontFamily: 'Inter' }}>
        {label}
      </p>
      <p className={`text-sm font-semibold text-gray-800 truncate ${valueClass}`} style={{ fontFamily: 'Inter' }}>
        {value}
      </p>
      {badge && <div className="mt-1">{badge}</div>}
    </div>
  </div>
);

const FormField = ({ label, name, value, onChange, type = 'text', required = false, disabled = false, placeholder = '' }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5" style={{ fontFamily: 'Inter' }}>
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-white border-2 border-blue-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ fontFamily: 'Inter' }}
    />
  </div>
);

const PasswordField = ({ label, name, value, onChange, show, onToggle, disabled }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5" style={{ fontFamily: 'Inter' }}>
      {label}<span className="text-red-400 ml-0.5">*</span>
    </label>
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
        className="w-full px-4 py-2.5 pr-11 bg-white border-2 border-blue-200 rounded-xl text-sm text-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: 'Inter' }}
      />
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile,  setIsSavingProfile]  = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName:   '',
    lastName:    '',
    phoneNumber: '',
  });

  // Password change state
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new:     false,
    confirm: false,
  });

  const tabs = [
    { label: 'Chat',       icon: MessageCircle, path: '/platform'           },
    { label: 'Summarizer', icon: FileText,       path: '/document-summarizer' },
    { label: 'Precedents', icon: BookOpen,       path: '/legal-precedents'   },
  ];

  // Seed form from context whenever authUser changes
  useEffect(() => {
    if (authUser) {
      setProfileForm({
        firstName:   authUser.firstName   || '',
        lastName:    authUser.lastName    || '',
        phoneNumber: authUser.phoneNumber || '',
      });
    }
  }, [authUser]);

  const getInitials = () => {
    if (!authUser) return '?';
    return `${authUser.firstName?.[0] || ''}${authUser.lastName?.[0] || ''}`.toUpperCase();
  };

  // ── Profile submit ────────────────────────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const response = await userApi.updateMyProfile(profileForm);
      updateUser(response.data.user);
      toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
      setIsEditingProfile(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Update failed', description: getErrorMessage(error) });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const cancelEdit = () => {
    setIsEditingProfile(false);
    setProfileForm({
      firstName:   authUser.firstName   || '',
      lastName:    authUser.lastName    || '',
      phoneNumber: authUser.phoneNumber || '',
    });
  };

  // ── Password submit ───────────────────────────────────────────────────────
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ variant: 'destructive', title: 'Passwords do not match', description: 'New password and confirmation must be the same.' });
      return;
    }
    setIsSavingPassword(true);
    try {
      const response = await authApi.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      // Backend regenerates tokens on password change — update localStorage
      if (response.data?.token) {
        setAccessToken(response.data.token);
        setRefreshToken(response.data.refreshToken);
      }
      toast({ title: 'Password updated', description: 'Your password has been changed successfully.' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Password change failed', description: getErrorMessage(error) });
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (!authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LogoSpinner size={56} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundImage: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 25%, #fffbeb 75%, #fef3c7 100%)' }}
    >
      {/* ── Header bar — matches Platform.jsx exactly ── */}
      <div
        className="border-b-2 border-blue-200/50 px-6 py-4 flex items-center justify-between shadow-md flex-shrink-0"
        style={{ backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #f0f9ff 25%, #e0f2fe 50%, #fef3c7 75%, #ffffff 100%)' }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100/60 rounded-lg transition-all duration-300 group"
          style={{ fontFamily: 'Inter' }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm font-semibold">Back</span>
        </button>

        {/* Tabs */}
        <nav className="flex items-center gap-1 flex-1 justify-center">
          {tabs.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 group whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-400/30 hover:bg-blue-700'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
                style={{ fontFamily: 'Inter' }}
              >
                <Icon className={`w-4 h-4 group-hover:scale-110 transition-transform ${isActive ? 'text-white' : ''}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Spacer to keep tabs centred */}
        <div className="w-20" />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

          {/* Page heading */}
          <div className="mb-6">
            <h1
              className="text-3xl font-black bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent"
              style={{ fontFamily: 'Poppins' }}
            >
              My Profile
            </h1>
            <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter' }}>
              Manage your account information and security settings
            </p>
          </div>

          <div className="space-y-6">

            {/* ══ Profile Information Card ══════════════════════════════ */}
            <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-md overflow-hidden">

              {/* Card header with avatar */}
              <div
                className="px-6 py-5 border-b border-blue-100 flex items-center justify-between"
                style={{ backgroundImage: 'linear-gradient(90deg, #f0f9ff 0%, #ffffff 100%)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-xl font-black text-white" style={{ fontFamily: 'Poppins' }}>
                      {getInitials()}
                    </span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-800" style={{ fontFamily: 'Poppins' }}>
                      {authUser.firstName} {authUser.lastName}
                    </p>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter' }}>
                      {authUser.email}
                    </p>
                  </div>
                </div>

                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{ fontFamily: 'Inter' }}
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {/* Card body */}
              <div className="p-6">
                {!isEditingProfile ? (
                  /* View mode */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoRow
                      icon={<UserCircle className="w-4 h-4 text-blue-500" />}
                      label="First Name"
                      value={authUser.firstName}
                    />
                    <InfoRow
                      icon={<UserCircle className="w-4 h-4 text-blue-500" />}
                      label="Last Name"
                      value={authUser.lastName}
                    />
                    <InfoRow
                      icon={<Mail className="w-4 h-4 text-blue-500" />}
                      label="Email"
                      value={authUser.email}
                      badge={
                        authUser.isEmailVerified
                          ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />Verified
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              Unverified
                            </span>
                          )
                      }
                    />
                    <InfoRow
                      icon={<Phone className="w-4 h-4 text-blue-500" />}
                      label="Phone"
                      value={authUser.phoneNumber || '—'}
                    />
                    <InfoRow
                      icon={<Shield className="w-4 h-4 text-blue-500" />}
                      label="Role"
                      value={authUser.role}
                      valueClass="capitalize"
                    />
                    <InfoRow
                      icon={<Calendar className="w-4 h-4 text-blue-500" />}
                      label="Member Since"
                      value={
                        authUser.createdAt
                          ? new Date(authUser.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric',
                            })
                          : '—'
                      }
                    />
                  </div>
                ) : (
                  /* Edit mode */
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label="First Name"
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                        required
                        disabled={isSavingProfile}
                      />
                      <FormField
                        label="Last Name"
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                        required
                        disabled={isSavingProfile}
                      />
                    </div>
                    <FormField
                      label="Phone Number"
                      name="phoneNumber"
                      type="tel"
                      value={profileForm.phoneNumber}
                      onChange={(e) => setProfileForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                      placeholder="e.g. +92 300 1234567"
                      disabled={isSavingProfile}
                    />

                    <div className="flex gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 shadow-sm hover:shadow-md"
                        style={{ fontFamily: 'Inter' }}
                      >
                        {isSavingProfile
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Save className="w-4 h-4" />}
                        {isSavingProfile ? 'Saving…' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={isSavingProfile}
                        className="flex items-center gap-2 px-5 py-2.5 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 text-sm font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
                        style={{ fontFamily: 'Inter' }}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* ══ Change Password Card (local auth only) ════════════════ */}
            {authUser.authProvider === 'local' && (
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-md overflow-hidden">

                <div
                  className="px-6 py-5 border-b border-blue-100 flex items-center gap-3"
                  style={{ backgroundImage: 'linear-gradient(90deg, #f0f9ff 0%, #ffffff 100%)' }}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border border-blue-200 flex-shrink-0">
                    <KeyRound className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-800" style={{ fontFamily: 'Poppins' }}>
                      Change Password
                    </p>
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter' }}>
                      Keep your account secure with a strong password
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <PasswordField
                      label="Current Password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                      show={showPasswords.current}
                      onToggle={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                      disabled={isSavingPassword}
                    />
                    <PasswordField
                      label="New Password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                      show={showPasswords.new}
                      onToggle={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                      disabled={isSavingPassword}
                    />
                    <PasswordField
                      label="Confirm New Password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                      show={showPasswords.confirm}
                      onToggle={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                      disabled={isSavingPassword}
                    />

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={
                          isSavingPassword ||
                          !passwordForm.currentPassword ||
                          !passwordForm.newPassword ||
                          !passwordForm.confirmPassword
                        }
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 shadow-sm hover:shadow-md"
                        style={{ fontFamily: 'Inter' }}
                      >
                        {isSavingPassword
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Lock className="w-4 h-4" />}
                        {isSavingPassword ? 'Updating…' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Google auth notice */}
            {authUser.authProvider === 'google' && (
              <div className="flex items-center gap-3 px-5 py-4 bg-white/60 border border-blue-100 rounded-xl text-sm text-gray-500" style={{ fontFamily: 'Inter' }}>
                <img src="/google-logo.png" alt="Google" className="w-4 h-4 flex-shrink-0" />
                <span>You signed in with Google. Password management is handled by your Google account.</span>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
