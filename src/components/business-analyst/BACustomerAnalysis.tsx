import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertCircle } from 'lucide-react';

export const BACustomerAnalysis = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <Users className="w-8 h-8 mr-3 text-teal-600" />
            Customer Analytics
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            Deep dive into customer segmentation, retention, and LTV.
          </p>
        </div>
      </div>

      <Card className="border-dashed border-2 border-[#2B7574]/30 bg-[#0E2931] shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-[#E2E2E0] mb-2">Insufficient Customer Data</h3>
          <p className="text-[#E2E2E0]/70 max-w-md">
            The uploaded dataset does not contain enough customer-identifying columns (e.g., Customer ID, Cohort, Churn Date) to generate the Customer Analytics dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
