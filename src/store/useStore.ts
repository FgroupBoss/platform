import { create } from 'zustand';
import { Requirement, DevTask, Defect, TestCase, Sprint, ActivityLog } from '../types';
import { mockRequirements, mockTasks, mockDefects, mockTestCases, mockSprints, mockActivities } from '../data/mockData';

interface AppState {
  requirements: Requirement[];
  tasks: DevTask[];
  defects: Defect[];
  testCases: TestCase[];
  sprints: Sprint[];
  activities: ActivityLog[];
  selectedRequirement: Requirement | null;

  setSelectedRequirement: (req: Requirement | null) => void;
  updateTaskStatus: (taskId: string, status: DevTask['status']) => void;
  updateDefectStatus: (defectId: string, status: Defect['status']) => void;
  updateRequirementStatus: (reqId: string, status: Requirement['status']) => void;
  getTasksByStatus: (status: DevTask['status']) => DevTask[];
  getDefectsByStatus: (status: Defect['status']) => Defect[];
}

export const useStore = create<AppState>((set, get) => ({
  requirements: mockRequirements,
  tasks: mockTasks,
  defects: mockDefects,
  testCases: mockTestCases,
  sprints: mockSprints,
  activities: mockActivities,
  selectedRequirement: null,

  setSelectedRequirement: (req) => set({ selectedRequirement: req }),

  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    })),

  updateDefectStatus: (defectId, status) =>
    set((state) => ({
      defects: state.defects.map((d) => (d.id === defectId ? { ...d, status } : d)),
    })),

  updateRequirementStatus: (reqId, status) =>
    set((state) => ({
      requirements: state.requirements.map((r) => (r.id === reqId ? { ...r, status } : r)),
    })),

  getTasksByStatus: (status) => get().tasks.filter((t) => t.status === status),

  getDefectsByStatus: (status) => get().defects.filter((d) => d.status === status),
}));