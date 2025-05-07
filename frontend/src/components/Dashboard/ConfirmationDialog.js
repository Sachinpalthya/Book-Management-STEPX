import React from 'react';
import './styles.css';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Confirmation</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-button">
            Yes
          </button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;