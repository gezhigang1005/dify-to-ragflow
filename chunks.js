require('dotenv').config();
const axios = require('axios');
const { RAGFLOW_DATASET_ID  } = require('./config')

// RAGFlow API 客户端
const ragflowClient = axios.create({
    baseURL: process.env.RAGFLOW_API_BASE_URL,
    headers: {
        'Authorization': `Bearer ${process.env.RAGFLOW_API_KEY}`,
        'Content-Type': 'application/json'
    }
});


async function uploadDocumentToRAGFlow(ids) {
    try {
        const response = await ragflowClient.post(`/api/v1/datasets/${RAGFLOW_DATASET_ID}/chunks`, {
            document_ids: ids
        });
        
        if(response.data.code == 0) {
            return '上传成功';
        } else {
            return response.data.message;
        }
    } catch (error) {
        console.error('解析文档到失败:', error);
        throw error;
    }
}


async function getDocuments() {
    try {
        const response = await ragflowClient.get(`/api/v1/datasets/${RAGFLOW_DATASET_ID}/documents`, {
            params: {
                page: 1,
                page_size: 360
            }
        });
        if(response.data.code == 0 && response.data.data && Array.isArray(response.data.data.docs)){
            await uploadDocumentToRAGFlow(response.data.data.docs.map(it => it.id))
        }
    } catch (error) {
        console.error('获取文档失败:', error);
        throw error;
    }
}

// 执行解析
getDocuments()