// import React, { useEffect } from 'react';
// import ReactDOM from 'react-dom';
// import { Badge } from '@/components/ui/badge';
// import {
//     FileText,
//     Calendar,
//     User,
//     Database,
//     Download,
//     Tag,
//     MapPin,
//     Shield,
//     Hash,
//     X
// } from 'lucide-react';

// export const DatasetDetailsModal = ({ open, onClose, dataset }) => {
//     // Lock body scroll when modal is open
//     useEffect(() => {
//         if (open) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'unset';
//         }

//         return () => {
//             document.body.style.overflow = 'unset';
//         };
//     }, [open]);

//     // Handle Escape key
//     useEffect(() => {
//         const handleEscape = (e) => {
//             if (e.key === 'Escape' && open) {
//                 onClose();
//             }
//         };

//         if (open) {
//             window.addEventListener('keydown', handleEscape);
//         }

//         return () => {
//             window.removeEventListener('keydown', handleEscape);
//         };
//     }, [open, onClose]);

//     if (!open || !dataset) return null;

//     const formatFileSize = (bytes) => {
//         if (bytes === 0) return '0 Bytes';
//         const k = 1024;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const getCategoryLabel = (category) => {
//         const labels = {
//             case_law: 'Case Law',
//             statutes: 'Statutes',
//             regulations: 'Regulations',
//             legal_forms: 'Legal Forms',
//             precedents: 'Precedents',
//             financial_laws: 'Financial Laws',
//             contract_templates: 'Contract Templates',
//             compliance_guidelines: 'Compliance Guidelines',
//             other: 'Other'
//         };
//         return labels[category] || category;
//     };

//     const DetailRow = ({ icon: Icon, label, value, badge = false }) => (
//         <div className="flex items-start gap-3 py-2">
//             <Icon className="h-5 w-5 text-gray-400 mt-0.5" />
//             <div className="flex-1">
//                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
//                 {badge ? (
//                     <Badge variant="outline" className="mt-1">
//                         {value}
//                     </Badge>
//                 ) : (
//                     <p className="text-sm mt-1">{value || 'N/A'}</p>
//                 )}
//             </div>
//         </div>
//     );

//     const Separator = () => (
//         <div className="border-t border-gray-200 dark:border-gray-700" />
//     );

//     const modalContent = (
//         <div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
//             onClick={(e) => {
//                 if (e.target === e.currentTarget) {
//                     onClose();
//                 }
//             }}
//         >
//             <div
//                 className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 {/* Header */}
//                 <div className="sticky top-0 bg-white dark:bg-gray-900 border-b p-6 z-10">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h2 className="text-2xl font-bold flex items-center gap-2">
//                                 <FileText className="h-6 w-6" />
//                                 Dataset Details
//                             </h2>
//                             <p className="text-sm text-gray-500 mt-1">
//                                 Complete information about this dataset
//                             </p>
//                         </div>
//                         <button
//                             onClick={onClose}
//                             className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                         >
//                             <X className="h-5 w-5" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Content */}
//                 <div className="p-6 space-y-6">
//                     {/* Basic Information */}
//                     <div>
//                         <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
//                         <div className="space-y-2">
//                             <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
//                                 <h4 className="font-semibold text-lg mb-2">{dataset.name}</h4>
//                                 {dataset.description && (
//                                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                                         {dataset.description}
//                                     </p>
//                                 )}
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                                 <DetailRow
//                                     icon={Database}
//                                     label="Category"
//                                     value={getCategoryLabel(dataset.category)}
//                                     badge
//                                 />
//                                 <DetailRow
//                                     icon={FileText}
//                                     label="File Format"
//                                     value={dataset.fileFormat?.toUpperCase()}
//                                     badge
//                                 />
//                                 <DetailRow
//                                     icon={Hash}
//                                     label="Version"
//                                     value={dataset.version}
//                                 />
//                                 <DetailRow
//                                     icon={Shield}
//                                     label="Visibility"
//                                     value={dataset.isPublic ? 'Public' : 'Private'}
//                                     badge
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     <Separator />

//                     {/* File Statistics */}
//                     <div>
//                         <h3 className="text-lg font-semibold mb-4">File Statistics</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
//                                 <div className="flex items-center gap-2 mb-2">
//                                     <Database className="h-4 w-4 text-primary" />
//                                     <p className="text-sm font-medium">File Size</p>
//                                 </div>
//                                 <p className="text-2xl font-bold">
//                                     {formatFileSize(dataset.fileSize)}
//                                 </p>
//                             </div>

//                             <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
//                                 <div className="flex items-center gap-2 mb-2">
//                                     <FileText className="h-4 w-4 text-primary" />
//                                     <p className="text-sm font-medium">Records</p>
//                                 </div>
//                                 <p className="text-2xl font-bold">
//                                     {dataset.recordCount?.toLocaleString() || 0}
//                                 </p>
//                             </div>

//                             <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
//                                 <div className="flex items-center gap-2 mb-2">
//                                     <Download className="h-4 w-4 text-primary" />
//                                     <p className="text-sm font-medium">Downloads</p>
//                                 </div>
//                                 <p className="text-2xl font-bold">
//                                     {dataset.downloadCount || 0}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <Separator />

