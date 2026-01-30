import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Login.css';
import { AiOutlineLoading } from 'react-icons/ai';

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
}).required();

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', data);
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('userId', user.id);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      navigate('/dashboard');
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.error('Erro no login:', error.response?.data);
      setError('root', { message: error.response?.data?.message || 'Erro ao fazer login' });
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-modal-content">
        <h2>Acesse sua conta</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email')}
              placeholder="seu@email.com"
              autoFocus
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              {...register('password')}
              placeholder="Sua senha"
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>
          {errors.root && <span className="error-message root-error">{errors.root.message}</span>}
          <div className="modal-actions">
            <button type="submit" className="login-btn" disabled={loading}>{loading ? <AiOutlineLoading className='loading-icon' /> : 'Entrar'}</button>
          </div>
        </form>
        <p className="register-link">
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;