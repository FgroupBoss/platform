import { Requirement, DevTask, TestCase, Defect, Sprint, ActivityLog } from '../types';

export const mockTasks: DevTask[] = [
  { id: 'T-001', requirementId: 'REQ-001', title: '登录接口开发', description: '实现邮箱密码登录和手机验证码登录接口', assignee: '张三', status: 'in_progress', type: 'backend', priority: 'P0', estimatedHours: 8, actualHours: 5, branchName: 'feature/login-api', createdAt: '2026-06-01' },
  { id: 'T-002', requirementId: 'REQ-001', title: '登录页面开发', description: '登录表单UI、表单校验、记住我功能', assignee: '李四', status: 'done', type: 'frontend', priority: 'P0', estimatedHours: 6, actualHours: 7, branchName: 'feature/login-page', createdAt: '2026-06-01' },
  { id: 'T-003', requirementId: 'REQ-001', title: '验证码服务对接', description: '对接短信验证码发送服务', assignee: '张三', status: 'todo', type: 'backend', priority: 'P0', estimatedHours: 4, actualHours: 0, branchName: '', createdAt: '2026-06-02' },
  { id: 'T-004', requirementId: 'REQ-002', title: '看板数据接口', description: '实现仪表盘数据聚合接口', assignee: '王五', status: 'in_progress', type: 'backend', priority: 'P1', estimatedHours: 6, actualHours: 3, branchName: 'feature/dashboard-api', createdAt: '2026-06-02' },
  { id: 'T-005', requirementId: 'REQ-002', title: '统计图表组件', description: '需求分布饼图、缺陷趋势折线图', assignee: '赵六', status: 'todo', type: 'frontend', priority: 'P1', estimatedHours: 8, actualHours: 0, branchName: '', createdAt: '2026-06-03' },
  { id: 'T-006', requirementId: 'REQ-003', title: '通知服务开发', description: '站内通知、企微/飞书推送', assignee: '张三', status: 'done', type: 'backend', priority: 'P1', estimatedHours: 6, actualHours: 5, branchName: 'feature/notification', createdAt: '2026-06-01' },
  { id: 'T-007', requirementId: 'REQ-003', title: '通知中心前端', description: '通知列表、已读未读标记', assignee: '李四', status: 'tested', type: 'frontend', priority: 'P1', estimatedHours: 4, actualHours: 3, branchName: 'feature/notify-ui', createdAt: '2026-06-02' },
  { id: 'T-008', requirementId: 'REQ-004', title: '数据库表设计', description: '用户表、权限表、角色表设计', assignee: '王五', status: 'done', type: 'backend', priority: 'P0', estimatedHours: 4, actualHours: 3, branchName: '', createdAt: '2026-06-01' },
  { id: 'T-009', requirementId: 'REQ-004', title: '权限管理接口', description: 'RBAC 权限 CRUD 接口', assignee: '王五', status: 'in_progress', type: 'backend', priority: 'P0', estimatedHours: 8, actualHours: 2, branchName: 'feature/rbac', createdAt: '2026-06-02' },
  { id: 'T-010', requirementId: 'REQ-005', title: '消息推送服务', description: 'WebSocket 实时消息推送', assignee: '赵六', status: 'todo', type: 'backend', priority: 'P2', estimatedHours: 10, actualHours: 0, branchName: '', createdAt: '2026-06-03' },
  { id: 'T-011', requirementId: 'REQ-005', title: '消息列表页面', description: '消息列表、搜索、筛选', assignee: '赵六', status: 'todo', type: 'frontend', priority: 'P2', estimatedHours: 6, actualHours: 0, branchName: '', createdAt: '2026-06-03' },
];

