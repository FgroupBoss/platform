# 家庭幼儿诗词故事平台

## 联调模式（默认，无需 MySQL）

后端使用 **H2 内存库**，不依赖 MySQL / Redis / MinIO。TTS 已开启（需外网）；无预录音频时前端使用浏览器朗读降级。

### 启动

**终端 1 — 后端**
```bash
cd backend
mvn spring-boot:run
```

**终端 2 — 前端**
```bash
cd frontend
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`，Vite 会将 `/api` 代理到 `http://localhost:8080`。

### 管理端联调

| 页面 | 路径 |
|------|------|
| 登录 | `/admin/login`（admin / admin123） |
| 概览 | `/admin` |
| 诗词管理 | `/admin/poems` |
| 故事管理 | `/admin/stories` |
| 媒体库 | `/admin/media` |

### 家庭端验证

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` | 今日推荐（诗词 + 故事） |
| 诗词列表 | `/poems` | 从后端加载 |
| 诗词详情 | `/poems/1` | 大字展示 + 浏览器朗读 |
| 故事列表 | `/stories` | 从后端加载 |
| 故事详情 | `/stories/1` | 分段展示 + 浏览器朗读 |

---

## 连接 MySQL（可选）

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

需先启动 MySQL 并创建库 `family_edu`（或使用 `docker compose up -d`）。

---

## 管理端

- 地址：`http://localhost:8080`
- 账号：`admin` / `admin123`
- 登录：`POST /api/v1/admin/auth/login`

TTS 文字转音频在联调模式（`standalone`）与 `mysql` 配置下均可使用（需外网）。

详见 [设计/01-项目总体规划.md](./设计/01-项目总体规划.md)
