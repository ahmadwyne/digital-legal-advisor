// import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { Upload, X, FileText, AlertCircle, RefreshCw  } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';
// import { datasetService } from '@/services/datasetService';

// export const UploadDatasetModal = ({ open, setOpen, onSuccess }) => {
//     const { toast } = useToast();
//     const [loading, setLoading] = useState(false);
//     const [selectedFile, setSelectedFile] = useState(null);

//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//         category: '',
//         fileFormat: '',
//         version: '1.0',
//         jurisdiction: '',
//         tags: [],
//         isPublic: true
//     });

//     const [tagInput, setTagInput] = useState('');
//     const [errors, setErrors] = useState({});

//     const categories = [
//         { value: 'case_law', label: 'Case Law' },
//         { value: 'statutes', label: 'Statutes' },
//         { value: 'regulations', label: 'Regulations' },
//         { value: 'legal_forms', label: 'Legal Forms' },
//         { value: 'precedents', label: 'Precedents' },
//         { value: 'financial_laws', label: 'Financial Laws' },
//         { value: 'contract_templates', label: 'Contract Templates' },
//         { value: 'compliance_guidelines', label: 'Compliance Guidelines' },
//         { value: 'other', label: 'Other' }
//     ];

//     const fileFormats = [
//         { value: 'json', label: 'JSON (.json)' },
//         { value: 'csv', label: 'CSV (.csv)' },
//         { value: 'txt', label: 'Text (.txt)' },
//         { value: 'pdf', label: 'PDF (.pdf)' },
//         { value: 'docx', label: 'Word (.docx)' },
//         { value: 'xlsx', label: 'Excel (.xlsx)' }
//     ];

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
//             if (e.key === 'Escape' && open && !loading) {
//                 handleClose();
//             }
//         };

//         if (open) {
//             window.addEventListener('keydown', handleEscape);
//         }

