const Chapter = require('../models/Chapter');
const { validationResult } = require('express-validator');

const getChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find({ user: req.user._id });
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

  const { title, subjectId, qrUrl } = req.body;

  try {
    const chapter = await Chapter.create({
      title,
      subject: subjectId,
      qrUrl,
      user: req.user._id
    });

    res.status(201).json(chapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getChapters,
  createChapter
};
