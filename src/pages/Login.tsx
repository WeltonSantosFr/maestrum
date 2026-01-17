import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Login.css';
import type { AxiosError } from 'axios';

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
}).required();

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await api.post('/auth/login', data);
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('userId', user.id);
      // eslint-disable-next-line react-hooks/immutability
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro no login:', error.response?.data);
      setError('root', { message: error.response?.data?.message || 'Erro ao fazer login' });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="login-input"
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className="login-input"
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>
          <button type="submit" className="login-btn">Entrar</button>
          {errors.root && <span className="error-message">{errors.root.message}</span>}
        </form>
        <p className="login-link">
          Não tem conta? <Link to="/register">Registrar</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;