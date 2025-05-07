import React, { useState, useEffect } from 'react';
import './styles.css';

const AddEditChapterModal = ({ isOpen, onClose, onSave, editingChapter }) => {
  const [chapterName, setChapterName] = useState('');

  useEffect(() => {
    if (editingChapter) {
      setChapterName(editingChapter.name);
    } else {
      setChapterName('');
    }
  }, [editingChapter]);

  const handleSave = () => {
    if (chapterName.trim()) {
      onSave({ name: chapterName });
      setChapterName('');
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editingChapter ? 'Edit Chapter' : 'Add New Chapter'}</h3>
        <div className="form-group">
          <label htmlFor="chapterName">Chapter Name:</label>
          <input
            type="text"
            id="chapterName"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddEditChapterModal;