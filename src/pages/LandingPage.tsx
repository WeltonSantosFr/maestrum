import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.8 },
    },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="landing-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <header className="landing-header">
        <motion.h1 className="landing-title" variants={itemVariants}>
          GiTaa
        </motion.h1>
        <motion.p className="landing-subtitle" variants={itemVariants}>
          Aprenda guitarra de forma interativa e divertida
        </motion.p>
      </header>
      <main className="landing-main">
        <motion.p className="landing-description" variants={itemVariants}>
          Crie e personalize sua própria lista de exercícios de guitarra. Acompanhe seu progresso, defina metas, registre recordes de BPM e muito mais.
          Comece sua jornada musical hoje e toque suas músicas favoritas!
        </motion.p>
        <motion.div className="cta-buttons" variants={itemVariants}>
          <motion.div variants={buttonVariants} whileHover="hover">
            <Link to="/login" className="btn btn-primary">Entrar</Link>
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover">
            <Link to="/register" className="btn btn-secondary">Registrar</Link>
          </motion.div>
        </motion.div>
      </main>
      <footer className="landing-footer">
        <motion.p variants={itemVariants}>&copy; 2026 GiTaa. Todos os direitos reservados.</motion.p>
      </footer>
    </motion.div>
  );
};

export default LandingPage;