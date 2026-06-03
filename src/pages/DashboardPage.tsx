import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart } from 'recharts';
import { ClipboardCheck, CheckCircle2, Bug, Target, Clock, MessageSquare, GitCommit, UserPlus, FileText } from 'lucide-react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { useStore } from '../store/useStore';

const reqStatusData = [
  { name: '开发中', value: 3, color: '#06b6d4' },
  { name: '已评审', value: 2, color: '#3b82f6' },
  { name: '测试中', value: 1, color: '#a855f7' },
  { name: '待评审', value: 2, color: '#64748b' },
];

const defectTrendData = [
  { day: '06/01', new: 1, closed: 0 },
  { day: '06/02', new: 3, closed: 1 },
  { day: '06/03', new: 4, closed: 2 },
  { day: '06/04', new: 2, closed: 3 },
  { day: '06/05', new: 1, closed: 4 },
  { day: '06/06', new: 2, closed: 2 },
  { day: '06/07', new: 0, closed: 3 },
];

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

const activityIcons: Record<string, React.ReactNode> = {
  create: <FileText size={14} />,
  update: <GitCommit size={14} />,
  status_change: <Clock size={14} />,
  assign: <UserPlus size={14} />,
  comment: <MessageSquare size={14} />,
};

const activityColors: Record<string, string> = {
  create: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  update: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  status_change: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  assign: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  comment: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

export default function DashboardPage() {
  const { requirements, defects, tasks, testCases, activities } = useStore();

  const doneTasks = tasks.filter((t) => t.status === 'done' || t.status === 'tested').length;
  const passedCases = testCases.filter((t) => t.lastResult === 'pass').length;
  const openDefects = defects.filter((d) => d.status !== 'closed' && d.status !== 'verified').length;
  const totalRequirements = requirements.length;
  const completedRequirements = requirements.filter((r) => r.status === 'released' || r.status === 'closed').length;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diffMin < 60) return `${diffMin}分钟前`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}小时前`;
    return `${Math.floor(diffH / 24)}天前`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">项目仪表盘</h1>
          <p className="text-sm text-slate-500 mt-1">Sprint 3 · 06/01 - 06/14 · 剩余 11 天</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-400 font-medium">进行中</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={<ClipboardCheck size={18} className="text-cyan-400" />}
          label="需求完成率"
          value={`${completedRequirements}/${totalRequirements}`}
          sub={`${totalRequirements > 0 ? Math.round((completedRequirements / totalRequirements) * 100) : 0}%`}
          trend="up"
          color="bg-cyan-500/10"
        />
        <StatCard
          icon={<CheckCircle2 size={18} className="text-emerald-400" />}
          label="测试通过率"
          value={`${passedCases}/${testCases.length}`}
          sub={`${testCases.length > 0 ? Math.round((passedCases / testCases.length) * 100) : 0}%`}
          trend="up"
          color="bg-emerald-500/10"
        />
        <StatCard
          icon={<Bug size={18} className="text-red-400" />}
          label="活跃缺陷"
          value={openDefects}
          sub="本周新增 3"
          trend="down"
          color="bg-red-500/10"
        />
        <StatCard
          icon={<Target size={18} className="text-amber-400" />}
          label="迭代进度"
          value={`${doneTasks}/${tasks.length}`}
          sub={`${tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0}%`}
          trend="neutral"
          color="bg-amber-500/10"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-medium text-slate-400 mb-4">需求状态分布</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={reqStatusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {reqStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1e1e3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {reqStatusData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                <span className="text-slate-400">{d.name}</span>
                <span className="text-slate-500">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-medium text-slate-400 mb-4">缺陷趋势 (近7天)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={defectTrendData}>
              <defs>
                <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="closedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1e1e3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0' }} />
              <Area type="monotone" dataKey="new" stroke="#ef4444" fill="url(#newGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="closed" stroke="#10b981" fill="url(#closedGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-red-400 rounded" />
              <span className="text-slate-400">新增</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 rounded" />
              <span className="text-slate-400">关闭</span>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-medium text-slate-400 mb-4">迭代燃尽图</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={burndownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e1e3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0' }} />
              <Line type="monotone" dataKey="ideal" stroke="#64748b" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2} dot={{ r: 2, fill: '#06b6d4' }} />
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
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-medium text-slate-400 mb-4">最近活动</h3>
        <div className="space-y-0">
          {activities.slice(0, 8).map((act, i) => (
            <div key={act.id} className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${activityColors[act.type] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                {activityIcons[act.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300">
                  <span className="font-medium text-white">{act.user}</span>
                  <span className="text-slate-500"> {act.action} </span>
                  <span className="text-cyan-400 font-medium">{act.target}</span>
                </p>
              </div>
              <span className="text-xs text-slate-600 flex-shrink-0">{formatTime(act.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}