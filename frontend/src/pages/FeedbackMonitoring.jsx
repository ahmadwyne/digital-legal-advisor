// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Star, MessageSquare, TrendingUp } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';

// const mockFeedback = [
//     {
//         name: 'Ahmed Khan',
//         rating: 5,
//         time: '2 hours ago',
//         category: 'Property Law',
//         comment: 'Very helpful service! Got accurate information about property laws in Pakistan.',
//     },
//     {
//         name: 'Fatima Ali',
//         rating: 4,
//         time: '5 hours ago',
//         category: 'Corporate Law',
//         comment: 'Good response but could be faster. Overall satisfied with the legal advice.',
//     },
//     {
//         name: 'Muhammad Usman',
//         rating: 3,
//         time: '1 day ago',
//         category: 'Tax Law',
//         comment: 'The information was helpful but I needed more details on tax regulations.',
//     },
// ];

// const ratingDistribution = [
//     { stars: 5, percentage: 45, count: 567 },
//     { stars: 4, percentage: 30, count: 378 },
//     { stars: 3, percentage: 15, count: 189 },
//     { stars: 2, percentage: 7, count: 88 },
//     { stars: 1, percentage: 3, count: 38 },
// ];

// export const FeedbackMonitoring = () => {
//     const renderStars = (rating) => {
//         return (
//             <div className="flex gap-0.5">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                         key={star}
//                         className={`h-4 w-4 ${star <= rating ? 'fill-[#FBBF24] text-[#FBBF24]' : 'text-muted-foreground/30'}`}
//                     />
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <div className="space-y-6 sm:space-y-8">
//             {/* Header */}
//             <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Feedback Monitoring</h1>
//                 <p className="text-sm sm:text-base text-muted-foreground mt-1">Track and analyze user feedback to improve the service</p>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                 <Card className="p-4 sm:p-6">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
//                                 Total Feedback
//                             </p>
//                             <h3 className="text-2xl sm:text-3xl font-bold text-foreground">1,247</h3>
//                         </div>
//                         <div className="p-2 sm:p-3 rounded-lg" style={{ backgroundColor: '#DBEAFE' }}>
//                             <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: '#2563EB' }} />
//                         </div>
//                     </div>
//                 </Card>

//                 <Card className="p-4 sm:p-6">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
//                                 Average Rating
//                             </p>
//                             <h3 className="text-2xl sm:text-3xl font-bold text-foreground">4.2</h3>
//                         </div>
//                         <div className="p-2 sm:p-3 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
//                             <Star className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: '#CA8A04' }} />
//                         </div>
//                     </div>
//                 </Card>

//                 <Card className="p-4 sm:p-6">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
//                                 Response Rate
//                             </p>
//                             <h3 className="text-2xl sm:text-3xl font-bold text-foreground">87%</h3>
//                         </div>
//                         <div className="p-2 sm:p-3 rounded-lg" style={{ backgroundColor: '#DCFCE7' }}>
//                             <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: '#22C55E' }} />
//                         </div>
//                     </div>
//                 </Card>
//             </div>

//             {/* Recent Feedback */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="text-lg sm:text-xl">Recent Feedback</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     {mockFeedback.map((feedback, index) => (
//                         <div key={index} className="p-3 sm:p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
//                             <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
//                                 <div>
//                                     <h4 className="font-semibold text-foreground text-sm sm:text-base">{feedback.name}</h4>
//                                     <div className="flex items-center gap-2 mt-1">
//                                         {renderStars(feedback.rating)}
//                                         <span className="text-xs text-muted-foreground">{feedback.time}</span>
//                                     </div>
//                                 </div>
//                                 <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10 text-xs w-fit">
//                                     {feedback.category}
//                                 </Badge>
//                             </div>
//                             <p className="text-xs sm:text-sm text-muted-foreground mt-2">{feedback.comment}</p>
//                         </div>
//                     ))}
//                 </CardContent>
//             </Card>

