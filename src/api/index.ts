import axios from 'axios';

export const fetchApi = axios.create({
  baseURL: 'http://localhost:8000',
});
