const Chapter = require('../models/Chapter');
const Subject = require('../models/Subject');
const { validationResult } = require('express-validator');

// Function to generate HTML for multi QR display
const generateMultiQRHtml = (qrCodes) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Educational Content Links</title>
        <style>
            :root {
              --primary-color: #2563eb;
              --primary-light: #dbeafe;
              --border-color: #e5e7eb;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 20px;
                background-color: #f8fafc;
                color: #1f2937;
            }
            .container {
                max-width: 1000px;
                margin: 0 auto;
                background-color: white;
                padding: 2rem;
                border-radius: 12px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding-bottom: 2rem;
                margin-bottom: 2rem;
                border-bottom: 1px solid var(--border-color);
            }
            h1 {
                color: var(--primary-color);
                font-size: 2rem;
                margin: 0 0 0.5rem 0;
            }
            .subtitle {
                color: #64748b;
                font-size: 1.1rem;
            }
            .links-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 1.5rem;
                padding: 1rem 0;
            }
            .link-card {
                background-color: white;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 1.5rem;
                transition: all 0.2s ease;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .link-card:hover {
                border-color: var(--primary-color);
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                transform: translateY(-2px);
            }
            .link-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: #1f2937;
                margin: 0;
            }
            .link-url {
                color: #64748b;
                font-size: 0.875rem;
                background-color: #f8fafc;
                padding: 0.5rem;
                border-radius: 4px;
                word-break: break-all;
            }
            .open-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background-color: var(--primary-color);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                text-decoration: none;
                transition: background-color 0.2s;
                margin-top: auto;
            }
            .open-button:hover {
                background-color: #1d4ed8;
            }
            .no-links {
                text-align: center;
                padding: 3rem;
                background-color: #f8fafc;
                border-radius: 8px;
                color: #64748b;
            }
            @media (max-width: 640px) {
                .container {
                    padding: 1rem;
                }
                .links-grid {
                    grid-template-columns: 1fr;
                }
                .link-card {
                    padding: 1rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Educational Content</h1>
                <p class="subtitle">Access your learning materials below</p>
            </div>
            ${qrCodes.length > 0 ? `
                <div class="links-grid">
                    ${qrCodes.map(qr => `
                        <div class="link-card">
                            <h2 class="link-title">${qr.title}</h2>
                            <div class="link-url">${qr.qrUrl}</div>
                            <a href="${qr.qrUrl}" target="_blank" class="open-button">
                                Open Content
                            </a>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="no-links">
                    <p>No active links available at the moment.</p>
                </div>
            `}
        </div>
    </body>
    </html>
  `;
};

// Add new QR redirect endpoint
const handleQRRedirect = async (req, res) => {
  try {
    const { qrId } = req.params;
    const chapter = await Chapter.findOne({ qrId });
    
    if (!chapter) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    // Check if the QR content is a stringified JSON array of sub-QRs
    try {
      const subQRs = JSON.parse(chapter.qrUrl);
      if (Array.isArray(subQRs)) {
        // Filter only active sub-QRs
        const activeQRs = subQRs.filter(qr => qr.isActive);
        // Send HTML page instead of JSON
        return res.send(generateMultiQRHtml(activeQRs));
      }
    } catch (e) {
      // If not JSON, treat as regular URL
      if (!chapter.qrUrl) {
        return res.status(404).json({ message: 'No URL set for this QR code' });
      }
      // Redirect to the stored URL
      res.redirect(chapter.qrUrl);
    }
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

// Get chapters by subject
const getChaptersBySubject = async (req, res) => {
  try {
    const { subject } = req.query;
    
    if (!subject) {
      return res.status(400).json({ message: 'Subject ID is required' });
    }

    // Verify subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const chapters = await Chapter.find({ subject })
      .populate('subject', 'name')
      .sort({ createdAt: -1 });
      
    res.json(chapters);
  } catch (error) {
    console.error('Error getting chapters:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const createChapter = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, subjectId } = req.body;

  try {
    // Verify subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5001';
    
    // Create new chapter
    const chapter = new Chapter({
      title,
      description,
      subject: subjectId,
      qrContent: '',
      qrUrl: '',
      subQRs: []
    });

    // Save the chapter
    await chapter.save();

    // Generate and update QR redirect URL
    const redirectUrl = `${baseUrl}/api/chapters/qr/${chapter._id}`;
    chapter.qrContent = redirectUrl;
    chapter.qrUrl = redirectUrl;
    await chapter.save();

    // Get populated chapter data
    const populatedChapter = await Chapter.findById(chapter._id)
      .populate('subject', 'name');

    res.status(201).json(populatedChapter);
  } catch (error) {
    console.error('Error creating chapter:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Create multiple chapters from PDF
const createChaptersFromPDF = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { chapters, subjectId } = req.body;

  try {
    // Verify subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (!Array.isArray(chapters)) {
      return res.status(400).json({ message: 'Chapters must be an array' });
    }

    if (chapters.length === 0) {
      return res.status(400).json({ message: 'No chapters provided' });
    }

    // Validate chapters structure
    for (const chapter of chapters) {
      if (!chapter.title || typeof chapter.title !== 'string') {
        return res.status(400).json({ message: 'Each chapter must have a valid title string' });
      }
      if (!chapter.content || typeof chapter.content !== 'string') {
        return res.status(400).json({ message: 'Each chapter must have valid content string' });
      }
    }

    const createdChapters = [];
    const baseUrl = process.env.BASE_URL || 'http://localhost:5001';

    // Count total chapters to process for better error reporting
    const totalChapters = chapters.length;
    let failedChapters = 0;

    for (const chapterData of chapters) {
      if (!chapterData.title || !chapterData.content) {
        console.warn('Skipping invalid chapter:', chapterData);
        continue;
      }

      try {
        // Create chapter
        const chapter = new Chapter({
          title: chapterData.title,
          description: chapterData.content,
          subject: subjectId,
          qrContent: '',
          qrUrl: '',
          subQRs: []
        });

        // Save chapter
        await chapter.save();

        // Generate QR redirect URL
        const redirectUrl = `${baseUrl}/api/chapters/qr/${chapter._id}`;
        chapter.qrContent = redirectUrl;
        chapter.qrUrl = redirectUrl;
        await chapter.save();

        // Get populated chapter data
        const populatedChapter = await Chapter.findById(chapter._id)
          .populate('subject', 'name');
        
        createdChapters.push(populatedChapter);
      } catch (chapterError) {
        console.error('Error creating individual chapter:', chapterError);
        failedChapters++;
        continue;
      }
    }

    if (createdChapters.length === 0) {
      return res.status(400).json({ 
        message: 'No chapters could be created',
        details: `All ${totalChapters} chapters failed to process.`
      });
    }

    if (failedChapters > 0) {
      // If some chapters failed but others succeeded, return a 207 Multi-Status
      return res.status(207).json({
        message: 'Some chapters were created successfully',
        details: `${createdChapters.length} chapters created, ${failedChapters} failed`,
        chapters: createdChapters
      });
    }

    res.status(201).json({
      message: 'All chapters created successfully',
      chapters: createdChapters
    });
  } catch (error) {
    console.error('Error creating chapters from PDF:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Add a sub QR code to a chapter
const addSubQR = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { chapterId } = req.params;
    const { title, qrUrl } = req.body;
    
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    const subQR = {
      title,
      qrContent: qrUrl,
      qrUrl,
      isActive: true
    };

    chapter.subQRs.push(subQR);
    await chapter.save();

    const populatedChapter = await Chapter.findById(chapterId)
      .populate('subject', 'name');

    res.json(populatedChapter);
  } catch (error) {
    console.error('Error adding sub QR:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Delete a chapter
const deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    await chapter.remove();
    res.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getChapters,
  createChapter,
  handleQRRedirect,
  createChaptersFromPDF,
  getChaptersBySubject,
  addSubQR,
  deleteChapter
};
