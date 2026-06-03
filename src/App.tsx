import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import RequirementListPage from './pages/RequirementListPage';
import RequirementDetailPage from './pages/RequirementDetailPage';
import TaskBoardPage from './pages/TaskBoardPage';
import DefectListPage from './pages/DefectListPage';
import TraceabilityPage from './pages/TraceabilityPage';
import SprintPage from './pages/SprintPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/requirements" element={<RequirementListPage />} />
          <Route path="/requirements/:id" element={<RequirementDetailPage />} />
          <Route path="/tasks" element={<TaskBoardPage />} />
          <Route path="/defects" element={<DefectListPage />} />
          <Route path="/traceability" element={<TraceabilityPage />} />
          <Route path="/sprints" element={<SprintPage />} />
        </Route>
      </Routes>
    </Router>
  );
}