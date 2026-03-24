import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, User, Mail, Phone, Calendar, Shield } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { userApi } from '@/api/userApi';
import { useToast } from '@/hooks/use-toast.js';
import { getErrorMessage } from '@/utils/errorHandler';

const Profile = () => {
  const { user:  authUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      setFormData({
        firstName: authUser.firstName || '',
        lastName: authUser. lastName || '',
        phoneNumber:  authUser.phoneNumber || '',
      });
    }
  }, [authUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userApi.updateMyProfile(formData);
      
      updateUser(response.data.user);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully! ',
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (! authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#29473E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8 mt-20">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#44444E]" style={{ fontFamily: 'Roboto Mono' }}>
              My Profile
            </h1>
            {! isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[#29473E] text-white rounded-lg hover:bg-[#1f3630] transition-colors"
                style={{ fontFamily: 'Noto Sans' }}
              >
                Edit Profile
              </button>
            )}
          </div>

          {! isEditing ? (
            // View Mode
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-[#29473E]" />
                <div>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Noto Sans' }}>Full Name</p>
                  <p className="font-semibold text-gray-800" style={{ fontFamily: 'Noto Sans' }}>
                    {authUser.firstName} {authUser.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-[#29473E]" />
                <div>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Noto Sans' }}>Email</p>
                  <p className="font-semibold text-gray-800" style={{ fontFamily:  'Noto Sans' }}>
                    {authUser. email}
                  </p>
                  {authUser.isEmailVerified && (
                    <span className="text-xs text-green-600">✓ Verified</span>
                  )}
                </div>
              </div>

              {authUser.phoneNumber && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-[#29473E]" />
                  <div>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Noto Sans' }}>Phone</p>
                    <p className="font-semibold text-gray-800" style={{ fontFamily: 'Noto Sans' }}>
                      {authUser.phoneNumber}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-[#29473E]" />
                <div>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Noto Sans' }}>Role</p>
                  <p className="font-semibold text-gray-800 capitalize" style={{ fontFamily: 'Noto Sans' }}>
                    {authUser.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-[#29473E]" />
                <div>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Noto Sans' }}>Member Since</p>
                  <p className="font-semibold text-gray-800" style={{ fontFamily: 'Noto Sans' }}>
                    {new Date(authUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" style={{ fontFamily: 'Noto Sans' }}>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData. firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#29473E] focus:outline-none"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" style={{ fontFamily:  'Noto Sans' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#29473E] focus: outline-none"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" style={{ fontFamily: 'Noto Sans' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#29473E] focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#29473E] text-white py-2 rounded-lg hover:bg-[#1f3630] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={isLoading}
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: authUser.firstName || '',
                      lastName: authUser.lastName || '',
                      phoneNumber: authUser.phoneNumber || '',
                    });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  disabled={isLoading}
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;