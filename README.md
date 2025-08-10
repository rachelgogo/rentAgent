# 租房AI助手 - 智能公寓推荐系统

基于OpenAI的智能租房助手，帮助用户找到最适合的公寓。通过自然语言理解用户需求，提供个性化的公寓推荐和详细的市场分析。

## 🌟 主要功能

### 🏠 智能搜索
- **自然语言理解**：用自然语言描述租房需求
- **个性化推荐**：AI分析需求并推荐8套最适合的公寓
- **真实地址**：所有公寓地址可点击跳转到Google Maps
- **多样化结果**：每次搜索生成不同的公寓组合

### 📊 市场分析
- **实时市场数据**：基于OpenAI的实时市场分析
- **价格统计**：准确的平均租金和价格区间
- **市场活跃度**：动态计算的市场活跃度评估
- **实用建议**：预算建议、租房建议等

### 💬 租房问答
- **智能问答**：回答租房相关问题
- **快速响应**：7秒内快速回答
- **专业建议**：提供专业的租房建议

### 🌐 租房网站导航
- **精选平台**：精选优质租房平台
- **分类导航**：按功能和地区分类
- **直接链接**：快速访问各大租房网站

## 🚀 技术特点

- **Next.js 14**：现代化的React框架
- **OpenAI GPT-4o**：最新最强的多模态AI模型
- **TypeScript**：类型安全的开发体验
- **Tailwind CSS**：现代化的UI设计
- **响应式设计**：支持各种设备访问

## 📦 安装和运行

### 环境要求
- Node.js 18+ 
- npm 或 yarn
- OpenAI API密钥

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/rachelgogo/rentAgent.git
cd rentAgent
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env.local
```
编辑 `.env.local` 文件，添加您的OpenAI API密钥：
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 🎯 使用指南

### 智能搜索
1. 在搜索框中输入您的租房需求
2. 例如："我想在旧金山找一个2居室公寓，预算3000美元，需要宠物友好"
3. 点击"开始搜索"
4. 查看AI推荐的8套公寓

### 市场分析
1. 选择"市场分析"搜索类型
2. 输入城市名称，如"旧金山"
3. 查看详细的市场分析报告

### 租房问答
1. 选择"租房问答"搜索类型
2. 输入您的问题
3. 获得专业的租房建议

## 🔧 项目结构

```
app/
├── api/                    # API路由
│   └── openai-apartments/  # OpenAI公寓API
├── components/             # React组件
│   ├── ApartmentCard.tsx   # 公寓卡片组件
│   ├── MarketAnalysisTemplate.tsx  # 市场分析模板
│   └── QuestionAnswerTemplate.tsx  # 问答模板
├── services/               # 服务层
│   ├── openaiApi.ts        # OpenAI API服务
│   └── openaiRealDataApi.ts # 真实数据API服务
├── types.ts                # TypeScript类型定义
├── layout.tsx              # 应用布局
└── page.tsx                # 主页面
```

## 🛠️ 开发

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```

## 📝 版本历史

### v1.0.0 (2024-01-XX)
- ✅ 智能搜索功能
- ✅ 市场分析功能  
- ✅ 租房问答功能
- ✅ 租房网站导航
- ✅ 修复搜索结果重复问题
- ✅ 优化缓存机制
- ✅ 移除假公寓数据

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License

## 🔗 相关链接

- [OpenAI API](https://platform.openai.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**租房AI助手** - 让租房变得更智能、更简单！