//             {/* Rating Distribution */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="text-lg sm:text-xl">Rating Distribution</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="space-y-4">
//                         {ratingDistribution.map((item) => (
//                             <div key={item.stars} className="flex items-center gap-2 sm:gap-4">
//                                 <div className="flex items-center gap-1 w-10 sm:w-12">
//                                     <span className="text-xs sm:text-sm font-medium">{item.stars}</span>
//                                     <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-[#FBBF24] text-[#FBBF24]" />
//                                 </div>
//                                 <div className="flex-1">
//                                     <div className="h-5 sm:h-6 bg-muted rounded-full overflow-hidden">
//                                         <div
//                                             className="h-full bg-primary transition-all"
//                                             style={{ width: `${item.percentage}%` }}
//                                         />
//                                     </div>
//                                 </div>
//                                 <span className="text-xs sm:text-sm font-medium text-muted-foreground w-10 sm:w-12 text-right">
//                                     {item.percentage}%
//                                 </span>
//                             </div>
//                         ))}
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>);
// };
// export default FeedbackMonitoring;
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare, TrendingUp, RefreshCw, Filter, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast.js';

/**
 * Mock Feedback Data
 * TODO: Replace with actual API call
 */
const mockFeedback = [
  {
    id: 1,
    name: 'Ahmed Khan',
    rating: 5,
    time: '2 hours ago',
    category: 'Property Law',
    comment: 'Very helpful service! Got accurate information about property laws in Pakistan.',
    avatar: 'AK'
  },
  {
    id: 2,
    name: 'Fatima Ali',
    rating: 4,
    time: '5 hours ago',
    category: 'Corporate Law',
    comment: 'Good response but could be faster. Overall satisfied with the legal advice.',
    avatar: 'FA'
  },
  {
    id: 3,
    name: 'Muhammad Usman',
    rating: 3,
    time: '1 day ago',
    category: 'Tax Law',
    comment: 'The information was helpful but I needed more details on tax regulations.',
    avatar: 'MU'
  },
  {
    id: 4,
    name: 'Sara Ahmed',
    rating: 5,
    time: '2 days ago',
    category: 'Family Law',
    comment: 'Excellent service! Very detailed and accurate legal guidance provided.',
    avatar: 'SA'
  },
  {
    id: 5,
    name: 'Ali Hassan',
    rating: 4,
    time: '3 days ago',
    category: 'Contract Law',
    comment: 'Great platform for getting quick legal advice. Highly recommended!',
    avatar: 'AH'
  },
];

/**
 * Rating Distribution Data
 */
const ratingDistribution = [
  { stars: 5, percentage: 45, count: 567 },
  { stars: 4, percentage: 30, count: 378 },
  { stars: 3, percentage: 15, count: 189 },
  { stars: 2, percentage: 7, count: 88 },
  { stars: 1, percentage: 3, count: 38 },
];

/**
 * FeedbackMonitoring Component
 * Admin interface for monitoring and analyzing user feedback
 * 
 * Features:
 * - Feedback statistics overview
 * - Recent feedback list with filtering
 * - Rating distribution visualization
 * - Responsive design
 * - Theme-matched styling
 * 
 * Optimizations:
 * - Memoized calculations
 * - Efficient rendering
 * - Loading states
 * - Smooth animations
 */
