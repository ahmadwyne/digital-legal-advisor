import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, User, Save, ArrowLeft, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import LogoSpinner from "@/components/ui/LogoSpinner";
import { userApi } from "@/api/userApi";
import { useToast } from "@/hooks/use-toast.js";
import { getErrorMessage } from "@/utils/errorHandler";
import { useAuth } from "@/hooks/useAuth";
import { useAdminTheme } from "@/hooks/useAdminTheme";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { theme, toggleTheme } = useAdminTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userApi.getMyProfile();
        const user = response.data?.user;
        if (user) {
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phoneNumber: user.phoneNumber || "",
            email: user.email || "",
          });
        }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await userApi.updateMyProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      });

      const updatedUser = response.data?.user;
      if (updatedUser) {
        updateUser(updatedUser);
      }

      toast({
        variant: "success",
        title: "Saved",
        description: "Profile settings updated successfully",
      });

      navigate("/admin/profile");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: getErrorMessage(error),
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LogoSpinner size={64} />
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
            Admin Settings
          </h1>
          <p
            className="text-sm sm:text-base text-gray-600 mt-2 font-medium"
            style={{ fontFamily: "Inter" }}
          >
            Update your personal details and contact information
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/profile")}
          className="w-fit flex items-center gap-2 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl font-bold"
          style={{ fontFamily: "Inter" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Button>
      </div>

      <Card className="border-2 border-blue-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b-2 border-blue-100">
          <CardTitle
            className="text-xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
            style={{ fontFamily: "Poppins" }}
          >
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 rounded-2xl border-2 border-blue-100 bg-white/80 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-gray-800" style={{ fontFamily: "Inter" }}>
                  Appearance
                </p>
                <p className="text-xs text-gray-500" style={{ fontFamily: "Inter" }}>
                  Toggle between light and dark mode for the admin panel.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Sun className="h-4 w-4 text-amber-500" />
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle admin dark mode"
                  className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-300"
                />
                <Moon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  className="text-sm font-semibold text-gray-700"
                  style={{ fontFamily: "Inter" }}
                >
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-9 rounded-xl border-2 border-blue-100 focus:border-blue-500"
                    placeholder="First name"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-semibold text-gray-700"
                  style={{ fontFamily: "Inter" }}
                >
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-9 rounded-xl border-2 border-blue-100 focus:border-blue-500"
                    placeholder="Last name"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-semibold text-gray-700"
                  style={{ fontFamily: "Inter" }}
                >
                  Email (read-only)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                  <Input
                    name="email"
                    value={formData.email}
                    readOnly
                    className="pl-9 rounded-xl border-2 border-blue-100 bg-blue-50/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-semibold text-gray-700"
                  style={{ fontFamily: "Inter" }}
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                  <Input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="pl-9 rounded-xl border-2 border-blue-100 focus:border-blue-500"
                    placeholder="Phone number"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/profile")}
                className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold"
                style={{ fontFamily: "Inter" }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                style={{ fontFamily: "Inter" }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
