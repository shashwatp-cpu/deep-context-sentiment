import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1'; // Your FastAPI backend URL

export const getAnalysis = (url) => {
  return axios.post(`${API_URL}/analyze`, { url });
};