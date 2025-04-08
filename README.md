# Dify 到 RAGFlow 知识库迁移工具

这个工具用于将 Dify 知识库中的文档迁移到 RAGFlow 知识库中。

## 功能特点

- 自动获取 Dify 中的所有知识库
- 在 RAGFlow 中创建对应的知识库
- 迁移所有文档内容
- 保留文档元数据

## 安装

1. 克隆项目
2. 安装依赖：
```bash
npm install
```

## 配置

3. 在 `.env` 文件中配置以下信息：
   - DIFY_API_KEY：Dify API 密钥
   - DIFY_API_BASE_URL：Dify API 基础 URL
   - RAGFLOW_API_KEY：RAGFlow API 密钥
   - RAGFLOW_API_BASE_URL：RAGFlow API 基础 URL
4. 在 `config.js` 文件中配置以下信息：
   - DIFY_DATASET_ID：Dify 知识库ID
   - RAGFLOW_DATASET_ID：RAGFlow 知识库ID

## 使用方法

运行以下命令开始迁移：

```bash
npm run start
```

运行以下命令开始RAGFlow解析：

```bash
npm run parse
```

## 注意事项

- 请确保有足够的 API 调用权限
- 建议在迁移前备份重要数据
- 迁移过程中请勿中断程序 
