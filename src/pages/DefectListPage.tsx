import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import { useStore } from '../store/useStore';
import { Defect } from '../types';

const severityOptions = ['致命', '严重', '一般', '轻微'];
const statusOptions = ['新建', '已确认', '修复中', '已修复', '已验证', '已关闭'];

const severityMap: Record<string, Defect['severity']> = { '致命': 'fatal', '严重': 'major', '一般': 'normal', '轻微': 'minor' };
const statusMap: Record<string, Defect['status']> = { '新建': 'new', '已确认': 'confirmed', '修复中': 'fixing', '已修复': 'fixed', '已验证': 'verified', '已关闭': 'closed' };
const statusLabel: Record<string, string> = { new: '新建', confirmed: '已确认', fixing: '修复中', fixed: '已修复', verified: '已验证', closed: '已关闭' };

export default function DefectListPage() {
  const { defects } = useStore();
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);

  const filtered = defects.filter((d) => {
    if (severityFilter && d.severity !== severityMap[severityFilter]) return false;
    if (statusFilter && statusLabel[d.status] !== statusFilter) return false;
    if (search && !d.title.includes(search) && !d.id.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">缺陷管理</h1>
          <p className="text-sm text-slate-500 mt-1">共 {defects.length} 个缺陷，{defects.filter((d) => d.status !== 'closed' && d.status !== 'verified').length} 个活跃</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
          <Plus size={16} />
          提交缺陷
        </button>
      </div>

      <FilterBar
        filters={[
          { label: '严重程度', options: severityOptions, value: severityFilter, onChange: setSeverityFilter },
          { label: '状态', options: statusOptions, value: statusFilter, onChange: setStatusFilter },
        ]}
        searchPlaceholder="搜索缺陷..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">标题</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">严重程度</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">创建人</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">修复人</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">关联需求</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((def) => (
              <tr
                key={def.id}
                onClick={() => setSelectedDefect(def)}
                className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 text-sm font-mono text-red-400">{def.id}</td>
                <td className="py-3 px-4 text-sm text-slate-200 font-medium max-w-xs truncate">{def.title}</td>
                <td className="py-3 px-4"><StatusBadge variant="severity" value={def.severity} /></td>
                <td className="py-3 px-4"><StatusBadge variant="status" value={def.status} /></td>
                <td className="py-3 px-4 text-sm text-slate-400">{def.reporter}</td>
                <td className="py-3 px-4 text-sm text-slate-400">{def.assignee || '-'}</td>
                <td className="py-3 px-4 text-sm text-cyan-400 font-mono">{def.requirementId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDefect && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedDefect(null)} />
          <div className="relative w-[480px] h-full bg-[#0f1123] border-l border-white/10 overflow-y-auto animate-slide-in">
            <div className="sticky top-0 bg-[#0f1123] border-b border-white/5 p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-red-400">{selectedDefect.id}</span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedDefect.title}</h2>
              </div>
              <button onClick={() => setSelectedDefect(null)} className="text-slate-500 hover:text-slate-300">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge variant="severity" value={selectedDefect.severity} />
                <StatusBadge variant="status" value={selectedDefect.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">关联需求</span>
                  <p className="text-cyan-400 font-mono">{selectedDefect.requirementId}</p>
                </div>
                <div>
                  <span className="text-slate-500">关联任务</span>
                  <p className="text-slate-300 font-mono">{selectedDefect.taskId || '-'}</p>
                </div>
                <div>
                  <span className="text-slate-500">关联用例</span>
                  <p className="text-slate-300 font-mono">{selectedDefect.testCaseId || '-'}</p>
                </div>
                <div>
                  <span className="text-slate-500">创建人</span>
                  <p className="text-slate-300">{selectedDefect.reporter}</p>
                </div>
                <div>
                  <span className="text-slate-500">修复人</span>
                  <p className="text-slate-300">{selectedDefect.assignee || '未分配'}</p>
                </div>
                <div>
                  <span className="text-slate-500">创建时间</span>
                  <p className="text-slate-300">{selectedDefect.createdAt}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">复现步骤</h3>
                <p className="text-sm text-slate-300 bg-white/[0.02] rounded-lg p-3 whitespace-pre-wrap">{selectedDefect.steps}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">预期结果</h3>
                  <p className="text-sm text-slate-300 bg-white/[0.02] rounded-lg p-3">{selectedDefect.expectedResult}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">实际结果</h3>
                  <p className="text-sm text-red-300/80 bg-red-500/5 rounded-lg p-3 border border-red-500/10">{selectedDefect.actualResult}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}