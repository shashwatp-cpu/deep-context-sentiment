import axios from 'axios';

const API_URL = '/api/v1';

export const getAnalysis = (url) => {
  return axios.post(`${API_URL}/analyze`, { url });
};