export const FeedbackMonitoring = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [filterRating, setFilterRating] = useState('all');

  /**
   * Render star rating display
   * Memoized to prevent recalculation
   */
  const renderStars = useMemo(() => (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4 transition-all duration-300",
              star <= rating 
                ? 'fill-amber-400 text-amber-400' 
                : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  }, []);

  /**
   * Calculate total feedback count
   */
  const totalFeedback = useMemo(() => {
    return ratingDistribution.reduce((sum, item) => sum + item.count, 0);
  }, []);

  /**
   * Calculate average rating
   */
  const averageRating = useMemo(() => {
    const totalScore = ratingDistribution.reduce(
      (sum, item) => sum + item.stars * item.count, 
      0
    );
    return (totalScore / totalFeedback).toFixed(1);
  }, [totalFeedback]);

  /**
   * Handle refresh action
   */
  const handleRefresh = async () => {
    setLoading(true);
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    toast({
      variant: 'success',
      title: 'Refreshed',
      description: 'Feedback data updated',
    });
  };

  /**
   * Get rating color
   */
  const getRatingColor = (rating) => {
    if (rating >= 4) return 'from-green-500 to-emerald-500';
    if (rating >= 3) return 'from-amber-500 to-yellow-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 
            className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent" 
            style={{ fontFamily: "Poppins" }}
          >
            Feedback Monitoring
          </h1>
          <p 
            className="text-sm sm:text-base text-gray-600 mt-2 font-medium" 
            style={{ fontFamily: "Inter" }}
          >
            Track and analyze user feedback to improve the service
          </p>
        </div>
        
        {/* Refresh Button */}
        <Button
          onClick={handleRefresh}
          disabled={loading}
          className="w-fit group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          style={{ fontFamily: "Inter" }}
        >
          <RefreshCw className={cn(
            "h-4 w-4 transition-transform duration-500",
            loading && "animate-spin"
          )} />
          <span>{loading ? 'Loading...' : 'Refresh'}</span>
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
                style={{ fontFamily: "Inter" }}
              >
                Total Feedback
              </p>
              <h3 
                className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent" 
                style={{ fontFamily: "Poppins" }}
              >
                {totalFeedback.toLocaleString()}
              </h3>
              <p className="text-xs text-gray-500 mt-2 font-semibold">
                <span className="text-green-600">+12.5%</span> from last month
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
                style={{ fontFamily: "Inter" }}
              >
                Average Rating
              </p>
              <div className="flex items-baseline gap-2">
                <h3 
                  className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent" 
                  style={{ fontFamily: "Poppins" }}
                >
                  {averageRating}
                </h3>
                <span className="text-gray-500 font-semibold text-sm">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {renderStars(Math.round(parseFloat(averageRating)))}
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
                style={{ fontFamily: "Inter" }}
              >
                Response Rate
              </p>
              <h3 
                className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent" 
                style={{ fontFamily: "Poppins" }}
              >
                87%
              </h3>
              <p className="text-xs text-gray-500 mt-2 font-semibold">
                <span className="text-green-600">+5.2%</span> improvement
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
              style={{ fontFamily: "Poppins" }}
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
          {mockFeedback.map((feedback, index) => (
            <div 
              key={feedback.id} 
              className="group p-4 rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:from-blue-100/50 hover:to-indigo-100/50 animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                
                {/* Avatar */}
                <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {feedback.avatar}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div>
                      <h4 
                        className="font-bold text-gray-800 text-base" 
                        style={{ fontFamily: "Poppins" }}
                      >
                        {feedback.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(feedback.rating)}
                        <span className="text-xs text-gray-500 font-medium">{feedback.time}</span>
                      </div>
                    </div>
                    
                    {/* Category Badge */}
                    <Badge 
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-2 border-blue-200 font-bold w-fit"
                      style={{ fontFamily: "Inter" }}
                    >
                      {feedback.category}
                    </Badge>
                  </div>
                  
                  {/* Comment */}
                  <p 
                    className="text-sm text-gray-600 leading-relaxed mt-2" 
                    style={{ fontFamily: "Inter" }}
                  >
                    {feedback.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rating Distribution Section */}
      <Card className="border-2 border-blue-100 shadow-lg animate-slide-in" style={{ animationDelay: '400ms' }}>
        <CardHeader className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b-2 border-blue-100">
          <CardTitle 
            className="text-xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent" 
            style={{ fontFamily: "Poppins" }}
          >
            Rating Distribution
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: "Inter" }}>
            How users rate our service
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            {ratingDistribution.map((item, index) => (
              <div 
                key={item.stars} 
                className="flex items-center gap-4 group animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Star Label */}
                <div className="flex items-center gap-1.5 w-16">
                  <span 
                    className="text-sm font-bold text-gray-700" 
                    style={{ fontFamily: "Inter" }}
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
                        "h-full bg-gradient-to-r transition-all duration-1000 ease-out group-hover:opacity-80",
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
                    <span className="text-xs font-bold text-gray-700" style={{ fontFamily: "Inter" }}>
                      {item.count} reviews
                    </span>
                  </div>
                </div>
                
                {/* Percentage */}
                <span 
                  className="text-sm font-bold text-gray-700 w-14 text-right" 
                  style={{ fontFamily: "Inter" }}
                >
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="mt-6 pt-6 border-t-2 border-blue-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-semibold" style={{ fontFamily: "Inter" }}>
                Total Reviews
              </span>
              <span className="text-blue-700 font-black text-lg" style={{ fontFamily: "Poppins" }}>
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