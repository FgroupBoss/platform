import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import AdminGuard from './components/admin/AdminGuard';
import HomePage from './pages/HomePage';
import PoemsPage from './pages/PoemsPage';
import PoemDetailPage from './pages/PoemDetailPage';
import StoriesPage from './pages/StoriesPage';
import StoryDetailPage from './pages/StoryDetailPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPoemsPage from './pages/admin/AdminPoemsPage';
import AdminPoemEditPage from './pages/admin/AdminPoemEditPage';
import AdminStoriesPage from './pages/admin/AdminStoriesPage';
import AdminStoryEditPage from './pages/admin/AdminStoryEditPage';
import AdminMediaPage from './pages/admin/AdminMediaPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 家庭端 */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/poems" element={<PoemsPage />} />
          <Route path="/poems/:id" element={<PoemDetailPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/:id" element={<StoryDetailPage />} />
        </Route>

        {/* 管理端 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/poems" element={<AdminPoemsPage />} />
            <Route path="/admin/poems/new" element={<AdminPoemEditPage />} />
            <Route path="/admin/poems/:id/edit" element={<AdminPoemEditPage />} />
            <Route path="/admin/stories" element={<AdminStoriesPage />} />
            <Route path="/admin/stories/new" element={<AdminStoryEditPage />} />
            <Route path="/admin/stories/:id/edit" element={<AdminStoryEditPage />} />
            <Route path="/admin/media" element={<AdminMediaPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
