import { create } from 'zustand';

export interface FilterState {
  column: string;
  value: string;
}

export interface AIProfile {
  domain: string;
  summary: string;
  recommendedAnalysis: string[];
  metrics: string[];
  dimensions: string[];
}

interface DashboardState {
  globalData: any[];
  filteredData: any[];
  activeFilters: FilterState[];
  aiProfile: AIProfile | null;
  setGlobalData: (data: any[]) => void;
  setAiProfile: (profile: AIProfile | null) => void;
  addFilter: (filter: FilterState) => void;
  removeFilter: (column: string) => void;
  clearFilters: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  globalData: [],
  filteredData: [],
  activeFilters: [],
  aiProfile: null,
  activeTab: 'visualizations',
  isLoggedIn: false,
  isLoginModalOpen: false,
  
  setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
  setLoginModalOpen: (open) => set({ isLoginModalOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  setGlobalData: (data) => set({ 
    globalData: data, 
    filteredData: data,
    activeFilters: []
  }),

  setAiProfile: (profile) => set({ aiProfile: profile }),
  
  addFilter: (filter) => set((state) => {
    // If clicking same value again, remove filter (toggle)
    const existing = state.activeFilters.find(f => f.column === filter.column);
    let newFilters = [...state.activeFilters];
    
    if (existing && existing.value === filter.value) {
      newFilters = newFilters.filter(f => f.column !== filter.column);
    } else {
      newFilters = newFilters.filter(f => f.column !== filter.column);
      newFilters.push(filter);
    }

    // Apply all active filters to globalData
    let newFilteredData = [...state.globalData];
    newFilters.forEach(f => {
      newFilteredData = newFilteredData.filter(row => String(row[f.column]) === f.value);
    });

    return {
      activeFilters: newFilters,
      filteredData: newFilteredData
    };
  }),
  
  removeFilter: (column) => set((state) => {
    const newFilters = state.activeFilters.filter(f => f.column !== column);
    
    let newFilteredData = [...state.globalData];
    newFilters.forEach(f => {
      newFilteredData = newFilteredData.filter(row => String(row[f.column]) === f.value);
    });

    return {
      activeFilters: newFilters,
      filteredData: newFilteredData
    };
  }),

  clearFilters: () => set((state) => ({
    activeFilters: [],
    filteredData: state.globalData
  }))
}));