export const mockTestCases: TestCase[] = [
  { id: 'TC-001', requirementId: 'REQ-001', title: '邮箱密码登录-正常流程', type: 'functional', priority: 'P0', preconditions: '已注册账号', steps: [{ step: 1, action: '输入正确邮箱和密码', expected: '登录成功跳转首页' }], lastResult: 'pass', automation: true, createdBy: '李四' },
  { id: 'TC-002', requirementId: 'REQ-001', title: '邮箱密码登录-错误密码', type: 'functional', priority: 'P0', preconditions: '已注册账号', steps: [{ step: 1, action: '输入正确邮箱和错误密码', expected: '提示用户名或密码错误' }], lastResult: 'pass', automation: true, createdBy: '李四' },
  { id: 'TC-003', requirementId: 'REQ-001', title: '密码错误3次锁定', type: 'functional', priority: 'P0', preconditions: '账号未锁定', steps: [{ step: 1, action: '连续3次输入错误密码', expected: '第4次提示账户已锁定' }], lastResult: 'fail', automation: false, createdBy: '李四' },
  { id: 'TC-004', requirementId: 'REQ-001', title: '手机验证码登录', type: 'functional', priority: 'P1', preconditions: '手机号已注册', steps: [{ step: 1, action: '输入手机号获取验证码', expected: '收到验证码，登录成功' }], lastResult: 'pending', automation: false, createdBy: '李四' },
  { id: 'TC-005', requirementId: 'REQ-002', title: '仪表盘数据加载', type: 'api', priority: 'P1', preconditions: '已有项目数据', steps: [{ step: 1, action: '访问仪表盘页面', expected: '统计数据正确加载' }], lastResult: 'pending', automation: false, createdBy: '王五' },
  { id: 'TC-006', requirementId: 'REQ-003', title: '通知推送验证', type: 'functional', priority: 'P1', preconditions: '已登录', steps: [{ step: 1, action: '创建缺陷', expected: '研发负责人收到通知' }], lastResult: 'pass', automation: true, createdBy: '王五' },
  { id: 'TC-007', requirementId: 'REQ-004', title: '角色权限校验', type: 'api', priority: 'P0', preconditions: '已配置角色', steps: [{ step: 1, action: '越权访问', expected: '返回403' }], lastResult: 'pending', automation: false, createdBy: '王五' },
  { id: 'TC-008', requirementId: 'REQ-005', title: '消息推送延迟', type: 'performance', priority: 'P2', preconditions: 'WebSocket已连接', steps: [{ step: 1, action: '发送消息', expected: '延迟<500ms' }], lastResult: 'pending', automation: false, createdBy: '赵六' },
];

export const mockDefects: Defect[] = [
  { id: 'BUG-001', requirementId: 'REQ-001', taskId: 'T-001', testCaseId: 'TC-003', title: '密码错误锁定计数未重置', description: '锁定30分钟后计数未清零', steps: '1.连续输错3次 2.等待30分钟 3.再次输入错误密码', expectedResult: '重新计数3次锁定', actualResult: '首次错误即锁定', severity: 'major', status: 'fixing', reporter: '李四', assignee: '张三', verifiedBy: '', createdAt: '2026-06-02' },
  { id: 'BUG-002', requirementId: 'REQ-001', taskId: 'T-002', testCaseId: 'TC-001', title: '登录页面移动端布局错乱', description: 'iPhone SE 上登录按钮超出屏幕', steps: '1.使用iPhone SE打开登录页', expectedResult: '按钮在屏幕内', actualResult: '按钮超出屏幕右侧', severity: 'normal', status: 'new', reporter: '李四', assignee: '李四', verifiedBy: '', createdAt: '2026-06-03' },
  { id: 'BUG-003', requirementId: 'REQ-001', taskId: 'T-001', testCaseId: '', title: '登录接口偶发500错误', description: '并发登录时偶发500', steps: '1.并发10个登录请求', expectedResult: '全部成功', actualResult: '偶尔出现500', severity: 'fatal', status: 'confirmed', reporter: '李四', assignee: '张三', verifiedBy: '', createdAt: '2026-06-03' },
  { id: 'BUG-004', requirementId: 'REQ-002', taskId: 'T-004', testCaseId: '', title: '仪表盘数据缓存未刷新', description: '新增需求后仪表盘未更新', steps: '1.新增需求 2.返回仪表盘', expectedResult: '数据实时更新', actualResult: '显示旧数据', severity: 'normal', status: 'fixed', reporter: '赵六', assignee: '王五', verifiedBy: '赵六', createdAt: '2026-06-02' },
  { id: 'BUG-005', requirementId: 'REQ-003', taskId: 'T-006', testCaseId: '', title: '通知延迟超过30秒', description: '企微通知延迟严重', steps: '1.创建缺陷分配给张三', expectedResult: '5秒内收到通知', actualResult: '30秒后才收到', severity: 'minor', status: 'verified', reporter: '王五', assignee: '张三', verifiedBy: '王五', createdAt: '2026-06-01' },
  { id: 'BUG-006', requirementId: 'REQ-004', taskId: 'T-009', testCaseId: '', title: '权限缓存未及时失效', description: '修改角色后权限未立即生效', steps: '1.修改用户角色 2.用户刷新页面', expectedResult: '新权限生效', actualResult: '需要重新登录', severity: 'major', status: 'new', reporter: '王五', assignee: '王五', verifiedBy: '', createdAt: '2026-06-03' },
  { id: 'BUG-007', requirementId: 'REQ-004', taskId: 'T-008', testCaseId: '', title: '用户表缺少索引', description: '用户查询慢', steps: '1.查询用户列表', expectedResult: '响应<100ms', actualResult: '响应>500ms', severity: 'normal', status: 'closed', reporter: '王五', assignee: '王五', verifiedBy: '赵六', createdAt: '2026-06-01' },
  { id: 'BUG-008', requirementId: 'REQ-005', taskId: 'T-010', testCaseId: '', title: 'WebSocket连接频繁断开', description: '在线用户多时断连', steps: '1.保持页面打开30分钟', expectedResult: '连接保持', actualResult: '15分钟后断开', severity: 'major', status: 'new', reporter: '赵六', assignee: '赵六', verifiedBy: '', createdAt: '2026-06-03' },
];

