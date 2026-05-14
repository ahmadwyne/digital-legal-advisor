import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare, TrendingUp, RefreshCw, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast.js';
import { adminApi } from '@/api/adminApi';
import LogoSpinner from '@/components/ui/LogoSpinner';

const EMPTY_DISTRIBUTION = [
  { stars: 5, percentage: 0, count: 0 },
  { stars: 4, percentage: 0, count: 0 },
  { stars: 3, percentage: 0, count: 0 },
  { stars: 2, percentage: 0, count: 0 },
  { stars: 1, percentage: 0, count: 0 },
];

const buildInitials = (name) => {
  if (!name) return 'NA';
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const formatTrend = (value) => {
  if (!Number.isFinite(value)) return '0%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

const formatTimeAgo = (dateInput) => {
  if (!dateInput) return 'Just now';
  const seconds = Math.floor((Date.now() - new Date(dateInput).getTime()) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count === 1 ? '' : 's'} ago`;
    }
  }

  return 'Just now';
};

/**
 * FeedbackMonitoring Component
 * Admin interface for monitoring and analyzing user feedback
 */
export const FeedbackMonitoring = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    stats: null,
    distribution: EMPTY_DISTRIBUTION,
    recent: []
  });

  const renderStars = useMemo(() => (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'h-4 w-4 transition-all duration-300',
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  }, []);

  const fetchFeedbackData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await adminApi.getFeedbackOverview(10);

      if (response.success) {
        setFeedbackData(response.data);

        if (isRefresh) {
          toast({
            variant: 'success',
            title: 'Refreshed',
            description: 'Feedback data updated',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load feedback data. Please try again.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const distribution = feedbackData.distribution?.length
    ? feedbackData.distribution
    : EMPTY_DISTRIBUTION;

  const totalFeedback = feedbackData.stats?.totalFeedback ?? 0;
  const averageRatingValue = feedbackData.stats?.averageRating ?? 0;
  const averageRating = Number.isFinite(averageRatingValue)
    ? averageRatingValue.toFixed(1)
    : '0.0';
  const responseRate = feedbackData.stats?.responseRate ?? 0;
  const totalFeedbackTrend = feedbackData.stats?.totalFeedbackTrend ?? 0;
  const responseRateTrend = feedbackData.stats?.responseRateTrend ?? 0;
  const recentFeedback = feedbackData.recent || [];

  const handleRefresh = () => {
    fetchFeedbackData(true);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'from-green-500 to-emerald-500';
    if (rating >= 3) return 'from-amber-500 to-yellow-500';
    return 'from-red-500 to-rose-500';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <LogoSpinner size={64} />
        <p className="text-gray-600 font-semibold" style={{ fontFamily: 'Inter' }}>
          Loading feedback...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent"
            style={{ fontFamily: 'Poppins' }}
          >
            Feedback Monitoring
          </h1>
          <p
            className="text-sm sm:text-base text-gray-600 mt-2 font-medium"
            style={{ fontFamily: 'Inter' }}
          >
            Track and analyze user feedback to improve the service
          </p>
        </div>

        {/* Refresh Button */}
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="w-fit group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          style={{ fontFamily: 'Inter' }}
        >
          <RefreshCw
            className={cn(
              'h-4 w-4 transition-transform duration-500',
              refreshing && 'animate-spin'
            )}
          />
          <span>{refreshing ? 'Loading...' : 'Refresh'}</span>
        </Button>
      </div>

      {/* Stats Grid - Enhanced with animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Feedback Card */}
        <Card className="group relative overflow-hidden p-6 border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 animate-slide-in">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex items-center justify-between">
            <div>
              <p
                className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2"
                style={{ fontFamily: 'Inter' }}
              >
                Total Feedback
              </p>
              <h3
                className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
                style={{ fontFamily: 'Poppins' }}
              >
                {totalFeedback.toLocaleString()}
              </h3>
              <p className="text-xs text-gray-500 mt-2 font-semibold">
                <span className={totalFeedbackTrend >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatTrend(totalFeedbackTrend)}
                </span>{' '}
                from last month
              </p>
            </div>

            <div className="relative p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <MessageSquare className="h-6 w-6 text-white" strokeWidth={2.5} />
              <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
            </div>
          </div>
        </Card>

        {/* Average Rating Card */}
        <Card className="group relative overflow-hidden p-6 border-2 border-amber-100 hover:border-amber-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/30 animate-slide-in" style={{ animationDelay: '100ms' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex items-center justify-between">
            <div>
              <p
                className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2"
                style={{ fontFamily: 'Inter' }}
              >
                Average Rating
              </p>
              <div className="flex items-baseline gap-2">
                <h3
                  className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent"
                  style={{ fontFamily: 'Poppins' }}
                >
                  {averageRating}
                </h3>
                <span className="text-gray-500 font-semibold text-sm">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {renderStars(Math.round(averageRatingValue))}
              </div>
            </div>

            <div className="relative p-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <Star className="h-6 w-6 text-white fill-white" strokeWidth={2.5} />
              <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
            </div>
          </div>
        </Card>

        {/* Response Rate Card */}
        <Card className="group relative overflow-hidden p-6 border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 animate-slide-in" style={{ animationDelay: '200ms' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex items-center justify-between">
            <div>
              <p
                className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2"
                style={{ fontFamily: 'Inter' }}
              >
                Response Rate
              </p>
              <h3
                className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                style={{ fontFamily: 'Poppins' }}
              >
                {Math.round(responseRate)}%
              </h3>
              <p className="text-xs text-gray-500 mt-2 font-semibold">
                <span className={responseRateTrend >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatTrend(responseRateTrend)}
                </span>{' '}
                improvement
              </p>
            </div>

            <div className="relative p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <TrendingUp className="h-6 w-6 text-white" strokeWidth={2.5} />
              <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Feedback Section */}
      <Card className="border-2 border-blue-100 shadow-lg animate-slide-in" style={{ animationDelay: '300ms' }}>
        <CardHeader className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b-2 border-blue-100">
          <div className="flex items-center justify-between">
            <CardTitle
              className="text-xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
              style={{ fontFamily: 'Poppins' }}
            >
              Recent Feedback
            </CardTitle>

            {/* Filter Button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-2 border-blue-200 hover:bg-blue-50 transition-all"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {recentFeedback.length === 0 ? (
            <div className="text-center text-gray-600 font-semibold" style={{ fontFamily: 'Inter' }}>
              No feedback available yet.
            </div>
          ) : (
            recentFeedback.map((feedback, index) => {
              const name = feedback.userName || 'Anonymous';
              const avatar = buildInitials(name);
              const timeLabel = feedback.timeAgo || formatTimeAgo(feedback.createdAt);
              const commentText = feedback.comment || feedback.searchQuery || 'No comment provided.';
              const categoryLabel = feedback.category || feedback.source || 'Feedback';

              return (
                <div
                  key={feedback.id}
                  className="group p-4 rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:from-blue-100/50 hover:to-indigo-100/50 animate-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {avatar}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div>
                          <h4
                            className="font-bold text-gray-800 text-base"
                            style={{ fontFamily: 'Poppins' }}
                          >
                            {name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(feedback.rating || 0)}
                            <span className="text-xs text-gray-500 font-medium">{timeLabel}</span>
                          </div>
                        </div>

                        {/* Category Badge */}
                        <Badge
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-2 border-blue-200 font-bold w-fit"
                          style={{ fontFamily: 'Inter' }}
                        >
                          {categoryLabel}
                        </Badge>
                      </div>

                      {/* Comment */}
                      <p
                        className="text-sm text-gray-600 leading-relaxed mt-2"
                        style={{ fontFamily: 'Inter' }}
                      >
                        {commentText}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Rating Distribution Section */}
      <Card className="border-2 border-blue-100 shadow-lg animate-slide-in" style={{ animationDelay: '400ms' }}>
        <CardHeader className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b-2 border-blue-100">
          <CardTitle
            className="text-xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
            style={{ fontFamily: 'Poppins' }}
          >
            Rating Distribution
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Inter' }}>
            How users rate our service
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            {distribution.map((item, index) => (
              <div
                key={item.stars}
                className="flex items-center gap-4 group animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Star Label */}
                <div className="flex items-center gap-1.5 w-16">
                  <span
                    className="text-sm font-bold text-gray-700"
                    style={{ fontFamily: 'Inter' }}
                  >
                    {item.stars}
                  </span>
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </div>

                {/* Progress Bar */}
                <div className="flex-1 relative">
                  <div className="h-8 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                    <div
                      className={cn(
                        'h-full bg-gradient-to-r transition-all duration-1000 ease-out group-hover:opacity-80',
                        getRatingColor(item.stars)
                      )}
                      style={{
                        width: `${item.percentage}%`,
                        transitionDelay: `${index * 100}ms`
                      }}
                    />
                  </div>

                  {/* Count Label Inside Bar */}
                  <div className="absolute inset-0 flex items-center px-3">
                    <span className="text-xs font-bold text-gray-700" style={{ fontFamily: 'Inter' }}>
                      {item.count} reviews
                    </span>
                  </div>
                </div>

                {/* Percentage */}
                <span
                  className="text-sm font-bold text-gray-700 w-14 text-right"
                  style={{ fontFamily: 'Inter' }}
                >
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-6 border-t-2 border-blue-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-semibold" style={{ fontFamily: 'Inter' }}>
                Total Reviews
              </span>
              <span className="text-blue-700 font-black text-lg" style={{ fontFamily: 'Poppins' }}>
                {totalFeedback.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackMonitoring;