//                     {/* Additional Information */}
//                     <div>
//                         <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
//                         <div className="space-y-2">
//                             {dataset.jurisdiction && (
//                                 <DetailRow
//                                     icon={MapPin}
//                                     label="Jurisdiction"
//                                     value={dataset.jurisdiction}
//                                 />
//                             )}

//                             {dataset.tags && dataset.tags.length > 0 && (
//                                 <div className="flex items-start gap-3 py-2">
//                                     <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
//                                     <div className="flex-1">
//                                         <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</p>
//                                         <div className="flex flex-wrap gap-2">
//                                             {dataset.tags.map((tag) => (
//                                                 <Badge key={tag} variant="secondary">
//                                                     {tag}
//                                                 </Badge>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {dataset.dateRange && (
//                                 <div className="flex items-start gap-3 py-2">
//                                     <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
//                                     <div className="flex-1">
//                                         <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Coverage</p>
//                                         <p className="text-sm mt-1">
//                                             {new Date(dataset.dateRange.startDate).toLocaleDateString()} - {new Date(dataset.dateRange.endDate).toLocaleDateString()}
//                                         </p>
//                                     </div>
//                                 </div>
//                             )}

//                             {!dataset.jurisdiction && (!dataset.tags || dataset.tags.length === 0) && !dataset.dateRange && (
//                                 <p className="text-sm text-gray-500 dark:text-gray-400 py-2">
//                                     No additional information available.
//                                 </p>
//                             )}
//                         </div>
//                     </div>

//                     <Separator />

//                     {/* Upload Information */}
//                     <div>
//                         <h3 className="text-lg font-semibold mb-4">Upload Information</h3>
//                         <div className="space-y-2">
//                             <DetailRow
//                                 icon={User}
//                                 label="Uploaded By"
//                                 value={dataset.uploadedBy ?
//                                     `${dataset.uploadedBy.firstName} ${dataset.uploadedBy.lastName}` :
//                                     'Unknown'
//                                 }
//                             />
//                             <DetailRow
//                                 icon={Calendar}
//                                 label="Upload Date"
//                                 value={formatDate(dataset.createdAt)}
//                             />
//                             <DetailRow
//                                 icon={Calendar}
//                                 label="Last Modified"
//                                 value={formatDate(dataset.updatedAt)}
//                             />
//                             {dataset.lastModifiedBy && (
//                                 <DetailRow
//                                     icon={User}
//                                     label="Last Modified By"
//                                     value={`${dataset.lastModifiedBy.firstName} ${dataset.lastModifiedBy.lastName}`}
//                                 />
//                             )}
//                         </div>
//                     </div>

