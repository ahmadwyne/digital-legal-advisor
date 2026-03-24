import { useState, useMemo, useEffect } from 'react';
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
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast.js';

// IMPORT YOUR MODALS HERE (Adjust the paths if they are in a different folder)
import { DatasetDetailsModal } from '../components/datasets/DatasetDetailsModal';
import { DeleteConfirmationDialog } from '../components/datasets/DeleteConfirmationDialogue';
import { UpdateDatasetModal } from '../components/datasets/UpdateDatasetModal';
import { UploadDatasetModal } from '../components/datasets/UploadDatasetModal';

/**
 * Status Configuration matching backend enum/strings
 */
const STATUS_CONFIG = {
  active: {
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    label: 'Active'
  },
  processing: {
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
    icon: Clock,
    label: 'Processing'
  },
  archived: {
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    icon: Archive,
    label: 'Archived'
  },
  error: {
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    icon: AlertCircle,
    label: 'Error'
  },
};

// Utility to format bytes into readable sizes
const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Utility to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const ManageDatasets = () => {
  const { toast } = useToast();
  const [datasets, setDatasets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);

  // Authentication logic
  const getAuthToken = () => localStorage.getItem('accessToken') || localStorage.getItem('token') || '';

  /**
   * Fetch both Datasets and Stats from the backend
   */
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [datasetsRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/v1/datasets?limit=50', { headers }),
        fetch('http://localhost:5000/api/v1/datasets/stats', { headers })
      ]);

      const datasetsData = await datasetsRes.json();
      const statsData = await statsRes.json();

      if (datasetsData.status === 'success') {
        setDatasets(datasetsData.data.datasets);
      } else {
        throw new Error(datasetsData.message || 'Failed to fetch datasets');
      }

      if (statsData.status === 'success') {
        setStats(statsData.data);
      }

    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: error.message || 'Failed to communicate with the server.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Calculate total records
   */
  const totalRecords = useMemo(() => {
    return stats?.overview?.totalRecords || datasets.reduce((sum, d) => sum + (parseInt(d.recordCount) || 0), 0);
  }, [datasets, stats]);

  /**
   * Dynamic Validation Statistics Data
   */
  const validationStats = [
    { 
      label: 'Active Datasets', 
      value: stats?.overview?.activeDatasets || 0, 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      icon: CheckCircle,
    },
    { 
      label: 'Processing', 
      value: stats?.overview?.processingDatasets || 0, 
      color: 'from-amber-500 to-yellow-500',
      bgColor: 'from-amber-50 to-yellow-50',
      icon: Clock,
    },
    { 
      label: 'Archived', 
      value: stats?.overview?.archivedDatasets || 0, 
      color: 'from-gray-500 to-slate-500',
      bgColor: 'from-gray-50 to-slate-50',
      icon: Archive,
    },
    { 
      label: 'Total Datasets', 
      value: stats?.overview?.totalDatasets || 0, 
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      icon: Database,
    },
  ];

  /**
   * Handle Dataset Deletion API Call
   */
  const handleDeleteConfirm = async () => {
    if (!selectedDataset) return;
    try {
      setActionLoading(`delete-${selectedDataset.id}`);
      const token = getAuthToken();
      
      const res = await fetch(`http://localhost:5000/api/v1/datasets/${selectedDataset.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (data.status === 'success') {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Dataset deleted successfully',
        });
        fetchData();
        setIsDeleteDialogOpen(false);
        setSelectedDataset(null);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: error.message || 'Failed to delete dataset',
      });
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Handle dataset actions (edit, delete, view, archive)
   */
  const handleAction = async (action, dataset) => {
    // Open appropriate modal based on action
    if (action === 'view') {
      setSelectedDataset(dataset);
      setIsDetailsModalOpen(true);
      return;
    }
    
    if (action === 'edit') {
      setSelectedDataset(dataset);
      setIsUpdateModalOpen(true);
      return;
    }

    if (action === 'delete') {
      setSelectedDataset(dataset);
      setIsDeleteDialogOpen(true);
      return;
    }

    // Handle immediate direct API calls (e.g. archiving)
    try {
      setActionLoading(`${action}-${dataset.id}`);
      const token = getAuthToken();
      let url = `http://localhost:5000/api/v1/datasets/${dataset.id}`;
      let method = 'GET';

      if (action === 'archive') {
        url = `http://localhost:5000/api/v1/datasets/${dataset.id}/archive`;
        method = 'PATCH';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (data.status === 'success') {
        toast({
          variant: 'success',
          title: 'Success',
          description: `Dataset ${action}d successfully`,
        });
        fetchData(); 
      } else {
        throw new Error(data.message);
      }

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Action Failed',
        description: error.message || `Failed to ${action} dataset`,
      });
    } finally {
      setActionLoading(null);
    }
  }; 

  const handleRefresh = () => {
    fetchData();
  };

  const handleUpload = () => {
    setIsUploadModalOpen(true);
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
                    {loading ? '-' : stat.value}
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
                Total {totalRecords.toLocaleString()} records across {datasets.length} datasets
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
                {loading && datasets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                       <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                       <p className="text-gray-500 mt-2 font-semibold">Loading datasets...</p>
                    </TableCell>
                  </TableRow>
                ) : datasets.length === 0 ? (
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
                  datasets.map((dataset, index) => {
                    const dsStatus = dataset.status?.toLowerCase() || 'error';
                    const statusConfig = STATUS_CONFIG[dsStatus] || STATUS_CONFIG.error;
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
                                {dataset.name}
                              </p>
                              <p className="text-xs text-gray-500" style={{ fontFamily: "Inter" }}>
                                {dataset.recordCount || 0} records
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-gray-600 text-sm hidden lg:table-cell" style={{ fontFamily: "Inter" }}>
                          <span className="line-clamp-2">{dataset.description || 'No description provided'}</span>
                        </TableCell>
                        
                        <TableCell className="text-gray-600 text-sm" style={{ fontFamily: "Inter" }}>
                          {formatDate(dataset.updatedAt || dataset.createdAt)}
                        </TableCell>
                        
                        <TableCell className="text-gray-600 text-sm hidden md:table-cell font-medium" style={{ fontFamily: "Inter" }}>
                          {formatBytes(dataset.fileSize)}
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
                            {statusConfig.label}
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

      {/* --- INTEGRATED MODALS --- */}
      
      <UploadDatasetModal 
        open={isUploadModalOpen} 
        setOpen={setIsUploadModalOpen} 
        onSuccess={() => { 
          setIsUploadModalOpen(false); 
          fetchData(); 
        }} 
      />

      <UpdateDatasetModal 
        open={isUpdateModalOpen} 
        onClose={() => { 
          setIsUpdateModalOpen(false); 
          setSelectedDataset(null); 
        }} 
        dataset={selectedDataset} 
        onSuccess={() => { 
          setIsUpdateModalOpen(false); 
          setSelectedDataset(null); 
          fetchData(); 
        }} 
      />

      <DatasetDetailsModal 
        open={isDetailsModalOpen} 
        onClose={() => { 
          setIsDetailsModalOpen(false); 
          setSelectedDataset(null); 
        }} 
        dataset={selectedDataset} 
      />

      <DeleteConfirmationDialog 
        open={isDeleteDialogOpen} 
        onClose={() => { 
          setIsDeleteDialogOpen(false); 
          setSelectedDataset(null); 
        }} 
        onConfirm={handleDeleteConfirm} 
        datasetName={selectedDataset?.name} 
      />
      
    </div>
  );
};

export default ManageDatasets;