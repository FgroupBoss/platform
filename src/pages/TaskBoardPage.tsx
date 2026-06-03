import { useState } from 'react';
import { Plus, GripVertical, Clock, User } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useStore } from '../store/useStore';
import { DevTask } from '../types';

const columns: { key: DevTask['status']; label: string; color: string }[] = [
  { key: 'todo', label: '待开始', color: 'border-slate-500/50' },
  { key: 'in_progress', label: '开发中', color: 'border-cyan-500/50' },
  { key: 'done', label: '已完成', color: 'border-blue-500/50' },
  { key: 'tested', label: '已提测', color: 'border-emerald-500/50' },
];

export default function TaskBoardPage() {
  const { tasks, updateTaskStatus } = useStore();
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, status: DevTask['status']) => {
    e.preventDefault();
    setDragOver(null);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) updateTaskStatus(taskId, status);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">任务看板</h1>
          <p className="text-sm text-slate-500 mt-1">Sprint 3 · 共 {tasks.length} 个任务</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
          <Plus size={16} />
          新建任务
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => { e.preventDefault(); setDragOver(col.key); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, col.key)}
              className={`bg-white/[0.03] border rounded-xl overflow-hidden transition-all ${
                dragOver === col.key ? 'border-cyan-500/30 bg-cyan-500/[0.03]' : 'border-white/5'
              }`}
            >
              <div className={`flex items-center justify-between px-4 py-3 border-b ${col.color}`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-300">{col.label}</span>
                  <span className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-xs text-slate-500">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              <div className="p-2 space-y-2 min-h-[200px]">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="bg-white/[0.05] border border-white/5 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-white/10 hover:bg-white/[0.07] transition-all group"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical size={14} className="text-slate-600 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-[10px] font-mono text-cyan-400">{task.id}</span>
                          <StatusBadge variant="priority" value={task.priority} />
                        </div>
                        <p className="text-sm text-slate-200 font-medium leading-snug mb-3">{task.title}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <User size={11} />
                            <span>{task.assignee}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-600">
                            <Clock size={11} />
                            <span>{task.estimatedHours}h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}