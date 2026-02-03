import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="landing-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="dashboard-header">
        <div className="header-title">
          <h1>MAESTRUM</h1>
          <p>Gerenciador de Prática</p>
        </div>
        <div className="header-actions">
          <Link to="/login" className="btn btn-secondary">Entrar</Link>
          <Link to="/register" className="btn btn-primary">Registrar</Link>
        </div>
      </header>
      <main className="landing-main">
        <motion.div
          className="landing-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="landing-headline">Treine de forma interativa e divertida</h2>
          <p className="landing-description">
            Crie e personalize sua própria lista de exercícios de guitarra. Acompanhe seu progresso, defina metas, registre recordes de BPM e muito mais.
            Comece sua jornada musical hoje e toque suas músicas favoritas!
          </p>
          <motion.div variants={buttonVariants} whileHover="hover">
            <Link to="/register" className="btn btn-primary cta-button">Comece agora</Link>
          </motion.div>
        </motion.div>
      </main>
      <footer className="landing-footer">
        <p>&copy; 2026 Maestrum. Todos os direitos reservados.</p>
      </footer>
    </motion.div>
  );
};

export default LandingPage;