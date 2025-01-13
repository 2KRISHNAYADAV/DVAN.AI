import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, Brain, PieChart } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart },
    { id: 'descriptive', label: 'Statistics', icon: PieChart },
    { id: 'trends', label: 'Trends', icon: LineChart },
    { id: 'predictive', label: 'Predictions', icon: Brain },
  ];

  return (
    <nav className="flex justify-center gap-4 mb-8">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant={activeTab === item.id ? 'default' : 'outline'}
          onClick={() => onTabChange(item.id)}
          className="gap-2"
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </Button>
      ))}
    </nav>
  );
};