import axios from 'axios';

const apiConfig = axios.create({
    baseURL: '/.netlify/functions/app',
    timeout: 30000
});

export default apiConfig;
