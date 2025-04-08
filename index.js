require('dotenv').config();
const { RAGFLOW_DATASET_ID, DIFY_DATASET_ID  } = require('./config')
const axios = require('axios');
const FormData = require('form-data');

// Dify API 客户端
const difyClient = axios.create({
    baseURL: process.env.DIFY_API_BASE_URL,
    headers: {
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
        'Content-Type': 'application/json'
    }
});

// RAGFlow API 客户端
const ragflowClient = axios.create({
    baseURL: process.env.RAGFLOW_API_BASE_URL,
    headers: {
        'Authorization': `Bearer ${process.env.RAGFLOW_API_KEY}`
    }
});

async function getDifyKnowledgeBases() {
    try {
        const response = await difyClient.get(`/datasets/${DIFY_DATASET_ID}/documents`, {
            params: {
                page: 1,
                limit: 100
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('获取 Dify 知识库失败:', error.message);
        throw error;
    }
}

async function getDifyDocuments(document_id) {
    try {
        const response = await difyClient.get(`/datasets/${DIFY_DATASET_ID}/documents/${document_id}/upload-file`);
        
        const fileRes = await axios({
            method: 'get',
            url: 'http://inside-consul.yqcx.faw.cn' + response.data.download_url,
            responseType: 'arraybuffer'  // 改用 arraybuffer 而不是 blob
        });

        // 创建文件对象
        const buffer = Buffer.from(fileRes.data);
        return buffer;
    } catch (error) {
        console.error('获取 Dify 文档失败:', error.message);
        throw error;
    }
}

async function uploadDocumentToRAGFlow(file, name) {
    try {
        const formData = new FormData();
        formData.append('dataset_id', RAGFLOW_DATASET_ID);
        
        // 将 buffer 作为文件添加到 FormData
        formData.append('file', file, {
            filename: name,  // 设置文件名
        });

        console.log('正在上传文件，大小:', file.length, '字节');

        const response = await ragflowClient.post(`/api/v1/datasets/${RAGFLOW_DATASET_ID}/documents`, formData);
        
        if(response.data.code == 0) {
            return '上传成功';
        } else {
            return response.data.message;
        }
    } catch (error) {
        console.error('上传文档到 RAGFlow 失败:', error);
        throw error;
    }
}

async function migrateKnowledgeBase() {
    try {
        // 1. 获取所有 Dify 知识库
        console.log('正在获取 Dify 知识库列表...');
        const difyKnowledgeBases = await getDifyKnowledgeBases();
        for (const difyKB of difyKnowledgeBases) {
            console.log(`正在处理知识库: ${difyKB.name}`);
            const doc = await getDifyDocuments(difyKB.id);
            const message = await uploadDocumentToRAGFlow(doc, difyKB.name);
            console.log(message);
        }
        
        console.log('所有知识库迁移完成！');
    } catch (error) {
        console.error('迁移过程中发生错误:', error.message);
    }
}

// 执行迁移
migrateKnowledgeBase(); 