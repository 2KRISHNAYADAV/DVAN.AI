import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBAStore } from '@/lib/businessAnalystStore';
import { ClipboardList, Plus, Trash2, Check, Download } from 'lucide-react';
import { ActionItem } from '@/lib/businessAnalystTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export const BAActionPlan = () => {
  const { actionPlan, setActionPlan } = useBAStore();
  const [newItem, setNewItem] = useState<Partial<ActionItem>>({
    action: '', owner: '', priority: 'Medium', deadline: '', status: 'Not Started', expectedOutcome: ''
  });

  const handleAdd = () => {
    if (!newItem.action) {
      toast.error('Action description is required');
      return;
    }
    
    const item: ActionItem = {
      id: `act-manual-${Date.now()}`,
      action: newItem.action,
      owner: newItem.owner || 'Unassigned',
      priority: newItem.priority as any || 'Medium',
      deadline: newItem.deadline || 'TBD',
      status: newItem.status as any || 'Not Started',
      expectedOutcome: newItem.expectedOutcome || 'TBD'
    };
    
    setActionPlan([...actionPlan, item]);
    setNewItem({ action: '', owner: '', priority: 'Medium', deadline: '', status: 'Not Started', expectedOutcome: '' });
    toast.success('Action added');
  };

  const handleUpdateStatus = (id: string, status: ActionItem['status']) => {
    setActionPlan(actionPlan.map(item => item.id === id ? { ...item, status } : item));
  };

  const handleDelete = (id: string) => {
    setActionPlan(actionPlan.filter(item => item.id !== id));
    toast.success('Action removed');
  };

  const exportCSV = () => {
    if (actionPlan.length === 0) return;
    
    const headers = ['Action', 'Owner', 'Priority', 'Deadline', 'Status', 'Expected Outcome'];
    const rows = actionPlan.map(a => [
      `"${a.action.replace(/"/g, '""')}"`,
      `"${a.owner}"`,
      a.priority,
      `"${a.deadline}"`,
      a.status,
      `"${a.expectedOutcome.replace(/"/g, '""')}"`
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business-action-plan.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#E2E2E0] flex items-center">
            <ClipboardList className="w-8 h-8 mr-3 text-teal-600" />
            Execution Action Plan
          </h2>
          <p className="text-[#E2E2E0]/70 text-lg mt-1">
            Track and manage strategic initiatives to improve business performance.
          </p>
        </div>
        <Button variant="outline" className="text-[#E2E2E0]" onClick={exportCSV} disabled={actionPlan.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card className="border-[#2B7574]/30 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0E2931] border-b border-[#2B7574]/30 text-xs font-bold text-[#E2E2E0]/70 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-1/3">Strategic Action</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Timeline</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {actionPlan.map(item => (
                  <tr key={item.id} className={`hover:bg-[#0E2931]/50 transition-colors ${item.status === 'Completed' ? 'opacity-70 bg-[#0E2931]' : ''}`}>
                    <td className="p-4 pl-6">
                      <p className={`font-semibold text-sm text-[#E2E2E0] ${item.status === 'Completed' ? 'line-through text-[#E2E2E0]/70' : ''}`}>
                        {item.action}
                      </p>
                      <p className="text-xs text-[#E2E2E0]/70 mt-1 line-clamp-1">{item.expectedOutcome}</p>
                    </td>
                    <td className="p-4 text-sm font-medium text-[#E2E2E0]">{item.owner}</td>
                    <td className="p-4 text-sm text-[#E2E2E0]/80">{item.deadline}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.priority === 'High' ? 'bg-rose-100 text-rose-800' :
                        item.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-[rgba(14,41,49,0.8)] text-[#E2E2E0]'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <Select value={item.status} onValueChange={(val: any) => handleUpdateStatus(item.id, val)}>
                        <SelectTrigger className={`h-8 text-xs font-semibold ${
                          item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          item.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-[#0E2931] text-[#E2E2E0]/80 border-[#2B7574]/30'
                        }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Button variant="ghost" size="icon" className="text-[#E2E2E0]/60 hover:text-rose-500 hover:bg-rose-50" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {/* Add New Row */}
                <tr className="bg-[#0E2931]/50">
                  <td className="p-4 pl-6">
                    <Input 
                      placeholder="Add new action item..." 
                      className="bg-[#12484C] border-[#2B7574]/30 h-9 text-sm"
                      value={newItem.action}
                      onChange={e => setNewItem({...newItem, action: e.target.value})}
                    />
                  </td>
                  <td className="p-4">
                    <Input 
                      placeholder="Owner" 
                      className="bg-[#12484C] border-[#2B7574]/30 h-9 text-sm"
                      value={newItem.owner}
                      onChange={e => setNewItem({...newItem, owner: e.target.value})}
                    />
                  </td>
                  <td className="p-4">
                    <Input 
                      placeholder="Deadline" 
                      className="bg-[#12484C] border-[#2B7574]/30 h-9 text-sm"
                      value={newItem.deadline}
                      onChange={e => setNewItem({...newItem, deadline: e.target.value})}
                    />
                  </td>
                  <td className="p-4">
                    <Select value={newItem.priority} onValueChange={(val: any) => setNewItem({...newItem, priority: val})}>
                      <SelectTrigger className="h-9 bg-[#12484C] border-[#2B7574]/30 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-semibold text-[#E2E2E0]/60 px-2 py-1 bg-[rgba(14,41,49,0.8)] rounded block text-center">
                      Not Started
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <Button size="icon" className="h-9 w-9 bg-teal-600 hover:bg-teal-700 text-white" onClick={handleAdd}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {actionPlan.length === 0 && (
        <div className="text-center p-8">
          <p className="text-[#E2E2E0]/70">Your action plan is empty. Generate recommendations to populate it automatically.</p>
        </div>
      )}
    </div>
  );
};
