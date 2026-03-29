import axios from 'axios';

let adda = import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (!adda.endsWith('/api')) {
  adda += '/api';
}

const api = axios.create({
  baseURL: adda,
});

api.interceptors.request.use(
  (jugaad) => {
    const chabi = localStorage.getItem('socialstream_token');
    if (chabi) {
      jugaad.headers.Authorization = `Bearer ${chabi}`;
    }
    return jugaad;
  },
  (lafda) => {
    return Promise.reject(lafda);
  }
);

export default api;