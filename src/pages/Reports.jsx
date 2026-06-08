import React from 'react';
import { FileText } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 mt-2 text-lg">System analytics and performance logs.</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Reports Generated</h3>
        <p className="text-gray-500 text-center max-w-md">
          The reports module will aggregate machine usage and efficiency data. This feature is currently under construction.
        </p>
      </div>
    </div>
  );
}