export const mockRequirements: Requirement[] = [
  {
    id: 'REQ-001', title: '用户登录功能', description: '实现用户通过邮箱+密码或手机号+验证码方式登录系统，支持记住密码和自动登录。', acceptanceCriteria: ['正确邮箱+密码可成功登录', '错误密码提示不泄露具体原因', '连续3次错误锁定30分钟', '手机验证码60秒有效', '记住我7天免登录'],
    priority: 'P0', status: 'in_dev', owner: '产品经理A', sprint: 'Sprint 3', devProgress: 60, testProgress: 40, createdAt: '2026-06-01',
    relatedTasks: mockTasks.filter(t => t.requirementId === 'REQ-001'),
    relatedCases: mockTestCases.filter(t => t.requirementId === 'REQ-001'),
    relatedDefects: mockDefects.filter(d => d.requirementId === 'REQ-001'),
  },
  {
    id: 'REQ-002', title: '首页数据看板', description: '实现项目总览仪表盘，展示需求完成率、测试通过率、缺陷趋势、迭代进度等核心指标。', acceptanceCriteria: ['4个统计卡片正确展示', '需求状态饼图可交互', '缺陷趋势折线图可筛选时间范围', '最近活动实时更新'],
    priority: 'P1', status: 'in_dev', owner: '产品经理B', sprint: 'Sprint 3', devProgress: 30, testProgress: 0, createdAt: '2026-06-02',
    relatedTasks: mockTasks.filter(t => t.requirementId === 'REQ-002'),
    relatedCases: mockTestCases.filter(t => t.requirementId === 'REQ-002'),
    relatedDefects: mockDefects.filter(d => d.requirementId === 'REQ-002'),
  },
  {
    id: 'REQ-003', title: '消息通知模块', description: '实现站内通知、企微/飞书/钉钉多渠道通知，支持通知模板配置和已读未读管理。', acceptanceCriteria: ['需求状态变更时通知相关人', '支持站内信和企微通知', '通知列表支持已读/未读筛选', '支持@提及通知'],
    priority: 'P1', status: 'in_test', owner: '产品经理A', sprint: 'Sprint 3', devProgress: 100, testProgress: 70, createdAt: '2026-06-01',
    relatedTasks: mockTasks.filter(t => t.requirementId === 'REQ-003'),
    relatedCases: mockTestCases.filter(t => t.requirementId === 'REQ-003'),
    relatedDefects: mockDefects.filter(d => d.requirementId === 'REQ-003'),
  },
  {
    id: 'REQ-004', title: '用户权限管理', description: '实现 RBAC 权限模型，支持角色定义、权限分配、菜单权限控制。', acceptanceCriteria: ['支持8种角色定义', '权限粒度到按钮级别', '角色变更实时生效', '越权访问返回403'],
    priority: 'P0', status: 'in_dev', owner: '产品经理B', sprint: 'Sprint 3', devProgress: 50, testProgress: 0, createdAt: '2026-06-01',
    relatedTasks: mockTasks.filter(t => t.requirementId === 'REQ-004'),
    relatedCases: mockTestCases.filter(t => t.requirementId === 'REQ-004'),
    relatedDefects: mockDefects.filter(d => d.requirementId === 'REQ-004'),
  },
  {
    id: 'REQ-005', title: '实时消息推送', description: '基于 WebSocket 实现实时消息推送，支持群组消息、私聊消息、消息历史记录。', acceptanceCriteria: ['消息延迟<500ms', '支持群组和私聊', '消息历史可查询', '离线消息缓存'],
    priority: 'P2', status: 'reviewed', owner: '产品经理A', sprint: 'Sprint 4', devProgress: 0, testProgress: 0, createdAt: '2026-06-03',
    relatedTasks: mockTasks.filter(t => t.requirementId === 'REQ-005'),
    relatedCases: mockTestCases.filter(t => t.requirementId === 'REQ-005'),
    relatedDefects: mockDefects.filter(d => d.requirementId === 'REQ-005'),
  },
  {
    id: 'REQ-006', title: '需求追溯矩阵', description: '实现需求与任务、用例、缺陷的双向追溯，支持树形展开和可视化图谱。', acceptanceCriteria: ['需求视角可追溯所有关联', '缺陷视角可反向追溯', '支持展开/折叠', '未关联项高亮警告'],
    priority: 'P1', status: 'reviewed', owner: '产品经理B', sprint: 'Sprint 4', devProgress: 0, testProgress: 0, createdAt: '2026-06-03',
    relatedTasks: [], relatedCases: [], relatedDefects: [],
  },
  {
    id: 'REQ-007', title: '迭代燃尽图', description: '实现迭代燃尽图，展示理想进度与实际进度对比，支持每日自动更新。', acceptanceCriteria: ['理想线虚线，实际线实线', '支持hover查看每日数据', '数据每天自动更新', '延期预警标记'],
    priority: 'P2', status: 'draft', owner: '产品经理A', sprint: 'Sprint 4', devProgress: 0, testProgress: 0, createdAt: '2026-06-03',
    relatedTasks: [], relatedCases: [], relatedDefects: [],
  },
  {
    id: 'REQ-008', title: '自动化测试集成', description: '集成 CI/CD 流水线，自动触发测试用例执行，自动生成测试报告。', acceptanceCriteria: ['代码提交自动触发测试', '测试报告自动生成', '失败用例自动创建缺陷', '支持定时执行'],
    priority: 'P2', status: 'draft', owner: '产品经理B', sprint: 'Sprint 5', devProgress: 0, testProgress: 0, createdAt: '2026-06-03',
    relatedTasks: [], relatedCases: [], relatedDefects: [],
  },
];

