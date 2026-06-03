import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import { useStore } from '../store/useStore';
import { Requirement } from '../types';

const statusOptions = ['待评审', '已评审', '开发中', '测试中', '已发布', '已关闭'];
const priorityOptions = ['P0', 'P1', 'P2', 'P3'];

const statusMap: Record<string, Requirement['status']> = {
  '待评审': 'draft', '已评审': 'reviewed', '开发中': 'in_dev', '测试中': 'in_test', '已发布': 'released', '已关闭': 'closed',
};

const statusLabel: Record<string, string> = {
  draft: '待评审', reviewed: '已评审', in_dev: '开发中', in_test: '测试中', released: '已发布', closed: '已关闭',
};

export default function RequirementListPage() {
  const navigate = useNavigate();
  const { requirements } = useStore();
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = requirements.filter((r) => {
    if (statusFilter && statusLabel[r.status] !== statusFilter) return false;
    if (priorityFilter && r.priority !== priorityFilter) return false;
    if (search && !r.title.includes(search) && !r.id.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">需求管理</h1>
          <p className="text-sm text-slate-500 mt-1">共 {requirements.length} 个需求</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
          <Plus size={16} />
          新建需求
        </button>
      </div>

      <FilterBar
        filters={[
          { label: '状态', options: statusOptions, value: statusFilter, onChange: setStatusFilter },
          { label: '优先级', options: priorityOptions, value: priorityFilter, onChange: setPriorityFilter },
        ]}
        searchPlaceholder="搜索需求..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">标题</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">优先级</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">负责人</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">迭代</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">进度</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((req) => (
              <tr
                key={req.id}
                onClick={() => navigate(`/requirements/${req.id}`)}
                className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors group"
              >
                <td className="py-3 px-4 text-sm font-mono text-cyan-400">{req.id}</td>
                <td className="py-3 px-4 text-sm text-slate-200 font-medium max-w-xs truncate">{req.title}</td>
                <td className="py-3 px-4"><StatusBadge variant="priority" value={req.priority} /></td>
                <td className="py-3 px-4"><StatusBadge variant="status" value={req.status} /></td>
                <td className="py-3 px-4 text-sm text-slate-400">{req.owner}</td>
                <td className="py-3 px-4 text-sm text-slate-400">{req.sprint}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                        style={{ width: `${req.devProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{req.devProgress}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}