import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { useStore } from '../store/useStore';

export default function RequirementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requirements } = useStore();
  const [activeTab, setActiveTab] = useState<'tasks' | 'cases' | 'defects'>('tasks');
  const [comment, setComment] = useState('');

  const req = requirements.find((r) => r.id === id);

  if (!req) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">需求不存在</p>
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    draft: '待评审', reviewed: '已评审', in_dev: '开发中', in_test: '测试中', released: '已发布', closed: '已关闭',
  };

  const tabs = [
    { key: 'tasks' as const, label: '关联任务', count: req.relatedTasks.length },
    { key: 'cases' as const, label: '关联用例', count: req.relatedCases.length },
    { key: 'defects' as const, label: '关联缺陷', count: req.relatedDefects.length },
  ];

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/requirements')} className="text-slate-500 hover:text-slate-300 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-cyan-400">{req.id}</span>
            <h1 className="text-xl font-bold text-white">{req.title}</h1>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-400 hover:text-slate-200 hover:border-white/20 transition-all">
          <Edit size={14} /> 编辑
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-red-400 hover:text-red-300 hover:border-red-500/20 transition-all">
          <Trash2 size={14} /> 删除
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <StatusBadge variant="status" value={req.status} />
            <StatusBadge variant="priority" value={req.priority} />
            <span className="text-sm text-slate-500">负责人: {req.owner}</span>
            <span className="text-sm text-slate-500">迭代: {req.sprint}</span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">需求描述</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{req.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">验收标准</h3>
            <ul className="space-y-1.5">
              {req.acceptanceCriteria.map((ac, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="w-5 h-5 rounded border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-xs">✓</span>
                  </span>
                  {ac}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-medium text-slate-400 mb-4">进度概览</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500">研发进度</span>
                <span className="text-cyan-400 font-medium">{req.devProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all" style={{ width: `${req.devProgress}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500">测试进度</span>
                <span className="text-purple-400 font-medium">{req.testProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{ width: `${req.testProgress}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">关联任务</span>
              <span className="text-slate-300 font-medium">{req.relatedTasks.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">关联用例</span>
              <span className="text-slate-300 font-medium">{req.relatedCases.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">关联缺陷</span>
              <span className="text-slate-300 font-medium">{req.relatedDefects.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">创建时间</span>
              <span className="text-slate-300 font-medium">{req.createdAt}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
        <div className="flex border-b border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="p-4">
          {activeTab === 'tasks' && (
            <div className="space-y-2">
              {req.relatedTasks.length === 0 ? (
                <p className="text-sm text-slate-600 py-4 text-center">暂无关联任务</p>
              ) : (
                req.relatedTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                    <span className="text-xs font-mono text-cyan-400">{task.id}</span>
                    <span className="text-sm text-slate-200 flex-1">{task.title}</span>
                    <StatusBadge variant="status" value={task.status} />
                    <span className="text-xs text-slate-500">{task.assignee}</span>
                    <span className="text-xs text-slate-600">{task.estimatedHours}h</span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="space-y-2">
              {req.relatedCases.length === 0 ? (
                <p className="text-sm text-slate-600 py-4 text-center">暂无关联用例</p>
              ) : (
                req.relatedCases.map((tc) => (
                  <div key={tc.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                    <span className="text-xs font-mono text-purple-400">{tc.id}</span>
                    <span className="text-sm text-slate-200 flex-1">{tc.title}</span>
                    <StatusBadge variant="result" value={tc.lastResult} />
                    <span className="text-xs text-slate-500">{tc.createdBy}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'defects' && (
            <div className="space-y-2">
              {req.relatedDefects.length === 0 ? (
                <p className="text-sm text-slate-600 py-4 text-center">暂无关联缺陷</p>
              ) : (
                req.relatedDefects.map((def) => (
                  <div key={def.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                    <span className="text-xs font-mono text-red-400">{def.id}</span>
                    <span className="text-sm text-slate-200 flex-1">{def.title}</span>
                    <StatusBadge variant="severity" value={def.severity} />
                    <StatusBadge variant="status" value={def.status} />
                    <span className="text-xs text-slate-500">{def.assignee}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
          <MessageSquare size={14} /> 评论
        </h3>
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">张</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white">张三</span>
                <span className="text-xs text-slate-600">2小时前</span>
              </div>
              <p className="text-sm text-slate-300">登录接口已完成，前端页面预计明天提测。验证码服务需要等第三方审核通过。</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">李</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white">李四</span>
                <span className="text-xs text-slate-600">1小时前</span>
              </div>
              <p className="text-sm text-slate-300">收到，我先根据需求写测试用例。</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="输入评论..."
            className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
          />
          <button className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
            <Send size={14} /> 发送
          </button>
        </div>
      </div>
    </div>
  );
}