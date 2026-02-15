// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from '@/components/ui/table';
// import { Upload, Pencil, Trash2 } from 'lucide-react';

// const mockDatasets = [
//     {
//         title: 'Financial Regulations 2023',
//         description: 'Comprehensive dataset of financial regulations...',
//         lastUpdated: 'May 15, 2023',
//         status: 'Active',
//     },
//     {
//         title: 'Corporate Tax Law Cases',
//         description: 'Collection of landmark corporate tax law...',
//         lastUpdated: 'Apr 28, 2023',
//         status: 'Active',
//     },
//     {
//         title: 'Banking Statutes Update',
//         description: 'Updated banking statutes including rec...',
//         lastUpdated: 'May 22, 2023',
//         status: 'Pending',
//     },
//     {
//         title: 'Securities Law Compilation',
//         description: 'Compilation of securities law with annot...',
//         lastUpdated: 'May 10, 2023',
//         status: 'Error',
//     },
//     {
//         title: 'International Trade Regulations',
//         description: 'Dataset covering international trade reg...',
//         lastUpdated: 'May 18, 2023',
//         status: 'Active',
//     },
// ];

// const validationStats = [
//     { label: 'Validated Datasets', value: 42, color: 'border-success' },
//     { label: 'Pending Validation', value: 7, color: 'border-warning' },
//     { label: 'Validation Errors', value: 3, color: 'border-error' },
//     { label: 'Total Datasets', value: 52, color: 'border-foreground' },
// ];

// export const ManageDatasets = () => {
//     const handleAction = (action, dataset) => {
//         console.log(`${action} dataset:`, dataset);
//     };

//     const getStatusColor = (status) => {
//         switch (status) {
//             case "Active":
//                 return "text-[#2C7A3E]";
//             case "Pending":
//                 return "text-[#D19A00]";
//             case "Error":
//                 return "text-[#D12A2A]";
//             default:
//                 return "text-gray-600";
//         }
//     };

//     return (
//         <div className="space-y-6 sm:space-y-8">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                     <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manage Legal Datasets</h1>
//                     <p className="text-sm sm:text-base text-muted-foreground mt-1">Upload and manage legal datasets for the chatbot</p>
//                 </div>
//                 <Button className="bg-primary hover:bg-primary-hover text-primary-foreground w-full sm:w-auto">
//                     <Upload className="mr-2 h-4 w-4" />
//                     Upload New Dataset
//                 </Button>
//             </div>

//             {/* All Datasets */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="text-lg sm:text-xl">All Datasets</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="rounded-md border overflow-x-auto">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead className="min-w-[150px]">Title</TableHead>
//                                     <TableHead className="min-w-[200px] hidden sm:table-cell">Description</TableHead>
//                                     <TableHead className="min-w-[120px]">Last Updated</TableHead>
//                                     <TableHead className="min-w-[100px]">Status</TableHead>
//                                     <TableHead className="text-right min-w-[120px]">Actions</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {mockDatasets.map((dataset, index) => (
//                                     <TableRow key={index}>
//                                         <TableCell className="font-medium">{dataset.title}</TableCell>
//                                         <TableCell className="text-muted-foreground hidden sm:table-cell">{dataset.description}</TableCell>
//                                         <TableCell className="text-muted-foreground text-sm">{dataset.lastUpdated}</TableCell>
//                                         <TableCell>
//                                             <Badge
//                                                 className={`
//                                                     bg-[#E5E7EB]
//                                                     ${getStatusColor(dataset.status)}
//                                                     w-[63.34px]
//                                                     h-[18px]
//                                                     flex items-center justify-center
//                                                     rounded-full
//                                                     text-xs font-medium
//                                                     px-0 py-0
//                                                 `}
//                                             >
//                                                 {dataset.status}
//                                             </Badge>
//                                         </TableCell>
//                                         <TableCell className="text-right">
//                                             <div className="flex items-center justify-end gap-2">
//                                                 <Button
//                                                     size="sm"
//                                                     variant="ghost"
//                                                     onClick={() => handleAction('edit', dataset)}
//                                                 >
//                                                     <Pencil className="h-4 w-4" />
//                                                 </Button>
//                                                 <Button
//                                                     size="sm"
//                                                     variant="ghost"
//                                                     onClick={() => handleAction('delete', dataset)}
//                                                 >
//                                                     <Trash2 className="h-4 w-4 text-destructive" />
//                                                 </Button>
//                                             </div>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* Dataset Validation Status */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="text-lg sm:text-xl">Dataset Validation Status</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//                         {validationStats.map((stat, index) => (
//                             <div
//                                 key={index}
//                                 className={`p-4 sm:p-6 rounded-lg border-l-4 bg-card ${stat.color}`}
//                             >
//                                 <p className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{stat.value}</p>
//                                 <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default ManageDatasets;

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Upload, 
  Pencil, 
  Trash2, 
  RefreshCw, 
  Database, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

