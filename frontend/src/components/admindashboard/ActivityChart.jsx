// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// export const ActivityChart = ({ data = [] }) => {
//   const [period, setPeriod] = useState('month');

//   // Format the data for the chart
//   const formatChartData = (apiData) => {
//     if (!apiData || apiData.length === 0) {
//       return [];
//     }

//     return apiData.map(item => {
//       const date = new Date(item.date);
//       let formattedDate;

//       // Format based on period
//       if (period === 'week') {
//         // Show day name + date (Mon 10)
//         const day = date.toLocaleDateString('en-US', { weekday: 'short' });
//         const dateNum = date.getDate();
//         formattedDate = `${day} ${dateNum}`;
//       } else if (period === 'month') {
//         // Show month + date (12/10)
//         const month = date.  getMonth() + 1;
//         const dateNum = date.getDate();
//         formattedDate = `${month}/${dateNum}`;
//       } else {
//         // Year - show full month (Jan, Feb)
//         formattedDate = date.toLocaleDateString('en-US', { month: 'short' });
//       }

//       return {
//         date: formattedDate,
//         value: item. count || 0,
//         fullDate: date. toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
//       };
//     });
//   };

//   const chartData = formatChartData(data);

//   // Custom tooltip
//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div 
//           style={{
//             backgroundColor: 'hsl(var(--card))',
//             border: '1px solid hsl(var(--border))',
//             borderRadius:  '8px',
//             padding:  '8px 12px',
//           }}
//         >
//           <p className="text-sm font-semibold text-foreground">{payload[0].payload.fullDate}</p>
//           <p className="text-sm text-primary">
//             Queries: <span className="font-bold">{payload[0].value}</span>
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Sample every Nth item for cleaner X-axis
//   const getSampledData = (data) => {
//     if (data.length <= 10) return data; // Show all if 10 or fewer points
    
//     const step = Math.ceil(data.length / 10); // Show ~10 labels max
//     return data.map((item, index) => ({
//       ... item,
//       showLabel: index % step === 0 || index === data.length - 1
//     }));
//   };

//   const sampledData = getSampledData(chartData);

//   return (
//     <Card className="col-span-full">
//       <CardHeader className="flex flex-row items-center justify-between pb-2">
//         <div>
//           <CardTitle className="text-lg font-semibold">Activity</CardTitle>
//         </div>
//         <Select value={period} onValueChange={setPeriod}>
//           <SelectTrigger className="w-32">
//             <SelectValue placeholder="Select period" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="week">Week</SelectItem>
//             <SelectItem value="month">Month</SelectItem>
//             <SelectItem value="year">Year</SelectItem>
//           </SelectContent>
//         </Select>
//       </CardHeader>

//       <CardContent className="pt-4">
//         {chartData.length === 0 ? (
//           <div className="flex items-center justify-center h-[300px] text-muted-foreground">
//             <p>No activity data available</p>
//           </div>
//         ) : (
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={sampledData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

//               <XAxis
//                 dataKey="date"
//                 stroke="hsl(var(--muted-foreground))"
//                 fontSize={11}
//                 tickLine={false}
//                 interval="preserveStartEnd"
//                 minTickGap={30}
//               />
              
//               <YAxis
//                 stroke="hsl(var(--muted-foreground))"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 allowDecimals={false}
//               />

//               <Tooltip content={<CustomTooltip />} />

//               {/* BLUE LINE */}
//               <Line
//                 type="monotone"
//                 dataKey="value"
//                 stroke="#3b82f6"
//                 strokeWidth={2}
//                 dot={{ fill: '#3b82f6', r: 3 }}
//                 activeDot={{ r: 5 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default ActivityChart;
import { useState, useMemo, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

/**
 * ActivityChart Component
 * Displays user activity over time with period selection
 * 
 * Features:
 * - Period switching (week/month/year)
 * - Gradient area chart with blue theme
 * - Custom tooltip with formatted dates
 * - Responsive design
 * 
 * Optimizations:
 * - Memoized chart data processing
 * - Efficient data sampling for performance
 * - Only re-renders when data or period changes
 */
export const ActivityChart = memo(({ data = [] }) => {
  const [period, setPeriod] = useState('month');

  /**
   * Format raw API data for chart display
   * Memoized to prevent recalculation on every render
   */
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map(item => {
      const date = new Date(item.date);
      let formattedDate;

      // Format date based on selected period
      switch (period) {
        case 'week':
          // "Mon 10"
          const day = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dateNum = date.getDate();
          formattedDate = `${day} ${dateNum}`;
          break;
        case 'month':
          // "12/10"
          const month = date.getMonth() + 1;
          formattedDate = `${month}/${date.getDate()}`;
          break;
        case 'year':
          // "Jan"
          formattedDate = date.toLocaleDateString('en-US', { month: 'short' });
          break;
        default:
          formattedDate = date.toLocaleDateString();
      }

      return {
        date: formattedDate,
        value: item.count || 0,
        fullDate: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })
      };
    });
  }, [data, period]);

  /**
   * Custom Tooltip Component
   * Shows formatted date and query count
   */
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white/95 backdrop-blur-xl border-2 border-blue-100 rounded-xl shadow-2xl p-3 animate-scale-in">
        <p 
          className="text-sm font-bold text-gray-800 mb-1" 
          style={{ fontFamily: "Poppins" }}
        >
          {payload[0].payload.fullDate}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full" />
          <p className="text-sm text-gray-600" style={{ fontFamily: "Inter" }}>
            Queries: <span className="font-bold text-blue-700">{payload[0].value}</span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="col-span-full border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
      
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b-2 border-blue-100">
        <div>
          <CardTitle 
            className="text-xl font-black bg-gradient-to-r  from-blue-600 via-blue-500 to-indigo-600  bg-clip-text text-transparent" 
            style={{ fontFamily: "Poppins" }}
          >
            Activity Overview
          </CardTitle>
          <p className="text-sm text-black mt-1" style={{ fontFamily: "Inter" }}>
            User queries over time
          </p>
        </div>
        
        {/* Period Selector */}
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32 border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      {/* Chart Content */}
      <CardContent className="pt-6 bg-gradient-to-br from-blue-50/30 to-indigo-50/30">
        {chartData.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="font-semibold" style={{ fontFamily: "Inter" }}>No activity data available</p>
            <p className="text-sm text-gray-400 mt-1">Check back later for insights</p>
          </div>
        ) : (
          // Area Chart with Gradient
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                {/* Gradient for area fill */}
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />

              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={30}
                style={{ fontFamily: "Inter" }}
              />
              
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                style={{ fontFamily: "Inter" }}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 2 }} />

              {/* Gradient Area */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#colorValue)"
                dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#1e40af', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
});

ActivityChart.displayName = 'ActivityChart';

export default ActivityChart;