const { User, Query, ActivityLog, Dataset, sequelize } = require('../models');
const { Op } = require('sequelize');

class AdminService {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      // Total users count
      const totalUsers = await User.count({
        where: { isActive: true }
      });

      // Active sessions (users logged in within last 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const activeSessions = await User.count({
        where: {
          lastLogin: {
            [Op.gte]: twentyFourHoursAgo
          },
          isActive: true
        }
      });

      // Dataset usage calculation
      const totalDatasets = await Dataset.count({ where: { isDeleted: false } });
      const usedDatasets = await Dataset.count({
        where: {
          isDeleted: false,
          queryCount: {
            [Op.gt]: 0
          }
        }
      });
      const datasetUsagePercentage = totalDatasets > 0 
        ? ((usedDatasets / totalDatasets) * 100).toFixed(1)
        : 0;

      // Calculate trends (compare with previous period)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

      // User growth
      const usersLastMonth = await User.count({
        where: {
          createdAt: {
            [Op.gte]: thirtyDaysAgo
          }
        }
      });
      const usersPreviousMonth = await User.count({
        where: {
          createdAt: {
            [Op.between]: [sixtyDaysAgo, thirtyDaysAgo]
          }
        }
      });
      const userGrowth = usersPreviousMonth > 0
        ? (((usersLastMonth - usersPreviousMonth) / usersPreviousMonth) * 100).toFixed(1)
        : 0;

      // Active sessions trend (yesterday vs today)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      const activeYesterday = await User.count({
        where: {
          lastLogin: {
            [Op. between]: [twoDaysAgo, yesterday]
          }
        }
      });
      const sessionGrowth = activeYesterday > 0
        ? (((activeSessions - activeYesterday) / activeYesterday) * 100).toFixed(1)
        : 0;

      // Dataset usage trend (this week vs last week)
      const usageThisWeek = await Dataset.sum('queryCount', {
        where: {
          updatedAt: {
            [Op.gte]: sevenDaysAgo
          }
        }
      }) || 0;

      const usageTwoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const usageLastWeek = await Dataset.sum('queryCount', {
        where: {
          updatedAt: {
            [Op.between]: [usageTwoWeeksAgo, sevenDaysAgo]
          }
        }
      }) || 0;

      const datasetTrend = usageLastWeek > 0
        ? (((usageThisWeek - usageLastWeek) / usageLastWeek) * 100).toFixed(1)
        : 0;

      return {
        totalUsers,
        userGrowth:  `${userGrowth > 0 ? '+' : ''}${userGrowth}% from last month`,
        activeSessions,
        sessionGrowth: `${sessionGrowth > 0 ? '+' :  ''}${sessionGrowth}% from yesterday`,
        datasetUsage: `${datasetUsagePercentage}%`,
        datasetTrend: `${datasetTrend > 0 ? '+' : ''}${datasetTrend}% from last week`
      };
    } catch (error) {
      throw new Error(`Error fetching dashboard stats: ${error.message}`);
    }
  }

  // Get activity chart data (queries over time)
  async getActivityChartData(period = 'month') {
    try {
      let groupBy;
      let dateFormat;
      let startDate;

      switch (period) {
        case 'week':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          dateFormat = '%Y-%m-%d';
          groupBy = sequelize.fn('DATE_TRUNC', 'day', sequelize.col('createdAt'));
          break;
        case 'month':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          dateFormat = '%Y-%m-%d';
          groupBy = sequelize.fn('DATE_TRUNC', 'day', sequelize.col('createdAt'));
          break;
        case 'year': 
          startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
          dateFormat = '%Y-%m';
          groupBy = sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'));
          break;
        default:
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          dateFormat = '%Y-%m-%d';
          groupBy = sequelize.fn('DATE_TRUNC', 'day', sequelize.col('createdAt'));
      }

      const activityData = await Query.findAll({
        attributes: [
          [groupBy, 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: {
          createdAt: {
            [Op. gte]: startDate
          }
        },
        group: [groupBy],
        order: [[groupBy, 'ASC']],
        raw: true
      });

      return activityData.map(item => ({
        date: item.date,
        count: parseInt(item.count)
      }));
    } catch (error) {
      throw new Error(`Error fetching activity chart data: ${error.message}`);
    }
  }

  // Get system alerts
  async getSystemAlerts(limit = 10) {
    try {
      const alerts = await ActivityLog.findAll({
        where: {
          severity: {
            [Op.in]: ['warning', 'error', 'info', 'success']
          }
        },
        order: [['createdAt', 'DESC']],
        limit,
        include: [{
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email']
        }]
      });

      return alerts. map(alert => ({
        type: alert.severity,
        title: alert.eventType,
        description: alert.details,
        time: this.getTimeAgo(alert.createdAt),
        user: alert. user ? `${alert.user.firstName} ${alert.user.lastName}` : 'System'
      }));
    } catch (error) {
      throw new Error(`Error fetching system alerts: ${error.message}`);
    }
  }

  // Helper:  Get time ago string
  getTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week:  604800,
      day:  86400,
      hour:  3600,
      minute:  60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    
    return 'Just now';
  }
}

module.exports = new AdminService();