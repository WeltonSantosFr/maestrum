import React from 'react';

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onClose, onConfirm }) => {
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
            onClick={onConfirm}
            className="flex-[2] bg-red-500 text-white py-3 rounded-2xl text-xs font-bold shadow-lg hover:bg-red-600 transition-all uppercase tracking-widest"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;