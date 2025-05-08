const Chapter = require('../models/Chapter');
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

const createChapter = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, subjectId } = req.body;

  try {
    // Create chapter with QR redirect URL and empty subQRs array
    const chapter = await Chapter.create({
      title,
      description,
      subject: subjectId,
      qrContent: '', // Will be set to the redirect URL
      qrUrl: '',    // URL can be updated later
      subQRs: []    // Initialize empty sub-QRs array
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
    // Check if the URL is a stringified array of sub-QRs
    let updatedUrl = qrUrl;
    try {
      const subQRs = JSON.parse(qrUrl);
      if (Array.isArray(subQRs)) {
        // Validate each sub-QR object
        const validSubQRs = subQRs.every(qr => 
          qr.title && qr.qrContent && typeof qr.isActive === 'boolean'
        );
        if (!validSubQRs) {
          return res.status(400).json({ message: 'Invalid sub-QR format' });
        }
      }
    } catch (e) {
      // If not JSON, treat as regular URL
    }

    const chapter = await Chapter.findByIdAndUpdate(
      chapterId,
      { qrUrl: updatedUrl },
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

// Handle bulk chapter creation from PDF
const createChaptersFromPDF = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { chapters, subjectId } = req.body;

  try {
    const createdChapters = [];
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    for (const chapterData of chapters) {
      const chapter = await Chapter.create({
        title: chapterData.title,
        description: chapterData.content,
        subject: subjectId,
        qrContent: '',
        qrUrl: '',
        subQRs: []
      });

      const redirectUrl = `${baseUrl}/api/chapters/qr/${chapter.qrId}`;
      await Chapter.findByIdAndUpdate(
        chapter._id,
        { qrContent: redirectUrl }
      );

      const populatedChapter = await Chapter.findById(chapter._id)
        .populate('subject', 'name');
      
      createdChapters.push(populatedChapter);
    }

    res.status(201).json(createdChapters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getChapters,
  createChapter,
  updateChapterUrl,
  handleQRRedirect,
  createChaptersFromPDF
};
