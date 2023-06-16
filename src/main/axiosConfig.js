import axios from 'axios';
import { Navigate } from 'react-router-dom';

// Configuração do interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Redireciona para a tela de login
      Navigate('/login');
    }
    return Promise.reject(error);
  }
);


export default axios;