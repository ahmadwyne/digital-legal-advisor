import { useState, useEffect } from "react";
import { StatCard } from "@/components/admindashboard/StatCard";
import { ActivityChart } from "@/components/admindashboard/ActivityChart";
import { AlertCard } from "@/components/admindashboard/AlertCard";
import {
  Users,
  Activity,
  Database,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { adminApi } from "@/api/adminApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * AdminDashboard Component
 * Main dashboard view for administrators
 */
export const AdminDashboard = () => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    activityData: [],
    alerts: [],
  });

  // Fetch dashboard data
  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await adminApi.getDashboard();

      if (response.success) {
        setDashboardData(response.data);

        if (isRefresh) {
          toast({
            title: "Success",
            description: "Dashboard data refreshed successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p
          className="text-gray-600 font-semibold"
          style={{ fontFamily: "Inter" }}
        >
          Loading dashboard...
        </p>
      </div>
    );
  }

  // Prepare stats data
  const stats = dashboardData.stats
    ? [
        {
          title: "Total Users",
          value: dashboardData.stats.totalUsers?.toLocaleString() || "0",
          change: dashboardData.stats.userGrowth || "+0%",
          icon: Users,
          trend: dashboardData.stats.userGrowth?.includes("+") ? "up" : "down",
        },
        {
          title: "Active Sessions",
          value: dashboardData.stats.activeSessions?.toString() || "0",
          change: dashboardData.stats.sessionGrowth || "+0%",
          icon: Activity,
          trend: dashboardData.stats.sessionGrowth?.includes("+")
            ? "up"
            : "down",
        },
        {
          title: "Dataset Usage",
          value: dashboardData.stats.datasetUsage || "0%",
          change: dashboardData.stats.datasetTrend || "+0%",
          icon: Database,
          trend: dashboardData.stats.datasetTrend?.includes("+")
            ? "up"
            : "down",
        },
      ]
    : [];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1
            className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent"
            style={{ fontFamily: "Poppins" }}
          >
            Admin Dashboard
          </h1>
          <p
            className="text-sm sm:text-base text-black mt-2 font-medium"
            style={{ fontFamily: "Inter" }}
          >
            Welcome back, monitor your legal chatbot system
          </p>
        </div>

        {/* ✅ BEST FIX: Added w-fit to prevent full width */}
        <Button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="w-fit group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          style={{ fontFamily: "Inter" }}
        >
          <RefreshCw
            className={cn(
              "h-4 w-4 transition-transform duration-500",
              refreshing && "animate-spin",
            )}
          />
          <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="animate-slide-in" style={{ animationDelay: "300ms" }}>
        <ActivityChart data={dashboardData.activityData} />
      </div>

      {/* System Alerts Section */}
      <div className="animate-slide-in" style={{ animationDelay: "400ms" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="text-1xl sm:text-2xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent"
            style={{ fontFamily: "Poppins" }}
          >
              System Alerts & Updates
            </h2>
            <p
              className="text-sm text-black mt-1"
              style={{ fontFamily: "Inter" }}
            >
              Recent notifications and system status
            </p>
          </div>
        </div>

        {!dashboardData.alerts || dashboardData.alerts.length === 0 ? (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <p
              className="text-gray-600 font-semibold"
              style={{ fontFamily: "Inter" }}
            >
              All systems operational
            </p>
            <p className="text-sm text-gray-500 mt-1">No alerts at this time</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dashboardData.alerts.map((alert, index) => (
              <div
                key={index}
                className="animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <AlertCard {...alert} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
