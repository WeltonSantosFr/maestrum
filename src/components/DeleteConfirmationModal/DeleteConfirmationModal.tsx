import React, { useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Confirmar Exclusão</h2>
        <p>Tem certeza que quer excluir este exercício? Esta ação não pode ser desfeita.</p>
        <div className="modal-actions">
          <button 
            onClick={onClose} 
            className="cancel-btn"
          >
            Cancelar
          </button>
          <button 
            onClick={() => {
              setLoading(true);
              onConfirm()
              setTimeout(() => {
                setLoading(false);
                onClose();
              }, 500);
              }} disabled={loading}>
            {loading ? <AiOutlineLoading className='loading-icon' /> : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;