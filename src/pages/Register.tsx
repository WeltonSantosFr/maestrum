import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import './Login.css';

const schema = yup.object({
  username: yup.string().required('Username é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
}).required();

interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<RegisterForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data);
      navigate('/login');
    } catch (error: any) {
      console.error('Erro no registro:', error.response?.data);
      setError('root', { message: error.response?.data?.message || 'Erro ao fazer registro' });
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-modal-content">
        <h2>Crie sua conta</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              {...register('username')}
              placeholder="Seu username"
              autoFocus
            />
            {errors.username && <span className="error-message">{errors.username.message}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email')}
              placeholder="seu@email.com"
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
            <button type="submit" className="login-btn">Criar conta</button>
          </div>
        </form>
        <p className="register-link">
          Já tem uma conta? <Link to="/login">Entre agora</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