//         return () => {
//             window.removeEventListener('keydown', handleEscape);
//         };
//     }, [open, loading]);

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (file.size > 500 * 1024 * 1024) {
//                 toast({
//                     title: 'Error',
//                     description: 'File size must be less than 500MB',
//                     variant: 'destructive',
//                 });
//                 return;
//             }

//             setSelectedFile(file);

//             const extension = file.name.split('.').pop().toLowerCase();
//             if (['json', 'csv', 'txt', 'pdf', 'docx', 'xlsx'].includes(extension)) {
//                 setFormData(prev => ({ ...prev, fileFormat: extension }));
//             }

//             if (!formData.name) {
//                 const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
//                 setFormData(prev => ({ ...prev, name: nameWithoutExt }));
//             }
//         }
//     };

//     const handleInputChange = (field, value) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//         if (errors[field]) {
//             setErrors(prev => ({ ...prev, [field]: null }));
//         }
//     };

//     const handleAddTag = () => {
//         if (tagInput.trim() && formData.tags.length < 20) {
//             const newTag = tagInput.trim().toLowerCase();
//             if (!formData.tags.includes(newTag)) {
//                 setFormData(prev => ({
//                     ...prev,
//                     tags: [...prev.tags, newTag]
//                 }));
//             }
//             setTagInput('');
//         }
//     };

//     const handleRemoveTag = (tagToRemove) => {
//         setFormData(prev => ({
//             ...prev,
//             tags: prev.tags.filter(tag => tag !== tagToRemove)
//         }));
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         if (!selectedFile) {
//             newErrors.file = 'Please select a file to upload';
//         }

//         if (!formData.name || formData.name.trim().length < 3) {
//             newErrors.name = 'Dataset name must be at least 3 characters';
//         }

//         if (!formData.category) {
//             newErrors.category = 'Please select a category';
//         }

//         if (!formData.fileFormat) {
//             newErrors.fileFormat = 'Please select a file format';
//         }

//         if (formData.version && !/^\d+\.\d+$/.test(formData.version)) {
//             newErrors.version = 'Version must be in format X.Y (e.g., 1.0)';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             toast({
//                 title: 'Validation Error',
//                 description: 'Please fix the errors in the form',
//                 variant: 'destructive',
//             });
//             return;
//         }

//         setLoading(true);

//         try {
//             const uploadData = new FormData();
//             uploadData.append('file', selectedFile);
//             uploadData.append('name', formData.name.trim());
//             uploadData.append('description', formData.description.trim());
//             uploadData.append('category', formData.category);
//             uploadData.append('fileFormat', formData.fileFormat);
//             uploadData.append('version', formData.version);
//             uploadData.append('tags', JSON.stringify(formData.tags));
//             uploadData.append('isPublic', formData.isPublic.toString());

//             if (formData.jurisdiction) {
//                 uploadData.append('jurisdiction', formData.jurisdiction.trim());
//             }

//             await datasetService.createDataset(uploadData);

//             setFormData({
//                 name: '',
//                 description: '',
//                 category: '',
//                 fileFormat: '',
//                 version: '1.0',
//                 jurisdiction: '',
//                 tags: [],
//                 isPublic: true
//             });
//             setSelectedFile(null);
//             setErrors({});

//             onSuccess();
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || 'Failed to upload dataset';
//             const validationErrors = error.response?.data?.errors;

//             if (validationErrors && Array.isArray(validationErrors)) {
//                 const newErrors = {};
//                 validationErrors.forEach(err => {
//                     newErrors[err.field] = err.message;
//                 });
//                 setErrors(newErrors);
//             }

//             toast({
//                 title: 'Upload Failed',
//                 description: errorMessage,
//                 variant: 'destructive',
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleClose = () => {
//         if (!loading) {
//             setFormData({
//                 name: '',
//                 description: '',
//                 category: '',
//                 fileFormat: '',
//                 version: '1.0',
//                 jurisdiction: '',
//                 tags: [],
//                 isPublic: true
//             });
//             setSelectedFile(null);
//             setErrors({});
//             setTagInput('');
//             setOpen(false);
//         }
//     };

//     if (!open) return null;

//     const modalContent = (
//         <div 
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
//             onClick={(e) => {
//                 if (e.target === e.currentTarget && !loading) {
//                     handleClose();
//                 }
//             }}
//         >
//             <div 
//                 className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 {/* Header */}
//                 <div className="sticky top-0 bg-white dark:bg-gray-900 border-b p-6 z-10">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h2 className="text-2xl font-bold flex items-center gap-2">
//                                 <Upload className="h-6 w-6" />
//                                 Upload New Dataset
//                             </h2>
//                             <p className="text-sm text-gray-500 mt-1">
//                                 Upload a legal dataset to train and improve the chatbot's knowledge base
//                             </p>
//                         </div>
//                         <button
//                             onClick={handleClose}
//                             disabled={loading}
//                             className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                         >
//                             <X className="h-5 w-5" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                     {/* File Upload */}
//                     <div className="space-y-2">
//                         <Label htmlFor="file" className="required">
//                             Dataset File *
//                         </Label>
//                         <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
//                             <input
//                                 id="file"
//                                 type="file"
//                                 accept=".json,.csv,.txt,.pdf,.docx,.xlsx"
//                                 onChange={handleFileChange}
//                                 className="hidden"
//                             />
//                             <label htmlFor="file" className="cursor-pointer">
//                                 {selectedFile ? (
//                                     <div className="flex items-center justify-center gap-3">
//                                         <FileText className="h-8 w-8 text-primary" />
//                                         <div className="text-left">
//                                             <p className="font-medium">{selectedFile.name}</p>
//                                             <p className="text-sm text-muted-foreground">
//                                                 {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                                             </p>
//                                         </div>
//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="sm"
//                                             onClick={(e) => {
//                                                 e.preventDefault();
//                                                 setSelectedFile(null);
//                                             }}
//                                         >
//                                             <X className="h-4 w-4" />
//                                         </Button>
//                                     </div>
//                                 ) : (
//                                     <div>
//                                         <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
//                                         <p className="text-sm font-medium">
//                                             Click to upload or drag and drop
//                                         </p>
//                                         <p className="text-xs text-muted-foreground mt-1">
//                                             JSON, CSV, TXT, PDF, DOCX, XLSX (Max 500MB)
//                                         </p>
//                                     </div>
//                                 )}
//                             </label>
//                         </div>
//                         {errors.file && (
//                             <p className="text-sm text-destructive flex items-center gap-1">
//                                 <AlertCircle className="h-3 w-3" />
//                                 {errors.file}
//                             </p>
//                         )}
//                     </div>

//                     {/* Dataset Name */}
//                     <div className="space-y-2">
//                         <Label htmlFor="name" className="required">
//                             Dataset Name *
//                         </Label>
//                         <Input
//                             id="name"
//                             placeholder="e.g., Pakistan Financial Laws 2026"
//                             value={formData.name}
//                             onChange={(e) => handleInputChange('name', e.target.value)}
//                             className={errors.name ? 'border-destructive' : ''}
//                         />
//                         {errors.name && (
//                             <p className="text-sm text-destructive flex items-center gap-1">
//                                 <AlertCircle className="h-3 w-3" />
//                                 {errors.name}
//                             </p>
//                         )}
//                     </div>

//                     {/* Description */}
//                     <div className="space-y-2">
//                         <Label htmlFor="description">Description</Label>
//                         <Textarea
//                             id="description"
//                             placeholder="Brief description of the dataset contents..."
//                             value={formData.description}
//                             onChange={(e) => handleInputChange('description', e.target.value)}
//                             rows={3}
//                         />
//                     </div>

//                     {/* Category and Format */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="category" className="required">
//                                 Category *
//                             </Label>
//                             <Select
//                                 value={formData.category}
//                                 onValueChange={(value) => handleInputChange('category', value)}
//                             >
//                                 <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
//                                     <SelectValue placeholder="Select category" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {categories.map((cat) => (
//                                         <SelectItem key={cat.value} value={cat.value}>
//                                             {cat.label}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                             {errors.category && (
//                                 <p className="text-sm text-destructive flex items-center gap-1">
//                                     <AlertCircle className="h-3 w-3" />
//                                     {errors.category}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="fileFormat" className="required">
//                                 File Format *
//                             </Label>
//                             <Select
//                                 value={formData.fileFormat}
//                                 onValueChange={(value) => handleInputChange('fileFormat', value)}
//                             >
//                                 <SelectTrigger className={errors.fileFormat ? 'border-destructive' : ''}>
//                                     <SelectValue placeholder="Select format" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {fileFormats.map((format) => (
//                                         <SelectItem key={format.value} value={format.value}>
//                                             {format.label}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                             {errors.fileFormat && (
//                                 <p className="text-sm text-destructive flex items-center gap-1">
//                                     <AlertCircle className="h-3 w-3" />
//                                     {errors.fileFormat}
//                                 </p>
//                             )}
//                         </div>
//                     </div>

//                     {/* Version and Jurisdiction */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="version">Version</Label>
//                             <Input
//                                 id="version"
//                                 placeholder="1.0"
//                                 value={formData.version}
//                                 onChange={(e) => handleInputChange('version', e.target.value)}
//                                 className={errors.version ? 'border-destructive' : ''}
//                             />
//                             {errors.version && (
//                                 <p className="text-sm text-destructive flex items-center gap-1">
//                                     <AlertCircle className="h-3 w-3" />
//                                     {errors.version}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="jurisdiction">Jurisdiction</Label>
//                             <Input
//                                 id="jurisdiction"
//                                 placeholder="e.g., Pakistan, Punjab"
//                                 value={formData.jurisdiction}
//                                 onChange={(e) => handleInputChange('jurisdiction', e.target.value)}
//                             />
//                         </div>
//                     </div>

//                     {/* Tags */}
//                     <div className="space-y-2">
//                         <Label htmlFor="tags">Tags (Max 20)</Label>
//                         <div className="flex gap-2">
//                             <Input
//                                 id="tags"
//                                 placeholder="Add a tag..."
//                                 value={tagInput}
//                                 onChange={(e) => setTagInput(e.target.value)}
//                                 onKeyPress={(e) => {
//                                     if (e.key === 'Enter') {
//                                         e.preventDefault();
//                                         handleAddTag();
//                                     }
//                                 }}
//                                 disabled={formData.tags.length >= 20}
//                             />
//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={handleAddTag}
//                                 disabled={!tagInput.trim() || formData.tags.length >= 20}
//                             >
//                                 Add
//                             </Button>
//                         </div>
//                         {formData.tags.length > 0 && (
//                             <div className="flex flex-wrap gap-2 mt-2">
//                                 {formData.tags.map((tag) => (
//                                     <Badge
//                                         key={tag}
//                                         variant="secondary"
//                                         className="px-3 py-1"
//                                     >
//                                         {tag}
//                                         <button
//                                             type="button"
//                                             onClick={() => handleRemoveTag(tag)}
//                                             className="ml-2 hover:text-destructive"
//                                         >
//                                             <X className="h-3 w-3" />
//                                         </button>
//                                     </Badge>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* Public/Private */}
//                     <div className="flex items-center space-x-2">
//                         <input
//                             type="checkbox"
//                             id="isPublic"
//                             checked={formData.isPublic}
//                             onChange={(e) => handleInputChange('isPublic', e.target.checked)}
//                             className="rounded border-gray-300"
//                         />
//                         <Label htmlFor="isPublic" className="cursor-pointer">
//                             Make this dataset publicly accessible
//                         </Label>
//                     </div>

//                     {/* Footer */}
//                     <div className="flex justify-end gap-3 pt-4 border-t">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={handleClose}
//                             disabled={loading}
//                         >
//                             Cancel
//                         </Button>
//                         <Button type="submit" disabled={loading}>
//                             {loading ? (
//                                 <>
//                                     <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                                     Uploading...
//                                 </>
//                             ) : (
//                                 <>
//                                     <Upload className="mr-2 h-4 w-4" />
//                                     Upload Dataset
//                                 </>
//                             )}
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );

//     // Render to portal if available, otherwise render normally
//     const portalRoot = document.getElementById('portal-root') || document.body;
//     return ReactDOM.createPortal(modalContent, portalRoot);
// };

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js';
import { datasetService } from '@/services/datasetService';
import { cn } from '@/lib/utils';

export const UploadDatasetModal = ({ open, setOpen, onSuccess }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [formData, setFormData] = useState({
        name: '', description: '', category: '', fileFormat: '',
        version: '1.0', jurisdiction: '', tags: [], isPublic: true
    });

    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState({});

    const categories = [
        { value: 'case_law', label: 'Case Law' }, { value: 'statutes', label: 'Statutes' },
        { value: 'regulations', label: 'Regulations' }, { value: 'legal_forms', label: 'Legal Forms' },
        { value: 'precedents', label: 'Precedents' }, { value: 'financial_laws', label: 'Financial Laws' },
        { value: 'contract_templates', label: 'Contract Templates' }, { value: 'compliance_guidelines', label: 'Compliance Guidelines' },
        { value: 'other', label: 'Other' }
    ];

    const fileFormats = [
        { value: 'json', label: 'JSON (.json)' }, { value: 'csv', label: 'CSV (.csv)' },
        { value: 'txt', label: 'Text (.txt)' }, { value: 'pdf', label: 'PDF (.pdf)' },
        { value: 'docx', label: 'Word (.docx)' }, { value: 'xlsx', label: 'Excel (.xlsx)' }
    ];

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [open]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && open && !loading) handleClose();
        };
        if (open) window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [open, loading]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                toast({ title: 'Error', description: 'File size must be less than 50MB', variant: 'destructive', });
                return;
            }
            setSelectedFile(file);
            const extension = file.name.split('.').pop().toLowerCase();
            if (['json', 'csv', 'txt', 'pdf', 'docx', 'xlsx'].includes(extension)) {
                setFormData(prev => ({ ...prev, fileFormat: extension }));
            }
            if (!formData.name) {
                const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                setFormData(prev => ({ ...prev, name: nameWithoutExt }));
            }
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleAddTag = () => {
        if (tagInput.trim() && formData.tags.length < 20) {
            const newTag = tagInput.trim().toLowerCase();
            if (!formData.tags.includes(newTag)) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!selectedFile) newErrors.file = 'Please select a file to upload';
        if (!formData.name || formData.name.trim().length < 3) newErrors.name = 'Dataset name must be at least 3 characters';
        if (!formData.category) newErrors.category = 'Please select a category';
        if (!formData.fileFormat) newErrors.fileFormat = 'Please select a file format';
        if (formData.version && !/^\d+\.\d+$/.test(formData.version)) newErrors.version = 'Version must be in format X.Y (e.g., 1.0)';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast({ title: 'Validation Error', description: 'Please fix the errors in the form', variant: 'destructive', });
            return;
        }

        setLoading(true);
        try {
            const uploadData = new FormData();
            uploadData.append('file', selectedFile);
            uploadData.append('name', formData.name.trim());
            uploadData.append('description', formData.description.trim());
            uploadData.append('category', formData.category);
            uploadData.append('fileFormat', formData.fileFormat);
            uploadData.append('version', formData.version);
            uploadData.append('tags', JSON.stringify(formData.tags));
            uploadData.append('isPublic', formData.isPublic.toString());
            if (formData.jurisdiction) uploadData.append('jurisdiction', formData.jurisdiction.trim());

            await datasetService.createDataset(uploadData);

            setFormData({ name: '', description: '', category: '', fileFormat: '', version: '1.0', jurisdiction: '', tags: [], isPublic: true });
            setSelectedFile(null);
            setErrors({});
            toast({
                variant: 'success',
                title: 'Uploaded',
                description: 'Dataset uploaded successfully',
            });
            onSuccess();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to upload dataset';
            const validationErrors = error.response?.data?.errors;
            if (validationErrors && Array.isArray(validationErrors)) {
                const newErrors = {};
                validationErrors.forEach(err => { newErrors[err.field] = err.message; });
                setErrors(newErrors);
            }
            toast({ title: 'Upload Failed', description: errorMessage, variant: 'destructive', });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({ name: '', description: '', category: '', fileFormat: '', version: '1.0', jurisdiction: '', tags: [], isPublic: true });
            setSelectedFile(null);
            setErrors({});
            setTagInput('');
            setOpen(false);
        }
    };

    if (!open) return null;

    const modalContent = (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={(e) => { if (e.target === e.currentTarget && !loading) handleClose(); }}
        >
            <div 
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-blue-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
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
                                <Upload className="h-7 w-7 text-blue-700" strokeWidth={2.5} />
                                Upload New Dataset
                            </h2>
                            <p className="text-sm font-medium text-gray-500 mt-1" style={{ fontFamily: "Inter" }}>
                                Upload a legal dataset to train and improve the chatbot's knowledge base
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="rounded-full p-2 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                            <X className="h-6 w-6" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6" style={{ fontFamily: "Inter" }}>
                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="file" className="font-bold text-gray-700">
                            Dataset File *
                        </Label>
                        <div className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                            <input
                                id="file"
                                type="file"
                                accept=".json,.csv,.txt,.pdf,.docx,.xlsx"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label htmlFor="file" className="cursor-pointer block w-full h-full">
                                {selectedFile ? (
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="bg-blue-100 p-3 rounded-xl">
                                            <FileText className="h-8 w-8 text-blue-700" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-800 text-lg">{selectedFile.name}</p>
                                            <p className="text-sm font-medium text-blue-600">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="ml-auto hover:bg-red-50 hover:text-red-600 rounded-lg"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedFile(null);
                                            }}
                                        >
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-blue-100">
                                            <Upload className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <p className="text-base font-bold text-gray-700">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-sm font-medium text-gray-500 mt-2">
                                            JSON, CSV, TXT, PDF, DOCX, XLSX (Max 50MB)
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>
                        {errors.file && (
                            <p className="text-sm font-bold text-red-500 flex items-center gap-1.5 mt-2">
                                <AlertCircle className="h-4 w-4" /> {errors.file}
                            </p>
                        )}
                    </div>

                    {/* Dataset Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="font-bold text-gray-700">Dataset Name *</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Pakistan Financial Laws 2026"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={cn("rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500", errors.name && 'border-red-500')}
                        />
                        {errors.name && (
                            <p className="text-sm font-bold text-red-500 flex items-center gap-1.5 mt-1">
                                <AlertCircle className="h-4 w-4" /> {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="font-bold text-gray-700">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Brief description of the dataset contents..."
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={3}
                            className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Category and Format */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="font-bold text-gray-700">Category *</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                <SelectTrigger className={cn("rounded-xl border-gray-300", errors.category && 'border-red-500')}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value} className="rounded-lg">{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-sm font-bold text-red-500 flex items-center gap-1.5 mt-1">
                                    <AlertCircle className="h-4 w-4" /> {errors.category}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fileFormat" className="font-bold text-gray-700">File Format *</Label>
                            <Select value={formData.fileFormat} onValueChange={(value) => handleInputChange('fileFormat', value)}>
                                <SelectTrigger className={cn("rounded-xl border-gray-300", errors.fileFormat && 'border-red-500')}>
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {fileFormats.map((format) => (
                                        <SelectItem key={format.value} value={format.value} className="rounded-lg">{format.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.fileFormat && (
                                <p className="text-sm font-bold text-red-500 flex items-center gap-1.5 mt-1">
                                    <AlertCircle className="h-4 w-4" /> {errors.fileFormat}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Version and Jurisdiction */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="version" className="font-bold text-gray-700">Version</Label>
                            <Input
                                id="version"
                                placeholder="1.0"
                                value={formData.version}
                                onChange={(e) => handleInputChange('version', e.target.value)}
                                className={cn("rounded-xl border-gray-300", errors.version && 'border-red-500')}
                            />
                            {errors.version && (
                                <p className="text-sm font-bold text-red-500 flex items-center gap-1.5 mt-1">
                                    <AlertCircle className="h-4 w-4" /> {errors.version}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jurisdiction" className="font-bold text-gray-700">Jurisdiction</Label>
                            <Input
                                id="jurisdiction"
                                placeholder="e.g., Pakistan, Punjab"
                                value={formData.jurisdiction}
                                onChange={(e) => handleInputChange('jurisdiction', e.target.value)}
                                className="rounded-xl border-gray-300"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="tags" className="font-bold text-gray-700">Tags (Max 20)</Label>
                        <div className="flex gap-3">
                            <Input
                                id="tags"
                                placeholder="Add a tag..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                disabled={formData.tags.length >= 20}
                                className="rounded-xl border-gray-300"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-xl font-bold border-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                                onClick={handleAddTag}
                                disabled={!tagInput.trim() || formData.tags.length >= 20}
                            >
                                Add Tag
                            </Button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                {formData.tags.map((tag) => (
                                    <Badge key={tag} className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                                        {tag}
                                        <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 ml-1">
                                            <X className="h-3 w-3" strokeWidth={3} />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Public/Private */}
                    <div className="flex items-center space-x-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={formData.isPublic}
                            onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500 h-5 w-5 border-gray-300 cursor-pointer"
                        />
                        <Label htmlFor="isPublic" className="cursor-pointer font-bold text-gray-700 select-none">
                            Make this dataset publicly accessible
                        </Label>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-6 border-t-2 border-blue-50 mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl font-bold border-2 border-gray-200 hover:bg-gray-50 px-6"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold px-6 shadow-lg shadow-blue-500/30 transition-all duration-300"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-5 w-5" />
                                    Upload Dataset
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );

    const portalRoot = document.getElementById('portal-root') || document.body;
    return ReactDOM.createPortal(modalContent, portalRoot);
};