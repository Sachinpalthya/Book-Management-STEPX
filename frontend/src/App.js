import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const chaptersData = {
  English: ['Chapter 1', 'Chapter 2'],
  Math: ['Chapter 1', 'Chapter 2'],
  Science: ['Chapter 1']
};

const Sidebar = ({ setSelectedYear, selectedYear }) => (
  <div className="w-64 bg-gray-800 text-white p-4 h-screen">
    <h1 className="text-xl font-bold mb-4">Intermediate Book Management</h1>
    {['1st Year', '2nd Year'].map((year) => (
      <button
        key={year}
        className={`block w-full text-left px-4 py-2 mb-2 rounded ${
          selectedYear === year ? 'bg-blue-600' : 'bg-gray-700'
        }`}
        onClick={() => setSelectedYear(year)}
      >
        {year}
      </button>
    ))}
  </div>
);

const SubjectList = ({ onSelectSubject }) => {
  const subjects = Object.keys(chaptersData);
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Subjects</h2>
      {subjects.map((subject) => (
        <button
          key={subject}
          className="block px-4 py-2 mb-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => onSelectSubject(subject)}
        >
          {subject}
        </button>
      ))}
    </div>
  );
};
function Example() {
  return (
    <div>
      <QRCodeSVG value="https://example.com" size={128} />
    </div>
  );
}

const ChapterList = ({ subject }) => {
  const [qrData, setQrData] = useState({});
  const [qrForAll, setQrForAll] = useState('');
  const [chapters, setChapters] = useState(chaptersData[subject] || []);

  const handleInputChange = (chapter, value) => {
    setQrData((prev) => ({ ...prev, [chapter]: value }));
  };

  const handleUpload = () => {
    const newChapter = `Chapter ${chapters.length + 1}`;
    setChapters([...chapters, newChapter]);
  };

  const handleDelete = (chapter) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      setChapters(chapters.filter((c) => c !== chapter));
    }
  };

  const handleModify = (chapter) => {
    if (window.confirm('Are you sure you want to modify this chapter?')) {
      alert(`Modify ${chapter}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">{subject} Chapters</h2>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          className="border px-2 py-1 mr-2 w-96"
          placeholder="URL for all chapters"
          value={qrForAll}
          onChange={(e) => setQrForAll(e.target.value)}
        />
        <QRCode value={qrForAll} size={64} />
      </div>
      <button
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleUpload}
      >
        Upload Chapter
      </button>
      <div>
        {chapters.map((chapter, idx) => (
          <div key={idx} className="flex items-center mb-2">
            <span className="mr-2 w-32">{chapter}</span>
            <input
              type="text"
              className="border px-2 py-1 mr-2 w-96"
              placeholder="Enter URL"
              value={qrData[chapter] || ''}
              onChange={(e) => handleInputChange(chapter, e.target.value)}
            />
            <QRCode value={qrData[chapter] || ''} size={48} />
            <button
              className="ml-4 bg-yellow-500 text-white px-2 py-1 rounded"
              onClick={() => handleModify(chapter)}
            >
              Modify
            </button>
            <button
              className="ml-2 bg-red-600 text-white px-2 py-1 rounded"
              onClick={() => handleDelete(chapter)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  return (
    <div className="flex">
      <Sidebar setSelectedYear={setSelectedYear} selectedYear={selectedYear} />
      <div className="flex-1 p-6">
        {!selectedSubject && selectedYear && (
          <SubjectList onSelectSubject={setSelectedSubject} />
        )}
        {selectedSubject && <ChapterList subject={selectedSubject} />}
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/signin" element={<div>Sign In Page</div>} />
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/logout" element={<div>Logout Page</div>} />
    </Routes>
  </Router>
);

export default App;
