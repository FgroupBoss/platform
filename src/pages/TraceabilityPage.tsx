import { useState } from 'react';
import { ChevronDown, ChevronRight, GitBranch, AlertTriangle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useStore } from '../store/useStore';

type ViewMode = 'requirement' | 'defect';

export default function TraceabilityPage() {
  const { requirements, defects } = useStore();
  const [viewMode, setViewMode] = useState<ViewMode>('requirement');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    if (viewMode === 'requirement') {
      requirements.forEach((r) => {
        allIds.add(r.id);
        r.relatedTasks.forEach((t) => allIds.add(t.id));
        r.relatedCases.forEach((tc) => allIds.add(tc.id));
      });
    } else {
      defects.forEach((d) => {
        allIds.add(d.id);
      });
    }
    setExpanded(allIds);
  };

  const collapseAll = () => setExpanded(new Set());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">追溯矩阵</h1>
          <p className="text-sm text-slate-500 mt-1">全链路双向追溯，快速定位问题来源</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-white/5 border border-white/10 p-0.5">
            <button
              onClick={() => setViewMode('requirement')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'requirement' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              需求视角
            </button>
            <button
              onClick={() => setViewMode('defect')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'defect' ? 'bg-red-500/20 text-red-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              缺陷视角
            </button>
          </div>
          <button onClick={expandAll} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">展开全部</button>
          <button onClick={collapseAll} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">折叠全部</button>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
        {viewMode === 'requirement' ? (
          <div className="space-y-1">
            {requirements.map((req) => {
              const isReqExpanded = expanded.has(req.id);
              return (
                <div key={req.id}>
                  <div
                    onClick={() => toggle(req.id)}
                    className="flex items-center gap-2 py-2.5 px-3 rounded-lg hover:bg-white/[0.03] cursor-pointer group transition-colors"
                  >
                    <button className="text-slate-600 group-hover:text-slate-400">
                      {isReqExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    <GitBranch size={14} className="text-cyan-400" />
                    <span className="text-sm font-mono text-cyan-400">{req.id}</span>
                    <span className="text-sm text-white font-medium">{req.title}</span>
                    <StatusBadge variant="status" value={req.status} />
                    <span className="text-xs text-slate-600 ml-auto">{req.devProgress}%</span>
                  </div>

                  {isReqExpanded && (
                    <div className="ml-8 pl-4 border-l border-white/5 space-y-0.5">
                      {req.relatedTasks.length === 0 && req.relatedCases.length === 0 && (
                        <div className="flex items-center gap-2 py-2 text-xs text-amber-500">
                          <AlertTriangle size={12} />
                          暂无关联项，请关联任务或用例
                        </div>
                      )}
                      {req.relatedTasks.length > 0 && (
                        <>
                          <div className="text-[10px] text-slate-600 uppercase tracking-wider py-1">研发任务</div>
                          {req.relatedTasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                              <span className="text-xs font-mono text-blue-400">{task.id}</span>
                              <span className="text-sm text-slate-300">{task.title}</span>
                              <StatusBadge variant="status" value={task.status} />
                              <span className="text-xs text-slate-500 ml-auto">{task.assignee}</span>
                            </div>
                          ))}
                        </>
                      )}
                      {req.relatedCases.length > 0 && (
                        <>
                          <div className="text-[10px] text-slate-600 uppercase tracking-wider py-1">测试用例</div>
                          {req.relatedCases.map((tc) => {
                            const relatedDefects = defects.filter((d) => d.testCaseId === tc.id);
                            const isTcExpanded = expanded.has(tc.id);
                            return (
                              <div key={tc.id}>
                                <div
                                  onClick={(e) => { e.stopPropagation(); toggle(tc.id); }}
                                  className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/[0.02] cursor-pointer transition-colors"
                                >
                                  <button className="text-slate-600 hover:text-slate-400">
                                    {isTcExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                  </button>
                                  <span className="text-xs font-mono text-purple-400">{tc.id}</span>
                                  <span className="text-sm text-slate-300">{tc.title}</span>
                                  <StatusBadge variant="result" value={tc.lastResult} />
                                  {relatedDefects.length > 0 && (
                                    <span className="text-xs text-red-400 ml-auto">{relatedDefects.length}个缺陷</span>
                                  )}
                                </div>
                                {isTcExpanded && relatedDefects.length > 0 && (
                                  <div className="ml-6 pl-4 border-l border-white/5">
                                    {relatedDefects.map((def) => (
                                      <div key={def.id} className="flex items-center gap-2 py-2 px-3">
                                        <span className="text-xs font-mono text-red-400">{def.id}</span>
                                        <span className="text-sm text-slate-300">{def.title}</span>
                                        <StatusBadge variant="severity" value={def.severity} />
                                        <StatusBadge variant="status" value={def.status} />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </>
                      )}
                      {req.relatedDefects.filter((d) => !d.testCaseId).length > 0 && (
                        <>
                          <div className="text-[10px] text-slate-600 uppercase tracking-wider py-1">直接关联缺陷</div>
                          {req.relatedDefects.filter((d) => !d.testCaseId).map((def) => (
                            <div key={def.id} className="flex items-center gap-2 py-2 px-3">
                              <span className="text-xs font-mono text-red-400">{def.id}</span>
                              <span className="text-sm text-slate-300">{def.title}</span>
                              <StatusBadge variant="severity" value={def.severity} />
                              <StatusBadge variant="status" value={def.status} />
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-1">
            {defects.map((def) => {
              const isDefExpanded = expanded.has(def.id);
              const relatedReq = requirements.find((r) => r.id === def.requirementId);
              const relatedTask = relatedReq?.relatedTasks.find((t) => t.id === def.taskId);
              const relatedCase = relatedReq?.relatedCases.find((tc) => tc.id === def.testCaseId);
              return (
                <div key={def.id}>
                  <div
                    onClick={() => toggle(def.id)}
                    className="flex items-center gap-2 py-2.5 px-3 rounded-lg hover:bg-white/[0.03] cursor-pointer group transition-colors"
                  >
                    <button className="text-slate-600 group-hover:text-slate-400">
                      {isDefExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    <span className="text-xs font-mono text-red-400">{def.id}</span>
                    <span className="text-sm text-white font-medium">{def.title}</span>
                    <StatusBadge variant="severity" value={def.severity} />
                    <StatusBadge variant="status" value={def.status} />
                  </div>
                  {isDefExpanded && (
                    <div className="ml-8 pl-4 border-l border-red-500/20 space-y-0.5">
                      {relatedCase && (
                        <div className="flex items-center gap-2 py-2 px-3">
                          <span className="text-[10px] text-slate-600 uppercase w-16">测试用例</span>
                          <span className="text-xs font-mono text-purple-400">{relatedCase.id}</span>
                          <span className="text-sm text-slate-300">{relatedCase.title}</span>
                        </div>
                      )}
                      {relatedTask && (
                        <div className="flex items-center gap-2 py-2 px-3">
                          <span className="text-[10px] text-slate-600 uppercase w-16">研发任务</span>
                          <span className="text-xs font-mono text-blue-400">{relatedTask.id}</span>
                          <span className="text-sm text-slate-300">{relatedTask.title}</span>
                          <span className="text-xs text-slate-500">{relatedTask.assignee}</span>
                        </div>
                      )}
                      {relatedReq && (
                        <div className="flex items-center gap-2 py-2 px-3">
                          <span className="text-[10px] text-slate-600 uppercase w-16">来源需求</span>
                          <span className="text-xs font-mono text-cyan-400">{relatedReq.id}</span>
                          <span className="text-sm text-slate-300">{relatedReq.title}</span>
                          <StatusBadge variant="status" value={relatedReq.status} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}