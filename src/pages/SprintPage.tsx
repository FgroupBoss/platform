import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useStore } from '../store/useStore';

const burndownData = [
  { day: '06/01', ideal: 60, actual: 60 },
  { day: '06/02', ideal: 55, actual: 56 },
  { day: '06/03', ideal: 50, actual: 48 },
  { day: '06/04', ideal: 45, actual: 47 },
  { day: '06/05', ideal: 40, actual: 42 },
  { day: '06/06', ideal: 35, actual: 38 },
  { day: '06/07', ideal: 30, actual: 35 },
  { day: '06/08', ideal: 25, actual: 0 },
  { day: '06/09', ideal: 20, actual: 0 },
  { day: '06/10', ideal: 15, actual: 0 },
  { day: '06/11', ideal: 10, actual: 0 },
  { day: '06/12', ideal: 5, actual: 0 },
  { day: '06/13', ideal: 0, actual: 0 },
];

export default function SprintPage() {
  const { sprints, requirements } = useStore();
  const [selectedSprint, setSelectedSprint] = useState(sprints[0]);

  const sprintReqs = requirements.filter((r) => r.sprint === selectedSprint.name);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">迭代管理</h1>
          <p className="text-sm text-slate-500 mt-1">共 {sprints.length} 个迭代</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
          <Plus size={16} />
          新建迭代
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {sprints.map((sprint) => (
          <div
            key={sprint.id}
            onClick={() => setSelectedSprint(sprint)}
            className={`bg-white/[0.03] border rounded-xl p-4 cursor-pointer transition-all hover:bg-white/[0.05] ${
              selectedSprint.id === sprint.id ? 'border-cyan-500/50 bg-cyan-500/[0.03]' : 'border-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">{sprint.name}</span>
              <StatusBadge variant="status" value={sprint.status} />
            </div>
            <p className="text-xs text-slate-500 mb-3">{sprint.startDate} - {sprint.endDate}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{sprint.requirementCount} 个需求</span>
              <span className="text-cyan-400 font-medium">{sprint.completionRate}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5 mt-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{ width: `${sprint.completionRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {selectedSprint.status === 'active' && (
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">{selectedSprint.name} · 燃尽图</h3>
            <span className="text-xs text-slate-600">剩余 11 天</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={burndownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e1e3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0' }} />
              <Line type="monotone" dataKey="ideal" stroke="#64748b" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="理想进度" />
              <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3, fill: '#06b6d4' }} name="实际进度" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500 rounded" style={{ borderTop: '1.5px dashed #64748b' }} />
              <span className="text-slate-400">理想进度</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400 rounded" />
              <span className="text-slate-400">实际进度</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5">
          <h3 className="text-sm font-medium text-slate-400">{selectedSprint.name} · 需求列表</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">ID</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">标题</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">优先级</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">状态</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">进度</th>
            </tr>
          </thead>
          <tbody>
            {sprintReqs.map((req) => (
              <tr key={req.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-3 px-4 text-sm font-mono text-cyan-400">{req.id}</td>
                <td className="py-3 px-4 text-sm text-slate-200">{req.title}</td>
                <td className="py-3 px-4"><StatusBadge variant="priority" value={req.priority} /></td>
                <td className="py-3 px-4"><StatusBadge variant="status" value={req.status} /></td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-cyan-500" style={{ width: `${req.devProgress}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{req.devProgress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}