export const mockSprints: Sprint[] = [
  { id: 'SP-001', name: 'Sprint 3', goal: '完成核心功能 MVP 上线', startDate: '2026-06-01', endDate: '2026-06-14', status: 'active', requirementCount: 5, completionRate: 60 },
  { id: 'SP-002', name: 'Sprint 2', goal: '基础架构搭建', startDate: '2026-05-15', endDate: '2026-05-31', status: 'completed', requirementCount: 6, completionRate: 100 },
  { id: 'SP-003', name: 'Sprint 4', goal: '追溯矩阵与效能度量', startDate: '2026-06-15', endDate: '2026-06-28', status: 'planning', requirementCount: 3, completionRate: 0 },
  { id: 'SP-004', name: 'Sprint 5', goal: '自动化与集成', startDate: '2026-06-29', endDate: '2026-07-12', status: 'planning', requirementCount: 1, completionRate: 0 },
];

export const mockActivities: ActivityLog[] = [
  { id: 'ACT-001', user: '张三', action: '将需求状态改为"开发中"', target: 'REQ-001', targetId: 'REQ-001', createdAt: '2026-06-03T10:30:00', type: 'status_change' },
  { id: 'ACT-002', user: '李四', action: '创建了缺陷', target: 'BUG-002', targetId: 'BUG-002', createdAt: '2026-06-03T09:15:00', type: 'create' },
  { id: 'ACT-003', user: '王五', action: '完成了任务"看板数据接口"', target: 'T-004', targetId: 'T-004', createdAt: '2026-06-03T08:00:00', type: 'update' },
  { id: 'ACT-004', user: '赵六', action: '将缺陷 BUG-008 指派给', target: 'BUG-008', targetId: 'BUG-008', createdAt: '2026-06-03T07:45:00', type: 'assign' },
  { id: 'ACT-005', user: '产品经理A', action: '评审通过了需求', target: 'REQ-005', targetId: 'REQ-005', createdAt: '2026-06-03T07:00:00', type: 'status_change' },
  { id: 'ACT-006', user: '张三', action: '将缺陷状态改为"修复中"', target: 'BUG-001', targetId: 'BUG-001', createdAt: '2026-06-02T16:30:00', type: 'status_change' },
  { id: 'ACT-007', user: '李四', action: '完成了任务"登录页面开发"', target: 'T-002', targetId: 'T-002', createdAt: '2026-06-02T15:00:00', type: 'update' },
  { id: 'ACT-008', user: '王五', action: '创建了缺陷', target: 'BUG-006', targetId: 'BUG-006', createdAt: '2026-06-02T14:20:00', type: 'create' },
  { id: 'ACT-009', user: '产品经理B', action: '创建了需求', target: 'REQ-006', targetId: 'REQ-006', createdAt: '2026-06-02T11:00:00', type: 'create' },
  { id: 'ACT-010', user: '张三', action: '将任务"登录接口开发"状态改为"开发中"', target: 'T-001', targetId: 'T-001', createdAt: '2026-06-02T09:00:00', type: 'status_change' },
];