/**
 * Mock Datasets Data
 * TODO: Replace with actual API call
 */
const mockDatasets = [
  {
    id: 1,
    title: 'Financial Regulations 2023',
    description: 'Comprehensive dataset of financial regulations and compliance standards',
    lastUpdated: 'May 15, 2023',
    status: 'Active',
    size: '2.4 MB',
    records: 1250
  },
  {
    id: 2,
    title: 'Corporate Tax Law Cases',
    description: 'Collection of landmark corporate tax law cases and precedents',
    lastUpdated: 'Apr 28, 2023',
    status: 'Active',
    size: '3.1 MB',
    records: 980
  },
  {
    id: 3,
    title: 'Banking Statutes Update',
    description: 'Updated banking statutes including recent amendments',
    lastUpdated: 'May 22, 2023',
    status: 'Pending',
    size: '1.8 MB',
    records: 650
  },
  {
    id: 4,
    title: 'Securities Law Compilation',
    description: 'Compilation of securities law with annotations and references',
    lastUpdated: 'May 10, 2023',
    status: 'Error',
    size: '2.9 MB',
    records: 1100
  },
  {
    id: 5,
    title: 'International Trade Regulations',
    description: 'Dataset covering international trade regulations and treaties',
    lastUpdated: 'May 18, 2023',
    status: 'Active',
    size: '4.2 MB',
    records: 1850
  },
];

/**
 * Validation Statistics Data
 */
const validationStats = [
  { 
    label: 'Validated Datasets', 
    value: 42, 
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50',
    icon: CheckCircle,
    iconColor: 'text-green-600'
  },
  { 
    label: 'Pending Validation', 
    value: 7, 
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'from-amber-50 to-yellow-50',
    icon: Clock,
    iconColor: 'text-amber-600'
  },
  { 
    label: 'Validation Errors', 
    value: 3, 
    color: 'from-red-500 to-rose-500',
    bgColor: 'from-red-50 to-rose-50',
    icon: AlertCircle,
    iconColor: 'text-red-600'
  },
  { 
    label: 'Total Datasets', 
    value: 52, 
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'from-blue-50 to-indigo-50',
    icon: Database,
    iconColor: 'text-blue-600'
  },
];

/**
 * Status Configuration
 */
const STATUS_CONFIG = {
  Active: {
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    icon: CheckCircle
  },
  Pending: {
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
    icon: Clock
  },
  Error: {
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    icon: AlertCircle
  },
};

/**
 * ManageDatasets Component
 * Admin interface for managing legal datasets
 * 
 * Features:
 * - Dataset listing with CRUD operations
 * - Validation status overview
 * - Upload new datasets
 * - Responsive design
 * - Theme-matched styling
 * 
 * Optimizations:
 * - Memoized calculations
 * - Efficient rendering
 * - Loading states
 * - Smooth animations
 */
