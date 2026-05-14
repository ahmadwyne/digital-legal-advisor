const adminService = require('../services/adminService');

class AdminController {
  // Get dashboard data
  async getDashboard(req, res, next) {
    try {
      const [stats, activityData, alerts] = await Promise.all([
        adminService. getDashboardStats(),
        adminService.getActivityChartData('month'),
        adminService.getSystemAlerts(5)
      ]);

      res.status(200).json({
        success: true,
        data: {
          stats,
          activityData,
          alerts
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get stats only
  async getStats(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Get activity chart data
  async getActivityChart(req, res, next) {
    try {
      const { period = 'month' } = req. query;
      const activityData = await adminService.getActivityChartData(period);
      
      res.status(200).json({
        success: true,
        data: activityData
      });
    } catch (error) {
      next(error);
    }
  }

  // Get system alerts
  async getAlerts(req, res, next) {
    try {
      const { limit = 10 } = req.query;
      const alerts = await adminService.getSystemAlerts(parseInt(limit));
      
      res.status(200).json({
        success: true,
        data: alerts
      });
    } catch (error) {
      next(error);
    }
  }

  // Get feedback monitoring overview
  async getFeedbackOverview(req, res, next) {
    try {
      const { limit = 10 } = req.query;
      const feedback = await adminService.getFeedbackOverview({
        limit: parseInt(limit)
      });

      res.status(200).json({
        success: true,
        data: feedback
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();