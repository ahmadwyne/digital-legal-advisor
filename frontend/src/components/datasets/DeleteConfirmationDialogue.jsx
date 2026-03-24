// import React, { useEffect } from 'react';
// import ReactDOM from 'react-dom';
// import { Button } from '@/components/ui/button';
// import { AlertTriangle } from 'lucide-react';

// export const DeleteConfirmationDialog = ({ open, onClose, onConfirm, datasetName }) => {
//     // Lock body scroll when dialog is open
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

//     if (!open) return null;

//     const dialogContent = (
//         <div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
//             onClick={(e) => {
//                 if (e.target === e.currentTarget) {
//                     onClose();
//                 }
//             }}
//         >
//             <div
//                 className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 {/* Header */}
//                 <div className="p-6 pb-4">
//                     <div className="flex items-center gap-2 text-destructive mb-2">
//                         <AlertTriangle className="h-5 w-5" />
//                         <h2 className="text-lg font-semibold">Delete Dataset</h2>
//                     </div>
//                     <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
//                         <p>
//                             Are you sure you want to delete <strong className="text-foreground">{datasetName}</strong>?
//                         </p>
//                         <p>
//                             This will soft delete the dataset. It will be archived and can be restored later if needed.
//                         </p>
//                         <p className="font-medium text-destructive">
//                             This action cannot be undone immediately.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="flex justify-end gap-3 p-6 pt-2">
//                     <Button
//                         type="button"
//                         variant="outline"
//                         onClick={onClose}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         type="button"
//                         variant="destructive"
//                         onClick={() => {
//                             onConfirm();
//                         }}
//                     >
//                         Delete Dataset
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );

//     const portalRoot = document.getElementById('portal-root') || document.body;
//     return ReactDOM.createPortal(dialogContent, portalRoot);
// };
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export const DeleteConfirmationDialog = ({ open, onClose, onConfirm, datasetName }) => {
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

    if (!open) return null;

    const dialogContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="admin-modal bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-red-100 w-full max-w-md animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 pb-4">
                    <div className="flex items-center gap-3 text-red-600 mb-4">
                        <div className="bg-red-100 p-2.5 rounded-xl">
                            <AlertTriangle className="h-6 w-6 text-red-600" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black" style={{ fontFamily: "Poppins" }}>Delete Dataset</h2>
                    </div>
                    <div className="space-y-3 text-sm font-medium text-gray-600 dark:text-gray-400" style={{ fontFamily: "Inter" }}>
                        <p className="text-base">
                            Are you sure you want to delete <strong className="text-gray-900 font-bold">{datasetName}</strong>?
                        </p>
                        <div className="bg-red-50 text-red-800 p-3 rounded-xl border border-red-100">
                            <p>
                                This will soft delete the dataset. It will be archived and can be restored later if needed.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl font-bold border-2 border-gray-200 hover:bg-gray-50"
                        style={{ fontFamily: "Inter" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/30"
                        style={{ fontFamily: "Inter" }}
                        onClick={() => {
                            onConfirm();
                        }}
                    >
                        Delete Dataset
                    </Button>
                </div>
            </div>
        </div>
    );

    const portalRoot = document.getElementById('portal-root') || document.body;
    return ReactDOM.createPortal(dialogContent, portalRoot);
};