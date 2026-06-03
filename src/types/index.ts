export interface Requirement {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'draft' | 'reviewed' | 'in_dev' | 'in_test' | 'released' | 'closed';
  owner: string;
  sprint: string;
  devProgress: number;
  testProgress: number;
  createdAt: string;
  relatedTasks: DevTask[];
  relatedCases: TestCase[];
  relatedDefects: Defect[];
}

export interface DevTask {
  id: string;
  requirementId: string;
  title: string;
  description: string;
  assignee: string;
  status: 'todo' | 'in_progress' | 'done' | 'tested';
  type: 'frontend' | 'backend' | 'fullstack' | 'data' | 'ops' | 'other';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  estimatedHours: number;
  actualHours: number;
  branchName: string;
  createdAt: string;
}

export interface TestCase {
  id: string;
  requirementId: string;
  title: string;
  type: 'functional' | 'api' | 'performance' | 'security' | 'other';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  preconditions: string;
  steps: { step: number; action: string; expected: string }[];
  lastResult: 'pass' | 'fail' | 'blocked' | 'pending';
  automation: boolean;
  createdBy: string;
}

export interface Defect {
  id: string;
  requirementId: string;
  taskId: string;
  testCaseId: string;
  title: string;
  description: string;
  steps: string;
  expectedResult: string;
  actualResult: string;
  severity: 'fatal' | 'major' | 'normal' | 'minor';
  status: 'new' | 'confirmed' | 'fixing' | 'fixed' | 'verified' | 'closed';
  reporter: string;
  assignee: string;
  verifiedBy: string;
  createdAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed';
  requirementCount: number;
  completionRate: number;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  targetId: string;
  createdAt: string;
  type: 'create' | 'update' | 'status_change' | 'assign' | 'comment';
}

export interface Comment {
  id: string;
  targetType: string;
  targetId: string;
  user: string;
  content: string;
  createdAt: string;
}