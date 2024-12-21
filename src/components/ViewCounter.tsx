import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

const ViewCounter = () => {
  const [views, setViews] = useState(() => {
    const savedViews = localStorage.getItem('pageViews');
    // Start from 2000 if no previous views are stored
    return savedViews ? parseInt(savedViews) : 2000;
  });

  useEffect(() => {
    const incrementViews = () => {
      const newViews = views + 1;
      setViews(newViews);
      localStorage.setItem('pageViews', newViews.toString());
    };

    incrementViews();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-purple-100 flex items-center gap-2">
      <Eye className="w-4 h-4 text-purple-600" />
      <span className="text-sm font-medium text-purple-900">
        {views.toLocaleString()} views
      </span>
    </div>
  );
};

export default ViewCounter;