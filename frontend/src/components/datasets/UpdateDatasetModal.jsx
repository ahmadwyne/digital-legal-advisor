import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { datasetService } from '@/services/datasetService';

export const UpdateDatasetModal = ({ open, onClose, dataset, onSuccess }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [replaceFile, setReplaceFile] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        fileFormat: '',
        version: '',
        jurisdiction: '',
        tags: [],
        isPublic: true,
        status: ''
    });

    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState({});

    const categories = [
        { value: 'case_law', label: 'Case Law' },
        { value: 'statutes', label: 'Statutes' },
        { value: 'regulations', label: 'Regulations' },
        { value: 'legal_forms', label: 'Legal Forms' },
        { value: 'precedents', label: 'Precedents' },
        { value: 'financial_laws', label: 'Financial Laws' },
        { value: 'contract_templates', label: 'Contract Templates' },
        { value: 'compliance_guidelines', label: 'Compliance Guidelines' },
        { value: 'other', label: 'Other' }
    ];

    const statuses = [
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'archived', label: 'Archived' }
    ];

    // Initialize form with dataset data
    useEffect(() => {
        if (dataset) {
            setFormData({
                name: dataset.name || '',
                description: dataset.description || '',
                category: dataset.category || '',
                fileFormat: dataset.fileFormat || '',
                version: dataset.version || '',
                jurisdiction: dataset.jurisdiction || '',
                tags: dataset.tags || [],
                isPublic: dataset.isPublic !== undefined ? dataset.isPublic : true,
                status: dataset.status || 'active'
            });
        }
    }, [dataset]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (500MB max)
            if (file.size > 500 * 1024 * 1024) {
                toast({
                    title: 'Error',
                    description: 'File size must be less than 500MB',
                    variant: 'destructive',
                });
                return;
            }

            setSelectedFile(file);

            // Update file format if changed
            const extension = file.name.split('.').pop().toLowerCase();
            if (['json', 'csv', 'txt', 'pdf', 'docx', 'xlsx'].includes(extension)) {
                setFormData(prev => ({ ...prev, fileFormat: extension }));
            }
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && formData.tags.length < 20) {
            const newTag = tagInput.trim().toLowerCase();
            if (!formData.tags.includes(newTag)) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, newTag]
                }));
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name || formData.name.trim().length < 3) {
            newErrors.name = 'Dataset name must be at least 3 characters';
        }

        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        if (formData.version && !/^\d+\.\d+$/.test(formData.version)) {
            newErrors.version = 'Version must be in format X.Y (e.g., 1.0)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: 'Validation Error',
                description: 'Please fix the errors in the form',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);

        try {
            const updateData = new FormData();

            // Only add file if replacing
            if (replaceFile && selectedFile) {
                updateData.append('file', selectedFile);
            }

            updateData.append('name', formData.name.trim());
            updateData.append('description', formData.description.trim());
            updateData.append('category', formData.category);
            updateData.append('fileFormat', formData.fileFormat);
            updateData.append('version', formData.version);
            updateData.append('tags', JSON.stringify(formData.tags));
            updateData.append('isPublic', formData.isPublic.toString());
            updateData.append('status', formData.status);

            if (formData.jurisdiction) {
                updateData.append('jurisdiction', formData.jurisdiction.trim());
            }

            await datasetService.updateDataset(dataset.id, updateData);

            onSuccess();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update dataset';
            const validationErrors = error.response?.data?.errors;

            if (validationErrors && Array.isArray(validationErrors)) {
                const newErrors = {};
                validationErrors.forEach(err => {
                    newErrors[err.field] = err.message;
                });
                setErrors(newErrors);
            }

            toast({
                title: 'Update Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setSelectedFile(null);
            setReplaceFile(false);
            setErrors({});
            setTagInput('');
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            if (!loading) {
                if (!newOpen) {
                    handleClose();
                } else {
                    setOpen(newOpen);
                }
            }
        }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <RefreshCw className="h-6 w-6" />
                        Update Dataset
                    </DialogTitle>
                    <DialogDescription>
                        Update dataset information or replace the file
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Current File Info */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Current File</p>
                                <p className="text-sm text-muted-foreground">
                                    {dataset?.name}.{dataset?.fileFormat}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setReplaceFile(!replaceFile)}
                            >
                                {replaceFile ? 'Keep Current File' : 'Replace File'}
                            </Button>
                        </div>
                    </div>

                    {/* File Upload (if replacing) */}
                    {replaceFile && (
                        <div className="space-y-2">
                            <Label htmlFor="file">
                                New Dataset File
                            </Label>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                                <input
                                    id="file"
                                    type="file"
                                    accept=".json,.csv,.txt,.pdf,.docx,.xlsx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label htmlFor="file" className="cursor-pointer">
                                    {selectedFile ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <FileText className="h-8 w-8 text-primary" />
                                            <div className="text-left">
                                                <p className="font-medium">{selectedFile.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedFile(null);
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                            <p className="text-sm font-medium">
                                                Click to upload new file
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                JSON, CSV, TXT, PDF, DOCX, XLSX (Max 500MB)
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Dataset Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="required">
                            Dataset Name *
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g., Pakistan Financial Laws 2026"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Brief description of the dataset contents..."
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Category and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="required">
                                Category *
                            </Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleInputChange('category', value)}
                            >
                                <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleInputChange('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Version and Jurisdiction */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="version">Version</Label>
                            <Input
                                id="version"
                                placeholder="1.0"
                                value={formData.version}
                                onChange={(e) => handleInputChange('version', e.target.value)}
                                className={errors.version ? 'border-destructive' : ''}
                            />
                            {errors.version && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.version}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jurisdiction">Jurisdiction</Label>
                            <Input
                                id="jurisdiction"
                                placeholder="e.g., Pakistan, Punjab"
                                value={formData.jurisdiction}
                                onChange={(e) => handleInputChange('jurisdiction', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (Max 20)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="tags"
                                placeholder="Add a tag..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                disabled={formData.tags.length >= 20}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddTag}
                                disabled={!tagInput.trim() || formData.tags.length >= 20}
                            >
                                Add
                            </Button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="px-3 py-1"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-2 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Public/Private */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={formData.isPublic}
                            onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <Label htmlFor="isPublic" className="cursor-pointer">
                            Make this dataset publicly accessible
                        </Label>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Update Dataset
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};