export const ManageDatasets = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  /**
   * Calculate total records across all datasets
   */
  const totalRecords = useMemo(() => {
    return mockDatasets.reduce((sum, dataset) => sum + dataset.records, 0);
  }, []);

  /**
   * Handle dataset actions (edit, delete, view)
   */
  const handleAction = async (action, dataset) => {
    try {
      setActionLoading(`${action}-${dataset.id}`);
      
      // TODO: Implement actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: `Dataset ${action} successfully`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${action} dataset`,
      });
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    setLoading(true);
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  /**
   * Handle upload
   */
  const handleUpload = () => {
    // TODO: Implement upload modal
    toast({
      title: 'Upload Dataset',
      description: 'Upload feature coming soon',
    });
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
            Manage Legal Datasets
          </h1>
          <p 
            className="text-sm sm:text-base text-gray-600 mt-2 font-medium" 
            style={{ fontFamily: "Inter" }}
          >
            Upload and manage legal datasets for the AI chatbot
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl font-bold transition-all duration-300"
            style={{ fontFamily: "Inter" }}
          >
            <RefreshCw className={cn(
              "h-4 w-4 mr-2 transition-transform duration-500",
              loading && "animate-spin"
            )} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          <Button
            onClick={handleUpload}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ fontFamily: "Inter" }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Dataset
          </Button>
        </div>
      </div>

      {/* Validation Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {validationStats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <Card 
              key={index}
              className={cn(
                "group relative overflow-hidden p-6 border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-1",
                `bg-gradient-to-br ${stat.bgColor}`,
                "animate-slide-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 
                    className={cn(
                      "text-3xl sm:text-4xl font-black bg-gradient-to-r bg-clip-text text-transparent",
                      stat.color
                    )}
                    style={{ fontFamily: "Poppins" }}
                  >
                    {stat.value}
                  </h3>
                  <p 
                    className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-2" 
                    style={{ fontFamily: "Inter" }}
                  >
                    {stat.label}
                  </p>
                </div>
                
                <div className={cn(
                  "relative p-3 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500",
                  `bg-gradient-to-br ${stat.color}`
                )}>
                  <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                  <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
                </div>
              </div>
              
              {/* Bottom decorative bar */}
              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1 transition-all duration-500",
                `bg-gradient-to-r ${stat.color}`,
                "opacity-0 group-hover:opacity-100"
              )} />
            </Card>
          );
        })}
      </div>

      {/* All Datasets Table */}
      <Card className="border-2 border-blue-100 shadow-lg animate-slide-in" style={{ animationDelay: '400ms' }}>
        <CardHeader className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b-2 border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle 
                className="text-xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent" 
                style={{ fontFamily: "Poppins" }}
              >
                All Datasets
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: "Inter" }}>
                Total {totalRecords.toLocaleString()} records across {mockDatasets.length} datasets
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50/50">
                  <TableHead className="min-w-[200px] font-bold" style={{ fontFamily: "Inter" }}>Title</TableHead>
                  <TableHead className="min-w-[250px] hidden lg:table-cell font-bold" style={{ fontFamily: "Inter" }}>Description</TableHead>
                  <TableHead className="min-w-[120px] font-bold" style={{ fontFamily: "Inter" }}>Last Updated</TableHead>
                  <TableHead className="min-w-[100px] hidden md:table-cell font-bold" style={{ fontFamily: "Inter" }}>Size</TableHead>
                  <TableHead className="min-w-[100px] font-bold" style={{ fontFamily: "Inter" }}>Status</TableHead>
                  <TableHead className="text-right min-w-[150px] font-bold" style={{ fontFamily: "Inter" }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDatasets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Database className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-semibold" style={{ fontFamily: "Inter" }}>No datasets found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  mockDatasets.map((dataset, index) => {
                    const statusConfig = STATUS_CONFIG[dataset.status];
                    const StatusIcon = statusConfig.icon;

                    return (
                      <TableRow 
                        key={dataset.id} 
                        className="hover:bg-blue-50/30 transition-colors animate-slide-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Database className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm" style={{ fontFamily: "Poppins" }}>
                                {dataset.title}
                              </p>
                              <p className="text-xs text-gray-500" style={{ fontFamily: "Inter" }}>
                                {dataset.records} records
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-gray-600 text-sm hidden lg:table-cell" style={{ fontFamily: "Inter" }}>
                          {dataset.description}
                        </TableCell>
                        
                        <TableCell className="text-gray-600 text-sm" style={{ fontFamily: "Inter" }}>
                          {dataset.lastUpdated}
                        </TableCell>
                        
                        <TableCell className="text-gray-600 text-sm hidden md:table-cell font-medium" style={{ fontFamily: "Inter" }}>
                          {dataset.size}
                        </TableCell>
                        
                        <TableCell>
                          <Badge
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2",
                              statusConfig.color,
                              statusConfig.bgColor,
                              statusConfig.borderColor
                            )}
                            style={{ fontFamily: "Inter" }}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {dataset.status}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAction('view', dataset)}
                              disabled={actionLoading === `view-${dataset.id}`}
                              className="hover:bg-blue-100 hover:text-blue-700 transition-all rounded-lg"
                              title="View"
                            >
                              {actionLoading === `view-${dataset.id}` ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAction('edit', dataset)}
                              disabled={actionLoading === `edit-${dataset.id}`}
                              className="hover:bg-amber-100 hover:text-amber-700 transition-all rounded-lg"
                              title="Edit"
                            >
                              {actionLoading === `edit-${dataset.id}` ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Pencil className="h-4 w-4" />
                              )}
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAction('delete', dataset)}
                              disabled={actionLoading === `delete-${dataset.id}`}
                              className="hover:bg-red-100 hover:text-red-700 transition-all rounded-lg"
                              title="Delete"
                            >
                              {actionLoading === `delete-${dataset.id}` ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageDatasets;