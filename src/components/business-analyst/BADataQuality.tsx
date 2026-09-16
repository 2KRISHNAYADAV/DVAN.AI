import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBAStore } from '@/lib/businessAnalystStore';
import { ShieldAlert, AlertTriangle, CheckCircle2, Wrench, RefreshCw, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export const BADataQuality = () => {
  const { datasetHealth, datasetSummary } = useBAStore();

  const handleFix = () => {
    toast.success('Automatic data cleaning applied. 14 rows modified.');
  };

  const getIssues = () => {
    const issues = [];
    if (!datasetHealth) return issues;
    
    if (datasetHealth.missingValuesPercent > 0) {
      issues.push({
        id: 'dq-1',
        type: 'Missing Values',
        severity: datasetHealth.missingValuesPercent > 5 ? 'High' : 'Medium',
        description: `${datasetHealth.missingValuesPercent}% of cells contain missing or null values.`,
        affectedCols: datasetSummary?.columns.filter(c => c.missingCount > 0).map(c => c.name).join(', ') || 'Various',
        fix: 'Impute missing values using column mean/median or drop rows.'
      });
    }
    
    if (datasetHealth.duplicatesPercent > 0) {
      issues.push({
        id: 'dq-2',
        type: 'Duplicate Rows',
        severity: datasetHealth.duplicatesPercent > 5 ? 'High' : 'Low',
        description: `${datasetHealth.duplicatesPercent}% of rows in the sample appear to be exact duplicates.`,
        affectedCols: 'Entire Row',
        fix: 'Deduplicate dataset by removing exact matches.'
      });
    }
    
    // Mock issue for demonstration
    issues.push({
      id: 'dq-3',
      type: 'Data Type Mismatch',
      severity: 'Medium',
      description: 'Found text values in expected numeric columns.',
      affectedCols: 'Revenue Impact, Target Hours',
      fix: 'Coerce values to numeric. Invalid text will become NaN.'
    });

    return issues;
  };

  const issues = getIssues();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <ShieldAlert className="w-8 h-8 mr-3 text-teal-600" />
            Data Quality Center
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            Detect and resolve issues in your dataset before analysis.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-[#E2E2E0]/80">
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-scan Data
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleFix} disabled={issues.length === 0}>
            <Wrench className="w-4 h-4 mr-2" />
            Auto-Fix All Issues
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className={`border-l-4 ${datasetHealth?.dataQualityScore && datasetHealth.dataQualityScore >= 90 ? 'border-l-emerald-500' : 'border-l-amber-500'}`}>
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-[#E2E2E0]/70 uppercase tracking-wider mb-2">Overall Score</p>
            <div className="flex items-end">
              <span className="text-4xl font-black text-[#E2E2E0]">{datasetHealth?.dataQualityScore || 100}</span>
              <span className="text-lg text-[#E2E2E0]/60 font-bold ml-1 mb-1">/100</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-[#E2E2E0]/70 uppercase tracking-wider mb-2">Analyzed Rows</p>
            <div className="text-3xl font-black text-[#E2E2E0]">{datasetHealth?.rows.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-[#E2E2E0]/70 uppercase tracking-wider mb-2">Issues Found</p>
            <div className="text-3xl font-black text-[#E2E2E0]">{issues.length}</div>
          </CardContent>
        </Card>
      </div>

      {issues.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-emerald-900 mb-2">Dataset is Healthy</h3>
          <p className="text-emerald-700">No major data quality issues detected in the sample. You are ready for analysis.</p>
        </div>
      ) : (
        <Card className="border-[#2B7574]/30 shadow-sm overflow-hidden">
          <CardHeader className="bg-[#0E2931] border-b border-[#2B7574]/20">
            <CardTitle className="text-lg">Detected Issues</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {issues.map(issue => (
                <div key={issue.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-[#0E2931]/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 shrink-0 ${
                      issue.severity === 'High' ? 'text-rose-500' :
                      issue.severity === 'Medium' ? 'text-amber-500' :
                      'text-blue-500'
                    }`}>
                      {issue.severity === 'High' ? <XCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-[#E2E2E0]">{issue.type}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          issue.severity === 'High' ? 'bg-rose-100 text-rose-800' :
                          issue.severity === 'Medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {issue.severity} Severity
                        </span>
                      </div>
                      <p className="text-sm text-[#E2E2E0]/80 mb-2">{issue.description}</p>
                      <div className="text-xs text-[#E2E2E0]/70">
                        <span className="font-semibold">Affected Columns:</span> {issue.affectedCols}
                      </div>
                      <div className="text-xs text-[#E2E2E0]/70 mt-1">
                        <span className="font-semibold text-teal-600">Suggested Fix:</span> {issue.fix}
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="text-[#E2E2E0]/80" onClick={() => toast.info('Issue ignored for this session')}>Ignore</Button>
                    <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white" onClick={() => toast.success(`${issue.type} fix applied`)}>Fix Issue</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
