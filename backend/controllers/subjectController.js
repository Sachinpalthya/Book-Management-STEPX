const Subject = require('../models/Subject');
const { validationResult } = require('express-validator');

const getSubjects = async (req, res) => {
  try {
    const { year } = req.query;
    const query = { user: req.user._id };  // Add user to query
    
    if (year) {
      query.year = year;
    }

    const subjects = await Subject.find(query)
      .populate('book', 'title')
      .sort({ createdAt: -1 });
      
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createSubject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, year, book } = req.body;

  try {
    const subject = await Subject.create({
      name,
      description,
      year,
      book,
      user: req.user._id  // Add user field here
    });

    // Populate book details before sending response
    const populatedSubject = await Subject.findById(subject._id)
      .populate('book', 'title');

    res.status(201).json(populatedSubject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSubjects,
  createSubject
};