//                     {/* Status Information */}
//                     <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium mb-1">Current Status</p>
//                                 <Badge className="capitalize">
//                                     {dataset.status}
//                                 </Badge>
//                             </div>
//                             {dataset.checksum && (
//                                 <div className="text-right">
//                                     <p className="text-sm font-medium mb-1">Checksum</p>
//                                     <p className="text-xs text-gray-500 font-mono">
//                                         {dataset.checksum.substring(0, 16)}...
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     const portalRoot = document.getElementById('portal-root') || document.body;
//     return ReactDOM.createPortal(modalContent, portalRoot);
// };

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [open]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && open) onClose();
        };
        if (open) window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
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
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getCategoryLabel = (category) => {
        const labels = {
            case_law: 'Case Law', statutes: 'Statutes', regulations: 'Regulations',
            legal_forms: 'Legal Forms', precedents: 'Precedents', financial_laws: 'Financial Laws',
            contract_templates: 'Contract Templates', compliance_guidelines: 'Compliance Guidelines',
            other: 'Other'
        };
        return labels[category] || category;
    };

    const DetailRow = ({ icon: Icon, label, value, badge = false }) => (
        <div className="flex items-start gap-3 py-2">
            <div className="bg-blue-100 p-2 rounded-lg mt-0.5">
                <Icon className="h-4 w-4 text-blue-700" />
            </div>
            <div className="flex-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: "Inter" }}>{label}</p>
                {badge ? (
                    <Badge variant="outline" className="mt-1 border-blue-200 text-blue-700 bg-blue-50 font-semibold" style={{ fontFamily: "Inter" }}>
                        {value}
                    </Badge>
                ) : (
                    <p className="text-sm mt-1 font-medium text-gray-800" style={{ fontFamily: "Inter" }}>{value || 'N/A'}</p>
                )}
            </div>
        </div>
    );

    const Separator = () => (
        <div className="border-t-2 border-blue-50 dark:border-gray-800 my-2" />
    );

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-blue-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-md dark:bg-gray-900 border-b-2 border-blue-100 p-6 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 
                                className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent flex items-center gap-2"
                                style={{ fontFamily: "Poppins" }}
                            >
                                <FileText className="h-7 w-7 text-blue-700" strokeWidth={2.5} />
                                Dataset Details
                            </h2>
                            <p className="text-sm font-medium text-gray-500 mt-1" style={{ fontFamily: "Inter" }}>
                                Complete information about this dataset
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <X className="h-6 w-6" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: "Poppins" }}>Basic Information</h3>
                        <div className="space-y-4">
                            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                                <h4 className="font-bold text-xl text-blue-900 mb-2" style={{ fontFamily: "Poppins" }}>{dataset.name}</h4>
                                {dataset.description && (
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium" style={{ fontFamily: "Inter" }}>
                                        {dataset.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailRow icon={Database} label="Category" value={getCategoryLabel(dataset.category)} badge />
                                <DetailRow icon={FileText} label="File Format" value={dataset.fileFormat?.toUpperCase()} badge />
                                <DetailRow icon={Hash} label="Version" value={dataset.version} />
                                <DetailRow icon={Shield} label="Visibility" value={dataset.isPublic ? 'Public' : 'Private'} badge />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* File Statistics */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: "Poppins" }}>File Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Database className="h-5 w-5 text-blue-600" />
                                    <p className="text-xs font-bold text-gray-600 uppercase" style={{ fontFamily: "Inter" }}>File Size</p>
                                </div>
                                <p className="text-2xl font-black text-blue-900" style={{ fontFamily: "Poppins" }}>
                                    {formatFileSize(dataset.fileSize)}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-5 w-5 text-indigo-600" />
                                    <p className="text-xs font-bold text-gray-600 uppercase" style={{ fontFamily: "Inter" }}>Records</p>
                                </div>
                                <p className="text-2xl font-black text-indigo-900" style={{ fontFamily: "Poppins" }}>
                                    {dataset.recordCount?.toLocaleString() || 0}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100 rounded-xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Download className="h-5 w-5 text-purple-600" />
                                    <p className="text-xs font-bold text-gray-600 uppercase" style={{ fontFamily: "Inter" }}>Downloads</p>
                                </div>
                                <p className="text-2xl font-black text-purple-900" style={{ fontFamily: "Poppins" }}>
                                    {dataset.downloadCount || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Additional Information */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: "Poppins" }}>Additional Information</h3>
                        <div className="space-y-4">
                            {dataset.jurisdiction && (
                                <DetailRow icon={MapPin} label="Jurisdiction" value={dataset.jurisdiction} />
                            )}

                            {dataset.tags && dataset.tags.length > 0 && (
                                <div className="flex items-start gap-3 py-2">
                                    <div className="bg-blue-100 p-2 rounded-lg mt-0.5">
                                        <Tag className="h-4 w-4 text-blue-700" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" style={{ fontFamily: "Inter" }}>Tags</p>
                                        <div className="flex flex-wrap gap-2">
                                            {dataset.tags.map((tag) => (
                                                <Badge key={tag} className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold" style={{ fontFamily: "Inter" }}>
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {dataset.dateRange && (
                                <DetailRow icon={Calendar} label="Date Coverage" value={`${new Date(dataset.dateRange.startDate).toLocaleDateString()} - ${new Date(dataset.dateRange.endDate).toLocaleDateString()}`} />
                            )}

                            {!dataset.jurisdiction && (!dataset.tags || dataset.tags.length === 0) && !dataset.dateRange && (
                                <p className="text-sm font-medium text-gray-500 py-2 bg-gray-50 rounded-lg px-4" style={{ fontFamily: "Inter" }}>
                                    No additional information available.
                                </p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Upload Information */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: "Poppins" }}>Upload Information</h3>
                        <div className="space-y-2">
                            <DetailRow icon={User} label="Uploaded By" value={dataset.uploadedBy ? `${dataset.uploadedBy.firstName} ${dataset.uploadedBy.lastName}` : 'Unknown'} />
                            <DetailRow icon={Calendar} label="Upload Date" value={formatDate(dataset.createdAt)} />
                            <DetailRow icon={Calendar} label="Last Modified" value={formatDate(dataset.updatedAt)} />
                            {dataset.lastModifiedBy && (
                                <DetailRow icon={User} label="Last Modified By" value={`${dataset.lastModifiedBy.firstName} ${dataset.lastModifiedBy.lastName}`} />
                            )}
                        </div>
                    </div>

                    {/* Status Information */}
                    <div className="bg-blue-50/30 border-2 border-blue-100 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" style={{ fontFamily: "Inter" }}>Current Status</p>
                            <Badge className={cn("capitalize font-bold px-3 py-1", 
                                dataset.status === 'active' ? "bg-green-100 text-green-700 hover:bg-green-200" :
                                dataset.status === 'processing' ? "bg-amber-100 text-amber-700 hover:bg-amber-200" :
                                "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            )} style={{ fontFamily: "Inter" }}>
                                {dataset.status}
                            </Badge>
                        </div>
                        {dataset.checksum && (
                            <div className="sm:text-right w-full sm:w-auto">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" style={{ fontFamily: "Inter" }}>Checksum</p>
                                <p className="text-xs text-gray-600 font-mono bg-white border border-gray-200 px-3 py-1.5 rounded-lg break-all">
                                    {dataset.checksum.substring(0, 24)}...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const portalRoot = document.getElementById('portal-root') || document.body;
    return ReactDOM.createPortal(modalContent, portalRoot);
};