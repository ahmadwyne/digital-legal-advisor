import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Shield, User, Calendar, Edit3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LogoSpinner from "@/components/ui/LogoSpinner";
import { userApi } from "@/api/userApi";
import { useToast } from "@/hooks/use-toast.js";
import { getErrorMessage } from "@/utils/errorHandler";

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userApi.getMyProfile();
        setUser(response.data?.user || null);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: getErrorMessage(error),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LogoSpinner size={64} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 font-semibold" style={{ fontFamily: "Inter" }}>
          Unable to load profile data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent"
            style={{ fontFamily: "Poppins" }}
          >
            Admin Profile
          </h1>
          <p
            className="text-sm sm:text-base text-gray-600 mt-2 font-medium"
            style={{ fontFamily: "Inter" }}
          >
            Review your account details and security status
          </p>
        </div>

        <Button
          onClick={() => navigate("/admin/settings")}
          className="w-fit group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          style={{ fontFamily: "Inter" }}
        >
          <Edit3 className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <Card className="border-2 border-blue-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b-2 border-blue-100">
          <CardTitle
            className="text-xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
            style={{ fontFamily: "Poppins" }}
          >
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-4 rounded-2xl border-2 border-blue-100 bg-white/80 p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 font-bold" style={{ fontFamily: "Inter" }}>
                Full Name
              </p>
              <p className="text-lg font-bold text-gray-800" style={{ fontFamily: "Poppins" }}>
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 rounded-2xl border-2 border-blue-100 bg-white/80 p-4">
              <Mail className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-xs uppercase text-gray-500 font-bold" style={{ fontFamily: "Inter" }}>
                  Email
                </p>
                <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: "Inter" }}>
                  {user.email}
                </p>
                {user.isEmailVerified && (
                  <p className="text-xs font-semibold text-green-600 mt-1">Verified</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border-2 border-blue-100 bg-white/80 p-4">
              <Phone className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-xs uppercase text-gray-500 font-bold" style={{ fontFamily: "Inter" }}>
                  Phone
                </p>
                <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: "Inter" }}>
                  {user.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border-2 border-blue-100 bg-white/80 p-4">
              <Shield className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-xs uppercase text-gray-500 font-bold" style={{ fontFamily: "Inter" }}>
                  Role
                </p>
                <p className="text-sm font-semibold text-gray-800 capitalize" style={{ fontFamily: "Inter" }}>
                  {user.role}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border-2 border-blue-100 bg-white/80 p-4">
              <Calendar className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-xs uppercase text-gray-500 font-bold" style={{ fontFamily: "Inter" }}>
                  Member Since
                </p>
                <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: "Inter" }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
