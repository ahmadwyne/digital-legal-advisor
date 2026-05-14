const {
  User,
  Query,
  ActivityLog,
  Dataset,
  Feedback,
  PrecedentFeedback,
  DocumentSummaryFeedback,
  Response,
  PrecedentSearch,
  DocumentSummary,
  sequelize
} = require('../models');
const { Op } = require('sequelize');

const MAX_FEEDBACK_LIMIT = 50;

const normalizeLimit = (limit) => {
  const value = Number(limit);
  if (!Number.isFinite(value) || value <= 0) return 10;
  return Math.min(value, MAX_FEEDBACK_LIMIT);
};

const formatCategory = (value) => {
  if (!value) return 'Chatbot';
  return String(value)
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const mapRatingToStars = (source, rating) => {
  if (source === 'precedent') {
    return rating === 'helpful' ? 5 : 1;
  }

  if (source === 'chat' || source === 'summarizer') {
    return rating === 'like' ? 5 : 1;
  }

  return 3;
};

const calculateTrendPercent = (current, previous) => {
  if (!previous) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

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

  // Get feedback overview data
  async getFeedbackOverview({ limit = 10 } = {}) {
    try {
      const safeLimit = normalizeLimit(limit);

      const [chatFeedback, precedentFeedback, summaryFeedback] = await Promise.all([
        Feedback.findAll({
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName']
            },
            {
              model: Response,
              as: 'response',
              attributes: ['id'],
              include: [
                {
                  model: Query,
                  as: 'query',
                  attributes: ['queryType']
                }
              ]
            }
          ],
          order: [['createdAt', 'DESC']],
          limit: safeLimit
        }),
        PrecedentFeedback.findAll({
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName']
            },
            {
              model: PrecedentSearch,
              as: 'search',
              attributes: ['id', 'query']
            }
          ],
          order: [['createdAt', 'DESC']],
          limit: safeLimit
        }),
        DocumentSummaryFeedback.findAll({
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName']
            }
          ],
          order: [['createdAt', 'DESC']],
          limit: safeLimit
        })
      ]);

      const recent = [
        ...chatFeedback.map((fb) => ({
          id: fb.id,
          source: 'chat',
          category: formatCategory(fb.response?.query?.queryType),
          rating: mapRatingToStars('chat', fb.rating),
          rawRating: fb.rating,
          comment: fb.comment || null,
          createdAt: fb.createdAt,
          user: fb.user
            ? { id: fb.user.id, firstName: fb.user.firstName, lastName: fb.user.lastName }
            : null,
          userName: fb.user ? `${fb.user.firstName} ${fb.user.lastName}`.trim() : 'Anonymous'
        })),
        ...precedentFeedback.map((fb) => ({
          id: fb.id,
          source: 'precedent',
          category: 'Legal Precedent',
          rating: mapRatingToStars('precedent', fb.rating),
          rawRating: fb.rating,
          comment: fb.comment || null,
          createdAt: fb.createdAt,
          searchQuery: fb.search?.query || null,
          user: fb.user
            ? { id: fb.user.id, firstName: fb.user.firstName, lastName: fb.user.lastName }
            : null,
          userName: fb.user ? `${fb.user.firstName} ${fb.user.lastName}`.trim() : 'Anonymous'
        })),
        ...summaryFeedback.map((fb) => ({
          id: fb.id,
          source: 'summarizer',
          category: 'Document Summarizer',
          rating: mapRatingToStars('summarizer', fb.rating),
          rawRating: fb.rating,
          comment: fb.comment || fb.summarySnippet || null,
          createdAt: fb.createdAt,
          documentName: fb.documentName || null,
          user: fb.user
            ? { id: fb.user.id, firstName: fb.user.firstName, lastName: fb.user.lastName }
            : null,
          userName: fb.user ? `${fb.user.firstName} ${fb.user.lastName}`.trim() : 'Anonymous'
        }))
      ]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, safeLimit)
        .map((item) => ({
          ...item,
          timeAgo: this.getTimeAgo(item.createdAt)
        }));

      const [
        chatRatingCounts,
        precedentRatingCounts,
        summaryRatingCounts,
        chatFeedbackCount,
        precedentFeedbackCount,
        summaryFeedbackCount,
        chatResponsesCount,
        precedentSearchCount,
        summaryCount
      ] = await Promise.all([
        Feedback.findAll({
          attributes: ['rating', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
          group: ['rating'],
          raw: true
        }),
        PrecedentFeedback.findAll({
          attributes: ['rating', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
          group: ['rating'],
          raw: true
        }),
        DocumentSummaryFeedback.findAll({
          attributes: ['rating', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
          group: ['rating'],
          raw: true
        }),
        Feedback.count(),
        PrecedentFeedback.count(),
        DocumentSummaryFeedback.count(),
        Response.count(),
        PrecedentSearch.count(),
        DocumentSummary.count()
      ]);

      const ratingBuckets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      const addCounts = (rows, source) => {
        rows.forEach(({ rating, count }) => {
          const stars = mapRatingToStars(source, rating);
          ratingBuckets[stars] += Number(count) || 0;
        });
      };

      addCounts(chatRatingCounts, 'chat');
      addCounts(precedentRatingCounts, 'precedent');
      addCounts(summaryRatingCounts, 'summarizer');

      const totalFeedback =
        chatFeedbackCount + precedentFeedbackCount + summaryFeedbackCount;

      const totalScore = Object.entries(ratingBuckets)
        .reduce((sum, [stars, count]) => sum + Number(stars) * count, 0);

      const averageRating = totalFeedback
        ? Number((totalScore / totalFeedback).toFixed(1))
        : 0;

      const totalInteractions =
        chatResponsesCount + precedentSearchCount + summaryCount;

      const responseRate = totalInteractions
        ? Number(((totalFeedback / totalInteractions) * 100).toFixed(1))
        : 0;

      const distribution = [5, 4, 3, 2, 1].map((stars) => {
        const count = ratingBuckets[stars] || 0;
        const percentage = totalFeedback
          ? Math.round((count / totalFeedback) * 100)
          : 0;
        return { stars, count, percentage };
      });

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const [
        chatFeedbackLast30,
        precedentFeedbackLast30,
        summaryFeedbackLast30,
        chatFeedbackPrev30,
        precedentFeedbackPrev30,
        summaryFeedbackPrev30,
        chatResponsesLast30,
        precedentSearchLast30,
        summaryLast30,
        chatResponsesPrev30,
        precedentSearchPrev30,
        summaryPrev30
      ] = await Promise.all([
        Feedback.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
        PrecedentFeedback.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
        DocumentSummaryFeedback.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
        Feedback.count({ where: { createdAt: { [Op.between]: [sixtyDaysAgo, thirtyDaysAgo] } } }),
        PrecedentFeedback.count({ where: { createdAt: { [Op.between]: [sixtyDaysAgo, thirtyDaysAgo] } } }),
        DocumentSummaryFeedback.count({ where: { createdAt: { [Op.between]: [sixtyDaysAgo, thirtyDaysAgo] } } }),
        Response.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
        PrecedentSearch.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
        DocumentSummary.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
        Response.count({ where: { createdAt: { [Op.between]: [sixtyDaysAgo, thirtyDaysAgo] } } }),
        PrecedentSearch.count({ where: { createdAt: { [Op.between]: [sixtyDaysAgo, thirtyDaysAgo] } } }),
        DocumentSummary.count({ where: { createdAt: { [Op.between]: [sixtyDaysAgo, thirtyDaysAgo] } } })
      ]);

      const feedbackLast30 =
        chatFeedbackLast30 + precedentFeedbackLast30 + summaryFeedbackLast30;
      const feedbackPrev30 =
        chatFeedbackPrev30 + precedentFeedbackPrev30 + summaryFeedbackPrev30;

      const interactionsLast30 =
        chatResponsesLast30 + precedentSearchLast30 + summaryLast30;
      const interactionsPrev30 =
        chatResponsesPrev30 + precedentSearchPrev30 + summaryPrev30;

      const responseRateLast30 = interactionsLast30
        ? (feedbackLast30 / interactionsLast30) * 100
        : 0;
      const responseRatePrev30 = interactionsPrev30
        ? (feedbackPrev30 / interactionsPrev30) * 100
        : 0;

      return {
        stats: {
          totalFeedback,
          totalFeedbackTrend: calculateTrendPercent(feedbackLast30, feedbackPrev30),
          averageRating,
          responseRate,
          responseRateTrend: calculateTrendPercent(responseRateLast30, responseRatePrev30)
        },
        distribution,
        recent
      };
    } catch (error) {
      throw new Error(`Error fetching feedback overview: ${error.message}`);
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