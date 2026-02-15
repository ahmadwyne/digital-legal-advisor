import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

export const DeleteConfirmationDialog = ({ open, onClose, onConfirm, datasetName }) => {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Dataset
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                        <p>
                            Are you sure you want to delete <strong>{datasetName}</strong>?
                        </p>
                        <p className="text-sm">
                            This will soft delete the dataset. It will be archived and can be restored later if needed.
                        </p>
                        <p className="text-sm font-medium text-destructive">
                            This action cannot be undone immediately.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        Delete Dataset
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};