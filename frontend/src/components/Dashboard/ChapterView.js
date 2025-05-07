import React, { useState, useEffect } from 'react';
import './styles.css';
import AddEditChapterModal from './AddEditChapterModal';
import ConfirmationDialog from './ConfirmationDialog';

const ChapterView = ({ year, subject }) => {
  const [chapters, setChapters] = useState([]);
  const [qrLink, setQrLink] = useState('');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState(null);

  useEffect(() => {
    // Dummy chapter data - replace with API call based on year and subject
    if (year && subject) {
      setChapters([
        { id: 1, name: 'Chapter 1', qrLink: 'link1' },
        { id: 2, name: 'Chapter 2', qrLink: 'link2' },
        { id: 3, name: 'Chapter 3', qrLink: 'link3' },
      ]);
    } else {
      setChapters([]);
    }
  }, [year, subject]);

  const handleGenerateAllQr = () => {
    // Logic to generate a single QR for all chapters
    console.log('Generate QR for all chapters');
  };

  const handleUploadChapter = (file) => {
    // Logic to handle chapter file upload
    console.log('Uploading chapter:', file);
    // After successful upload, update the chapters list
  };

  const handleGenerateIndividualQr = (chapterId) => {
    // Logic to generate QR for a specific chapter
    const chapter = chapters.find((c) => c.id === chapterId);
    if (chapter) {
      console.log(`Generate QR for ${chapter.name} with link: ${chapter.qrLink}`);
      // You might want to display the QR code or a download link
    }
  };

  const handleOpenAddModal = () => {
    setEditingChapter(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (chapter) => {
    setEditingChapter(chapter);
    setIsAddEditModalOpen(true);
  };

  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setEditingChapter(null);
  };

  const handleSaveChapter = (chapterData) => {
    if (editingChapter) {
      // Logic to update existing chapter
      console.log('Updating chapter:', { ...editingChapter, ...chapterData });
      // After successful update, refresh the chapters list
    } else {
      // Logic to add a new chapter
      console.log('Adding new chapter:', chapterData);
      // After successful addition, refresh the chapters list
    }
    handleCloseAddEditModal();
  };

  const handleDeleteConfirmation = (chapter) => {
    setChapterToDelete(chapter);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setChapterToDelete(null);
  };

  const handleDeleteChapter = () => {
    if (chapterToDelete) {
      // Logic to delete the chapter
      console.log('Deleting chapter:', chapterToDelete);
      // After successful deletion, refresh the chapters list
      setChapters(chapters.filter((c) => c.id !== chapterToDelete.id)); // Example UI update
      handleCloseDeleteDialog();
    }
  };

  return (
    <div className="chapter-view">
      <div className="chapter-actions">
        <button onClick={handleGenerateAllQr}>Generate QR for All</button>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files[0]) {
              handleUploadChapter(e.target.files[0]);
            }
          }}
        />
        <button onClick={handleOpenAddModal}>Add New Chapter</button>
      </div>

      <h2>{subject} Chapters ({year})</h2>
      <div className="chapter-list-header">
        <span>#</span>
        <span>Chapter Name</span>
        <span>QR Link</span>
        <span>QR URL</span>
        <span>Actions</span>
      </div>
      <ul className="chapter-list">
        {chapters.map((chapter, index) => (
          <li key={chapter.id} className="chapter-item">
            <span>{index + 1}</span>
            <span>{chapter.name}</span>
            <span>
              {chapter.qrLink ? (
                <button onClick={() => handleGenerateIndividualQr(chapter.id)}>
                  Generate QR
                </button>
              ) : (
                'N/A'
              )}
            </span>
            <input
              type="text"
              value={chapter.qrLink || ''}
              onChange={(e) => {
                // Implement logic to update the QR link for this chapter
                const updatedChapters = chapters.map((c) =>
                  c.id === chapter.id ? { ...c, qrLink: e.target.value } : c
                );
                setChapters(updatedChapters);
              }}
              placeholder="Enter QR URL"
            />
            <div className="chapter-actions">
              <button onClick={() => handleOpenEditModal(chapter)}>Modify</button>
              <button onClick={() => handleDeleteConfirmation(chapter)} className="delete-button">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isAddEditModalOpen && (
        <AddEditChapterModal
          isOpen={isAddEditModalOpen}
          onClose={handleCloseAddEditModal}
          onSave={handleSaveChapter}
          editingChapter={editingChapter}
        />
      )}

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteChapter}
          message={`Are you sure you want to delete "${chapterToDelete?.name}"?`}
        />
      )}
    </div>
  );
};

export default ChapterView;