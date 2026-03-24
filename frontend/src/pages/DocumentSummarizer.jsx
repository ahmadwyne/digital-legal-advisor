import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, ArrowRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LogoSpinner from '@/components/ui/LogoSpinner';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function DocumentSummarizer() {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return;

    setIsProcessing(true);
    setSummary(null);

    // Mock API Delay
    setTimeout(() => {
      setSummary(`This document outlines a standard non-disclosure agreement (NDA). Key points include:\n\n1. The receiving party must maintain strict confidentiality of all disclosed proprietary information.\n2. The obligation of confidentiality persists for 5 years post-termination.\n3. Exclusions apply to information already in the public domain.\n4. Jurisdiction for disputes is established in the local state courts.`);
      setIsProcessing(false);
      toast({ title: 'Success', description: 'Document summarized successfully.' });
    }, 2500);
  };

  return (
    <div className="flex flex-col h-screen bg-blue-50/30">
      {/* Header Inline */}
      <header className="bg-white/95 backdrop-blur-md border-b-2 border-blue-100 px-6 py-4 flex items-center gap-4 z-20">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 hover:bg-blue-50 rounded-xl text-blue-700">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent" style={{ fontFamily: "Poppins" }}>
          Document Summarizer
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 max-w-5xl mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "Poppins" }}>Extract Key Legal Insights</h2>
            <p className="text-gray-600 font-medium" style={{ fontFamily: "Inter" }}>Upload lengthy legal documents and let AI generate concise, actionable summaries.</p>
          </div>

          {!summary && !isProcessing && (
            <div className="bg-white border-2 border-dashed border-blue-200 rounded-3xl p-12 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all animate-fade-in shadow-sm">
              <input 
                type="file" 
                id="doc-upload" 
                className="hidden" 
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="doc-upload" className="cursor-pointer block">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UploadCloud className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Poppins" }}>
                  {file ? file.name : "Select a document to summarize"}
                </h3>
                <p className="text-sm font-medium text-gray-500 mb-6" style={{ fontFamily: "Inter" }}>
                  Supported formats: PDF, DOC, DOCX, TXT (Max 20MB)
                </p>
                <Button 
                  onClick={file ? handleUpload : undefined}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                  style={{ fontFamily: "Inter" }}
                >
                  {file ? 'Summarize Now' : 'Browse Files'} {file && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </label>
            </div>
          )}

          {isProcessing && (
            <div className="bg-white border-2 border-blue-100 rounded-3xl p-16 text-center shadow-lg animate-pulse">
              <div className="flex items-center justify-center mb-6">
                <LogoSpinner size={64} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Poppins" }}>Analyzing Document...</h3>
              <p className="text-gray-500 font-medium text-sm">Extracting key clauses and entities.</p>
            </div>
          )}

          {summary && !isProcessing && (
            <div className="bg-white border-2 border-blue-100 rounded-3xl overflow-hidden shadow-lg animate-slide-in">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100 px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-black text-gray-900" style={{ fontFamily: "Poppins" }}>AI Summary Generated</h3>
                </div>
                <Button variant="outline" className="rounded-xl border-2 border-blue-200 text-blue-700 font-bold" onClick={() => { setSummary(null); setFile(null); }}>
                  Summarize Another
                </Button>
              </div>
              <div className="p-8">
                <p className="text-gray-800 leading-relaxed font-medium whitespace-pre-wrap" style={{ fontFamily: "Inter" }}>
                  {summary}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}