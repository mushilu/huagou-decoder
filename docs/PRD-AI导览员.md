# AI古建筑导览员 - 产品需求文档

## 1. 产品概述

### 1.1 产品定位
为华构解码器增加AI导览功能，让用户能够通过自然语言与系统互动，深入了解中国古建筑知识。

### 1.2 目标用户
- 学生：学习古建筑知识
- 教师：辅助教学
- 研究者：快速查阅资料

### 1.3 核心价值
- 降低古建筑知识的学习门槛
- 提供沉浸式的学习体验
- 结合3D可视化与AI问答

---

## 2. 功能设计

### 2.1 AI导览员交互形态

#### 2.1.1 悬浮对话气泡（全局）
- 位置：页面右下角
- 触发：点击图标展开对话框
- 功能：回答通用问题（如"斗拱是什么"、"明清建筑有什么区别"）
- 状态：收起时显示小图标，展开时显示对话界面

#### 2.1.2 3D虚拟导游（场景内）
- 形象：古代工匠（低多边形风格）
- 服饰：传统匠人服装
- 道具：手持工具（墨斗、角尺等）
- 行为：
  - 空闲时在场景中漫游
  - 用户点击时停下并面向用户
  - 说话时有简单动画

#### 2.1.3 建筑详情页内嵌
- 位置：建筑详情页底部
- 功能：针对当前建筑的问答
- 预设问题：
  - "这座建筑的屋顶样式叫什么？"
  - "它的建造年代是什么时候？"
  - "有什么独特的建筑特征？"

### 2.2 知识系统

#### 2.2.1 本地知识库（优先）
- 数据源：现有 `knowledge.ts` 中的内容
  - 风水知识
  - 色彩象征
  - 空间布局
  - 建筑类型
- 搜索：Fuse.js 模糊匹配
- 响应：匹配到时直接返回，无需调用LLM

#### 2.2.2 LLM兜底（次选）
- 触发条件：本地知识库无匹配结果
- 服务：Cloudflare Workers AI
- Prompt模板：
  ```
  你是一位中国古建筑专家，正在为用户讲解古建筑知识。
  用户问题：{question}
  请用简洁易懂的语言回答，适合教育场景。
  ```

### 2.3 用户系统

#### 2.3.1 游客模式
- 无需登录即可使用
- 限制：每天5次AI问答（localStorage记录）
- 无对话历史保存

#### 2.3.2 登录用户
- 无问答次数限制
- 保存对话历史
- 可查看历史对话记录

#### 2.3.3 登录方式
| 方式 | 优先级 | 说明 |
|------|--------|------|
| 邮箱验证码 | 主要 | 6位数字验证码，5分钟有效 |
| GitHub OAuth | 备选 | 适合开发者用户 |

---

## 3. 技术架构

### 3.1 整体架构

```
┌─────────────────────────────────────────────────────┐
│                    前端 (React)                      │
├─────────────┬─────────────┬─────────────────────────┤
│  对话气泡   │  3D导游     │  详情页问答              │
│  组件       │  Three.js   │  组件                   │
└──────┬──────┴──────┬──────┴───────────┬─────────────┘
       │             │                  │
       └─────────────┼──────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Cloudflare Workers                      │
├─────────────┬─────────────┬─────────────────────────┤
│  Auth API   │  Chat API   │  History API            │
└──────┬──────┴──────┬──────┴───────────┬─────────────┘
       │             │                  │
       ▼             ▼                  ▼
┌──────────┐  ┌──────────────┐  ┌──────────────┐
│ D1 数据库 │  │ Workers AI   │  │ 邮件服务     │
│ (用户/历史)│  │ (LLM推理)    │  │ (验证码)     │
└──────────┘  └──────────────┘  └──────────────┘
```

### 3.2 技术选型

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | React 19 + Vite | 现有技术栈 |
| 3D渲染 | Three.js / R3F | 现有技术栈 |
| 状态管理 | Zustand | 现有技术栈 |
| 后端运行时 | Cloudflare Workers | 边缘计算，国内访问快 |
| 数据库 | Cloudflare D1 | SQLite兼容，免费tier够用 |
| AI推理 | Cloudflare Workers AI | 与Workers无缝集成 |
| 邮件服务 | Resend / Mailgun | 发送验证码 |

### 3.3 数据库设计

#### users 表
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  github_id TEXT UNIQUE,
  nickname TEXT,
  avatar TEXT,
  created_at INTEGER,
  last_login INTEGER
);
```

#### conversations 表
```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT,
  created_at INTEGER,
  updated_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### messages 表
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  role TEXT, -- 'user' | 'assistant'
  content TEXT,
  created_at INTEGER,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
