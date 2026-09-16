import { create } from 'zustand';
import cloneDeep from 'lodash/cloneDeep';

export type CellType = 'exploration' | 'cleaning' | 'analysis' | 'visualization' | 'ml' | 'ai' | 'nlp';

export interface NotebookCellState {
  id: string;
  type: CellType;
  config: any; // Dynamic configuration based on cell type
  result: any; // Output to render
  datasetSnapshot?: any[]; // The state of the dataset AFTER this cell executes
}

interface NotebookState {
  cells: NotebookCellState[];
  baseDataset: any[]; // The original global data passed from Dashboard
  setBaseDataset: (data: any[]) => void;
  addCell: (type: CellType) => void;
  removeCell: (id: string) => void;
  updateCellConfig: (id: string, config: any) => void;
  setCellResult: (id: string, result: any, datasetSnapshot?: any[]) => void;
  getDatasetForCell: (cellIndex: number) => any[];
  clearNotebook: () => void;
}

export const useNotebookStore = create<NotebookState>((set, get) => ({
  cells: [],
  baseDataset: [],
  
  setBaseDataset: (data) => set({ baseDataset: data }),
  
  addCell: (type) => set((state) => ({
    cells: [...state.cells, {
      id: `cell-${Date.now()}`,
      type,
      config: {},
      result: null
    }]
  })),
  
  removeCell: (id) => set((state) => ({
    cells: state.cells.filter(c => c.id !== id)
  })),
  
  updateCellConfig: (id, config) => set((state) => ({
    cells: state.cells.map(c => c.id === id ? { ...c, config: { ...c.config, ...config } } : c)
  })),
  
  setCellResult: (id, result, datasetSnapshot) => set((state) => ({
    cells: state.cells.map(c => c.id === id ? { ...c, result, datasetSnapshot } : c)
  })),

  getDatasetForCell: (cellIndex) => {
    const state = get();
    // Find the nearest previous cell that produced a dataset snapshot (e.g. cleaning cell)
    for (let i = cellIndex - 1; i >= 0; i--) {
      if (state.cells[i].datasetSnapshot) {
        return state.cells[i].datasetSnapshot!;
      }
    }
    // If no previous cell modified the dataset, return the base dataset
    return cloneDeep(state.baseDataset);
  },

  clearNotebook: () => set({ cells: [] })
}));
