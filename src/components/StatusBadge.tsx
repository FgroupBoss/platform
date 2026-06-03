type BadgeVariant = 'priority' | 'status' | 'severity' | 'result';

const variants: Record<BadgeVariant, Record<string, string>> = {
  priority: {
    P0: 'bg-red-500/10 text-red-400 border-red-500/20',
    P1: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    P2: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    P3: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
  status: {
    draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    reviewed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    in_dev: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    in_test: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    released: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    closed: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    todo: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    in_progress: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    done: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    tested: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    new: 'bg-red-500/10 text-red-400 border-red-500/20',
    confirmed: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    fixing: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    fixed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    verified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    planning: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  severity: {
    fatal: 'bg-red-500/10 text-red-400 border-red-500/20',
    major: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    normal: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    minor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
  result: {
    pass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    fail: 'bg-red-500/10 text-red-400 border-red-500/20',
    blocked: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    pending: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
};

const labels: Record<string, string> = {
  draft: '待评审', reviewed: '已评审', in_dev: '开发中', in_test: '测试中', released: '已发布', closed: '已关闭',
  todo: '待开始', in_progress: '开发中', done: '已完成', tested: '已提测',
  new: '新建', confirmed: '已确认', fixing: '修复中', fixed: '已修复', verified: '已验证',
  active: '进行中', planning: '规划中', completed: '已完成',
  fatal: '致命', major: '严重', normal: '一般', minor: '轻微',
  pass: '通过', fail: '失败', blocked: '阻塞', pending: '未执行',
  P0: 'P0', P1: 'P1', P2: 'P2', P3: 'P3',
};

interface StatusBadgeProps {
  variant: BadgeVariant;
  value: string;
}

export default function StatusBadge({ variant, value }: StatusBadgeProps) {
  const color = variants[variant]?.[value] || variants[variant]?.P3 || '';
  const label = labels[value] || value;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${color}`}>
      {label}
    </span>
  );
}