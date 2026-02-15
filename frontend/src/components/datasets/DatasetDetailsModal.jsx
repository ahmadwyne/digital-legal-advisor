import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    Calendar,
    User,
    Database,
    Download,
    Tag,
    MapPin,
    Shield,
    Hash,
    X
} from 'lucide-react';

export const DatasetDetailsModal = ({ open, onClose, dataset }) => {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && open) {
                onClose();
            }
        };

        if (open) {
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [open, onClose]);

    if (!open || !dataset) return null;

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    const DetailRow = ({ icon: Icon, label, value, badge = false }) => (
        <div className="flex items-start gap-3 py-2">
            <Icon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                {badge ? (
                    <Badge variant="outline" className="mt-1">
                        {value}
                    </Badge>
                ) : (
                    <p className="text-sm mt-1">{value || 'N/A'}</p>
                )}
            </div>
        </div>
    );

    const Separator = () => (
        <div className="border-t border-gray-200 dark:border-gray-700" />
    );

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b p-6 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <FileText className="h-6 w-6" />
                                Dataset Details
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Complete information about this dataset
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                        <div className="space-y-2">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <h4 className="font-semibold text-lg mb-2">{dataset.name}</h4>
                                {dataset.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {dataset.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <DetailRow
                                    icon={Database}
                                    label="Category"
                                    value={getCategoryLabel(dataset.category)}
                                    badge
                                />
                                <DetailRow
                                    icon={FileText}
                                    label="File Format"
                                    value={dataset.fileFormat?.toUpperCase()}
                                    badge
                                />
                                <DetailRow
                                    icon={Hash}
                                    label="Version"
                                    value={dataset.version}
                                />
                                <DetailRow
                                    icon={Shield}
                                    label="Visibility"
                                    value={dataset.isPublic ? 'Public' : 'Private'}
                                    badge
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* File Statistics */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">File Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Database className="h-4 w-4 text-primary" />
                                    <p className="text-sm font-medium">File Size</p>
                                </div>
                                <p className="text-2xl font-bold">
                                    {formatFileSize(dataset.fileSize)}
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <p className="text-sm font-medium">Records</p>
                                </div>
                                <p className="text-2xl font-bold">
                                    {dataset.recordCount?.toLocaleString() || 0}
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Download className="h-4 w-4 text-primary" />
                                    <p className="text-sm font-medium">Downloads</p>
                                </div>
                                <p className="text-2xl font-bold">
                                    {dataset.downloadCount || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Additional Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                        <div className="space-y-2">
                            {dataset.jurisdiction && (
                                <DetailRow
                                    icon={MapPin}
                                    label="Jurisdiction"
                                    value={dataset.jurisdiction}
                                />
                            )}

                            {dataset.tags && dataset.tags.length > 0 && (
                                <div className="flex items-start gap-3 py-2">
                                    <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</p>
                                        <div className="flex flex-wrap gap-2">
                                            {dataset.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {dataset.dateRange && (
                                <div className="flex items-start gap-3 py-2">
                                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Coverage</p>
                                        <p className="text-sm mt-1">
                                            {new Date(dataset.dateRange.startDate).toLocaleDateString()} - {new Date(dataset.dateRange.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!dataset.jurisdiction && (!dataset.tags || dataset.tags.length === 0) && !dataset.dateRange && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 py-2">
                                    No additional information available.
                                </p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Upload Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Upload Information</h3>
                        <div className="space-y-2">
                            <DetailRow
                                icon={User}
                                label="Uploaded By"
                                value={dataset.uploadedBy ?
                                    `${dataset.uploadedBy.firstName} ${dataset.uploadedBy.lastName}` :
                                    'Unknown'
                                }
                            />
                            <DetailRow
                                icon={Calendar}
                                label="Upload Date"
                                value={formatDate(dataset.createdAt)}
                            />
                            <DetailRow
                                icon={Calendar}
                                label="Last Modified"
                                value={formatDate(dataset.updatedAt)}
                            />
                            {dataset.lastModifiedBy && (
                                <DetailRow
                                    icon={User}
                                    label="Last Modified By"
                                    value={`${dataset.lastModifiedBy.firstName} ${dataset.lastModifiedBy.lastName}`}
                                />
                            )}
                        </div>
                    </div>

                    {/* Status Information */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium mb-1">Current Status</p>
                                <Badge className="capitalize">
                                    {dataset.status}
                                </Badge>
                            </div>
                            {dataset.checksum && (
                                <div className="text-right">
                                    <p className="text-sm font-medium mb-1">Checksum</p>
                                    <p className="text-xs text-gray-500 font-mono">
                                        {dataset.checksum.substring(0, 16)}...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const portalRoot = document.getElementById('portal-root') || document.body;
    return ReactDOM.createPortal(modalContent, portalRoot);
};