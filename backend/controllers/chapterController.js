const Chapter = require('../models/Chapter');
const { validationResult } = require('express-validator');

// Add new QR redirect endpoint
const handleQRRedirect = async (req, res) => {
  try {
    const { qrId } = req.params;
    const chapter = await Chapter.findOne({ qrId });
    
    if (!chapter) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    if (!chapter.qrUrl) {
      return res.status(404).json({ message: 'No URL set for this QR code' });
    }

    // Redirect to the stored URL
    res.redirect(chapter.qrUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getChapters = async (req, res) => {
  try {
    const { subject } = req.query;
    const query = {};
    
    if (subject) {
      query.subject = subject;
    }

    const chapters = await Chapter.find(query)
      .populate('subject', 'name')
      .sort({ createdAt: -1 });
      
    res.json(chapters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createChapter = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, subjectId } = req.body;

  try {
    // Create chapter with QR redirect URL
    const chapter = await Chapter.create({
      title,
      description,
      subject: subjectId,
      qrContent: '', // Will be set to the redirect URL
      qrUrl: '' // URL can be updated later
    });

    // Update the QR content to point to our redirect endpoint
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const redirectUrl = `${baseUrl}/api/chapters/qr/${chapter.qrId}`;
    
    await Chapter.findByIdAndUpdate(
      chapter._id,
      { qrContent: redirectUrl }
    );

    // Populate subject details before sending response
    const populatedChapter = await Chapter.findById(chapter._id)
      .populate('subject', 'name');

    res.status(201).json(populatedChapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateChapterUrl = async (req, res) => {
  const { chapterId } = req.params;
  const { qrUrl } = req.body;

  try {
    const chapter = await Chapter.findByIdAndUpdate(
      chapterId,
      { qrUrl },
      { new: true }
    ).populate('subject', 'name');

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json(chapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getChapters,
  createChapter,
  updateChapterUrl,
  handleQRRedirect
};
