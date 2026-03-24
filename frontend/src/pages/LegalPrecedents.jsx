import React, { useState } from 'react';
import { Search, Menu, Scale, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function LegalPrecedents() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [precedents, setPrecedents] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    // Mock API
    setTimeout(() => {
      setPrecedents([
        { id: 1, caseNo: 'Crl.A. 45/2021', title: 'State vs. Anderson Corporation', judge: 'Hon. Justice Smith', date: '2021-10-14', match: '98%' },
        { id: 2, caseNo: 'W.P.(C) 112/2019', title: 'Tax Authority vs. Nexus Ltd', judge: 'Hon. Justice Doe', date: '2019-04-22', match: '85%' },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-blue-50/30">
      {/* Header Inline */}
      <header className="bg-white/95 backdrop-blur-md border-b-2 border-blue-100 px-6 py-4 flex items-center gap-4 z-20">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 hover:bg-blue-50 rounded-xl text-blue-700">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent" style={{ fontFamily: "Poppins" }}>
          Legal Precedents Database
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 lg:p-12 max-w-6xl mx-auto w-full">
        {/* Search Header */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-3xl p-8 lg:p-12 mb-8 text-center shadow-xl text-white">
          <Scale className="h-12 w-12 mx-auto text-blue-200 mb-4" />
          <h2 className="text-3xl lg:text-4xl font-black mb-3" style={{ fontFamily: "Poppins" }}>Search Case Law & Precedents</h2>
          <p className="text-blue-100 font-medium mb-8 max-w-2xl mx-auto" style={{ fontFamily: "Inter" }}>
            Query our extensive database of historical judgements to strengthen your legal arguments.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="E.g., Corporate tax evasion liabilities..."
              className="w-full bg-white text-gray-900 rounded-2xl py-4 pl-14 pr-32 text-lg font-medium outline-none shadow-lg focus:ring-4 focus:ring-blue-400/50 transition-all"
              style={{ fontFamily: "Inter" }}
            />
            <Button 
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="absolute inset-y-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 font-bold"
            >
              Search
            </Button>
          </form>
        </div>

        {/* States */}
        {isLoading && (
          <div className="flex justify-center py-20 animate-pulse">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-bold" style={{ fontFamily: "Inter" }}>Retrieving precedents...</p>
            </div>
          </div>
        )}

        {!isLoading && hasSearched && precedents.length === 0 && (
          <div className="bg-white border-2 border-blue-100 rounded-3xl p-16 text-center shadow-sm">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Poppins" }}>No Precedents Found</h3>
            <p className="text-gray-500 font-medium">Try adjusting your search terminology.</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && precedents.length > 0 && (
          <Card className="border-2 border-blue-100 shadow-lg rounded-2xl overflow-hidden animate-slide-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-50 border-b-2 border-blue-100 text-gray-800 font-bold uppercase text-xs tracking-wider" style={{ fontFamily: "Inter" }}>
                    <th className="p-4">Case No.</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Judge / Date</th>
                    <th className="p-4 text-center">Match</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-50">
                  {precedents.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-bold text-gray-900" style={{ fontFamily: "Inter" }}>{item.caseNo}</td>
                      <td className="p-4 font-medium text-gray-700">{item.title}</td>
                      <td className="p-4">
                        <p className="font-bold text-sm text-gray-800">{item.judge}</p>
                        <p className="text-xs text-gray-500 font-medium">{item.date}</p>
                      </td>
                      <td className="p-4 text-center">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 font-bold px-3 py-1">
                          {item.match}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" className="hover:bg-blue-100 hover:text-blue-700 text-gray-500 rounded-xl">
                          <Download className="h-5 w-5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}