```

#### verification_codes 表
```sql
CREATE TABLE verification_codes (
  id TEXT PRIMARY KEY,
  email TEXT,
  code TEXT,
  expires_at INTEGER,
  used INTEGER DEFAULT 0
);
```

---

## 4. API设计

### 4.1 认证相关

#### POST /api/auth/send-code
发送邮箱验证码
```json
// Request
{ "email": "user@example.com" }

// Response
{ "success": true, "message": "验证码已发送" }
```

#### POST /api/auth/verify-code
验证邮箱验证码并登录
```json
// Request
{ "email": "user@example.com", "code": "123456" }

// Response
{ "success": true, "token": "jwt...", "user": {...} }
```

#### GET /api/auth/github
GitHub OAuth跳转

#### GET /api/auth/github/callback
GitHub OAuth回调

### 4.2 对话相关

#### POST /api/chat
发送消息并获取AI回复
```json
// Request
{
  "message": "斗拱是什么？",
  "conversation_id": "optional-id",
  "context": { "building_id": "optional" }
}

// Response
{
  "reply": "斗拱是中国古建筑特有的结构构件...",
  "source": "local" | "llm",
  "conversation_id": "xxx"
}
```

#### GET /api/conversations
获取用户对话历史列表

#### GET /api/conversations/:id
获取单个对话详情

---

## 5. 前端组件设计

### 5.1 新增组件

```
src/
├── components/
│   ├── ai/
│   │   ├── ChatBubble.tsx      # 悬浮对话气泡
│   │   ├── ChatDialog.tsx      # 对话框主体
│   │   ├── MessageList.tsx     # 消息列表
│   │   ├── MessageInput.tsx    # 输入框
│   │   └── BuildingChat.tsx    # 建筑详情页内嵌问答
│   ├── auth/
│   │   ├── LoginModal.tsx      # 登录弹窗
│   │   ├── EmailLogin.tsx      # 邮箱登录表单
│   │   └── GitHubLogin.tsx     # GitHub登录按钮
│   └── three/
│       └── Guide3D.tsx         # 3D虚拟导游
├── hooks/
│   ├── useAuth.ts              # 认证状态管理
│   └── useChat.ts              # 对话状态管理
├── services/
│   ├── authService.ts          # 认证API封装
│   └── chatService.ts          # 对话API封装
└── stores/
    ├── authStore.ts            # 用户状态
    └── chatStore.ts            # 对话状态
```

### 5.2 3D导游模型

- 格式：GLTF/GLB
- 多边形数：< 5000（性能考虑）
- 动画：
  - idle：待机呼吸
  - walk：行走
  - talk：说话
  - point：指向

---

## 6. 实现计划

### Phase 1: 基础设施
- [ ] Cloudflare Workers项目初始化
- [ ] D1数据库创建和表结构
- [ ] 基础API框架搭建

### Phase 2: 用户系统
- [ ] 邮箱验证码登录
- [ ] GitHub OAuth登录
- [ ] JWT认证中间件
- [ ] 前端登录UI

### Phase 3: AI对话（MVP）
- [ ] 本地知识库搜索
- [ ] Workers AI集成
- [ ] 悬浮对话气泡组件
- [ ] 游客次数限制

### Phase 4: 增强功能
- [ ] 对话历史保存
- [ ] 建筑详情页内嵌问答
- [ ] 上下文感知（当前建筑信息）

### Phase 5: 3D导游
- [ ] 工匠模型制作/采购
- [ ] Three.js角色控制
- [ ] 动画状态机
- [ ] 与对话系统联动

---

## 7. 成本估算

### Cloudflare免费tier
| 资源 | 免费额度 | 预估用量 |
|------|----------|----------|
| Workers请求 | 10万/天 | 足够 |
| D1存储 | 5GB | 足够 |
| D1读取 | 500万/天 | 足够 |
| Workers AI | 按模型计费 | 需监控 |

### 邮件服务
- Resend免费tier：100封/天
- 足够验证码场景

---

## 8. 风险与对策

| 风险 | 对策 |
|------|------|
| Workers AI模型能力不足 | 预留切换到通义千问/智谱的接口 |
| 3D模型制作成本高 | Phase 5可用简单几何体代替 |
| 用户滥用AI接口 | 游客限制 + 登录用户限流 |
| 邮件进垃圾箱 | 配置SPF/DKIM，或改用短信 |

---

## 附录

### A. 参考资源
- Cloudflare Workers文档
- Cloudflare D1文档
- Cloudflare Workers AI模型列表

### B. 相关文件
- `src/data/knowledge.ts` - 现有知识库
- `src/services/SearchService.ts` - 现有搜索服务
