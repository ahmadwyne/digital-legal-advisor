import React, { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Upload,
    Pencil,
    Trash2,
    Download,
    Archive,
    RefreshCw,
    Search,
    Filter,
    AlertCircle,
    CheckCircle,
    Clock,
    BarChart3,
    FileText,
    Shield
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { datasetService } from '../services/datasetService';
import { UploadDatasetModal } from '../components/datasets/UploadDatasetModal';
import { UpdateDatasetModal } from '../components/datasets/UpdateDatasetModal';
import { DeleteConfirmationDialog } from '../components/datasets/DeleteConfirmationDialogue';
import { DatasetDetailsModal } from '../components/datasets/DatasetDetailsModal';
import { Loader } from '@/components/ui/loader';

export const ManageDatasets = () => {
    const { toast } = useToast();

    // State management
    const [datasets, setDatasets] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [formatFilter, setFormatFilter] = useState('');

    // Modals
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState(null);

    // Fetch datasets
    const fetchDatasets = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                search: searchTerm,
                category: categoryFilter,
                status: statusFilter,
                fileFormat: formatFilter,
                sortBy: 'createdAt',
                sortOrder: 'DESC'
            };

            const response = await datasetService.getAllDatasets(params);

            setDatasets(response.data.datasets);
            setTotalPages(response.data.pagination.totalPages);
            setTotalItems(response.data.pagination.totalItems);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to fetch datasets',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics
    const fetchStats = async () => {
        try {
            setStatsLoading(true);
            const response = await datasetService.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchDatasets();
        fetchStats();
    }, [currentPage, itemsPerPage, searchTerm, categoryFilter, statusFilter, formatFilter]);

    // Handlers
    const handleUploadSuccess = () => {
        setUploadModalOpen(false);
        fetchDatasets();
        fetchStats();
        toast({
            title: 'Success',
            description: 'Dataset uploaded successfully',
        });
    };

    const handleUpdateClick = (dataset) => {
        setSelectedDataset(dataset);
        setUpdateModalOpen(true);
    };

    const handleUpdateSuccess = () => {
        setUpdateModalOpen(false);
        setSelectedDataset(null);
        fetchDatasets();
        fetchStats();
        toast({
            title: 'Success',
            description: 'Dataset updated successfully',
        });
    };

    const handleDeleteClick = (dataset) => {
        setSelectedDataset(dataset);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await datasetService.deleteDataset(selectedDataset.id);
            setDeleteDialogOpen(false);
            setSelectedDataset(null);
            fetchDatasets();
            fetchStats();
            toast({
                title: 'Success',
                description: 'Dataset deleted successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete dataset',
                variant: 'destructive',
            });
        }
    };

    const handleDownload = async (dataset) => {
        try {
            const response = await datasetService.downloadDataset(dataset.id);
            window.open(response.data.signedUrl, '_blank');
            toast({
                title: 'Success',
                description: 'Download started',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to download dataset',
                variant: 'destructive',
            });
        }
    };

    const handleArchive = async (dataset) => {
        try {
            await datasetService.archiveDataset(dataset.id);
            fetchDatasets();
            fetchStats();
            toast({
                title: 'Success',
                description: 'Dataset archived successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to archive dataset',
                variant: 'destructive',
            });
        }
    };

    const handleRestore = async (dataset) => {
        try {
            await datasetService.restoreDataset(dataset.id);
            fetchDatasets();
            fetchStats();
            toast({
                title: 'Success',
                description: 'Dataset restored successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to restore dataset',
                variant: 'destructive',
            });
        }
    };

    const handleDetailsClick = (dataset) => {
        setSelectedDataset(dataset);
        setDetailsModalOpen(true);
    };

    // Utility functions
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'text-[#2C7A3E] bg-[#E8F5E9]';
            case 'pending':
                return 'text-[#D19A00] bg-[#FFF9E6]';
            case 'processing':
                return 'text-[#1976D2] bg-[#E3F2FD]';
            case 'archived':
                return 'text-[#757575] bg-[#F5F5F5]';
            case 'failed':
                return 'text-[#D32F2F] bg-[#FFEBEE]';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="h-3 w-3 mr-1" />;
            case 'pending':
            case 'processing':
                return <Clock className="h-3 w-3 mr-1" />;
            case 'failed':
                return <AlertCircle className="h-3 w-3 mr-1" />;
            case 'archived':
                return <Archive className="h-3 w-3 mr-1" />;
            default:
                return null;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCategoryLabel = (category) => {
        const labels = {
            case_law: 'Case Law',
            statutes: 'Statutes',
            regulations: 'Regulations',
            legal_forms: 'Legal Forms',
            precedents: 'Precedents',
            financial_laws: 'Financial Laws',
            contract_templates: 'Contract Templates',
            compliance_guidelines: 'Compliance Guidelines',
            other: 'Other'
        };
        return labels[category] || category;
    };

    // Clear filters
    const handleClearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setStatusFilter('');
        setFormatFilter('');
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Manage Legal Datasets
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">
                        Upload and manage legal datasets for the chatbot
                    </p>
                </div>
                <Button
                    className="bg-primary hover:bg-primary-hover text-primary-foreground w-full sm:w-auto"
                    onClick={() => {
                        console.log('Button clicked'); // Add this
                        setUploadModalOpen(true);
                        console.log('uploadModalOpen set to:', true); // Add this
                    }}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Dataset
                </Button>
            </div>

            {/* Statistics Cards */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Dataset Statistics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {statsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <div className="p-4 sm:p-6 rounded-lg border-l-4 bg-card border-primary">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                                            {stats?.overview?.totalDatasets || 0}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Total Datasets
                                        </p>
                                    </div>
                                    <FileText className="h-8 w-8 text-primary opacity-20" />
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 rounded-lg border-l-4 bg-card border-[#2C7A3E]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                                            {stats?.overview?.activeDatasets || 0}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Active Datasets
                                        </p>
                                    </div>
                                    <CheckCircle className="h-8 w-8 text-[#2C7A3E] opacity-20" />
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 rounded-lg border-l-4 bg-card border-[#D19A00]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                                            {stats?.overview?.totalRecords?.toLocaleString() || 0}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Total Records
                                        </p>
                                    </div>
                                    <Shield className="h-8 w-8 text-[#D19A00] opacity-20" />
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 rounded-lg border-l-4 bg-card border-foreground">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                                            {stats?.overview?.formattedStorage || '0 MB'}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Storage Used
                                        </p>
                                    </div>
                                    <Download className="h-8 w-8 text-foreground opacity-20" />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="relative lg:col-span-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search datasets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select
                            value={categoryFilter || "all"}
                            onValueChange={(value) =>
                                setCategoryFilter(value === "all" ? "" : value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="case_law">Case Law</SelectItem>
                                <SelectItem value="statutes">Statutes</SelectItem>
                                <SelectItem value="regulations">Regulations</SelectItem>
                                <SelectItem value="financial_laws">Financial Laws</SelectItem>
                                <SelectItem value="precedents">Precedents</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>


                        <Select
                            value={statusFilter || "all"}
                            onValueChange={(value) =>
                                setStatusFilter(value === "all" ? "" : value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>


                        <Button
                            variant="outline"
                            onClick={handleClearFilters}
                            className="w-full"
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            Clear Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Datasets Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg sm:text-xl">
                            All Datasets ({totalItems})
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fetchDatasets()}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader />
                        </div>
                    ) : datasets.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground">No datasets found</p>
                            <Button
                                className="mt-4"
                                onClick={() => setUploadModalOpen(true)}
                            >
                                Upload Your First Dataset
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[200px]">Name</TableHead>
                                            <TableHead className="min-w-[150px]">Category</TableHead>
                                            <TableHead className="min-w-[100px]">Format</TableHead>
                                            <TableHead className="min-w-[100px]">Size</TableHead>
                                            <TableHead className="min-w-[120px]">Records</TableHead>
                                            <TableHead className="min-w-[120px]">Uploaded</TableHead>
                                            <TableHead className="min-w-[100px]">Status</TableHead>
                                            <TableHead className="text-right min-w-[180px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {datasets.map((dataset) => (
                                            <TableRow
                                                key={dataset.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => handleDetailsClick(dataset)}
                                            >
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <p className="font-semibold">{dataset.name}</p>
                                                        {dataset.version && (
                                                            <p className="text-xs text-muted-foreground">
                                                                v{dataset.version}
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {getCategoryLabel(dataset.category)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="uppercase text-xs font-medium">
                                                    {dataset.fileFormat}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {formatFileSize(dataset.fileSize)}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {dataset.recordCount?.toLocaleString() || 0}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(dataset.createdAt)}
                                                </TableCell>
                                                <TableCell onClick={(e) => e.stopPropagation()}>
                                                    <Badge
                                                        className={`
                                                            ${getStatusColor(dataset.status)}
                                                            flex items-center justify-center
                                                            rounded-full
                                                            text-xs font-medium
                                                            px-2 py-1
                                                            w-fit
                                                        `}
                                                    >
                                                        {getStatusIcon(dataset.status)}
                                                        {dataset.status.charAt(0).toUpperCase() + dataset.status.slice(1)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell
                                                    className="text-right"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleDownload(dataset)}
                                                            title="Download"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleUpdateClick(dataset)}
                                                            title="Edit"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        {dataset.status === 'archived' ? (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleRestore(dataset)}
                                                                title="Restore"
                                                            >
                                                                <RefreshCw className="h-4 w-4 text-[#2C7A3E]" />
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleArchive(dataset)}
                                                                title="Archive"
                                                            >
                                                                <Archive className="h-4 w-4 text-[#D19A00]" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleDeleteClick(dataset)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} datasets
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <span className="text-sm">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Modals */}
            <UploadDatasetModal
                open={uploadModalOpen}
                setOpen={setUploadModalOpen}
                onSuccess={handleUploadSuccess}
            />


            {selectedDataset && (
                <>
                    <UpdateDatasetModal
                        open={updateModalOpen}
                        onClose={() => {
                            setUpdateModalOpen(false);
                            setSelectedDataset(null);
                        }}
                        dataset={selectedDataset}
                        onSuccess={handleUpdateSuccess}
                    />

                    <DeleteConfirmationDialog
                        open={deleteDialogOpen}
                        onClose={() => {
                            setDeleteDialogOpen(false);
                            setSelectedDataset(null);
                        }}
                        onConfirm={handleDeleteConfirm}
                        datasetName={selectedDataset.name}
                    />

                    <DatasetDetailsModal
                        open={detailsModalOpen}
                        onClose={() => {
                            setDetailsModalOpen(false);
                            setSelectedDataset(null);
                        }}
                        dataset={selectedDataset}
                    />
                </>
            )}
        </div>
    );
};

export default ManageDatasets;