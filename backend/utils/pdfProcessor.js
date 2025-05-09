const fs = require('fs');
const pdf = require('pdf-parse');

const extractTableOfContents = async (buffer) => {
  try {
    const data = await pdf(buffer);
    const text = data.text;
    
    // Common patterns for chapter headings
    const patterns = [
      /(?:Chapter|CHAPTER)\s+(\d+|[IVX]+)[:\s-]*([^\n]+)/gi,
      /(?:Unit|UNIT)\s+(\d+|[IVX]+)[:\s-]*([^\n]+)/gi,
      /^\s*(\d+|[IVX]+)\.\s*([^\n]+)/gim
    ];

    let chapters = [];
    let subjectName = '';

    // Try to extract subject name from first few lines
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      subjectName = lines[0].trim();
    }

    // Find all chapter matches
    let foundChapters = new Set();
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const chapterNum = match[1];
        const title = match[2].trim();
        const uniqueKey = `${chapterNum}-${title}`;
        
        if (!foundChapters.has(uniqueKey)) {
          foundChapters.add(uniqueKey);
          chapters.push({
            chapterNumber: chapterNum,
            title: title,
            startPage: findPageNumber(text, match.index) || chapters.length + 1
          });
        }
      }

      if (chapters.length > 0) break; // Stop if we found chapters with current pattern
    }

    // Sort chapters by their numbers
    chapters.sort((a, b) => {
      const aNum = parseInt(a.chapterNumber) || 0;
      const bNum = parseInt(b.chapterNumber) || 0;
      return aNum - bNum;
    });

    return {
      subjectName,
      chapters,
      totalPages: data.numpages
    };
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error('Failed to process PDF file');
  }
};

const findPageNumber = (text, index) => {
  const textBefore = text.substring(0, index);
  const pages = textBefore.split(/\f/); // Form feed character indicates page breaks
  return pages.length;
};

const processPDFFile = async (file) => {
  try {
    const buffer = fs.readFileSync(file.path);
    const result = await extractTableOfContents(buffer);
    
    // Clean up the temporary file
    fs.unlinkSync(file.path);
    
    return result;
  } catch (error) {
    console.error('Error processing PDF file:', error);
    // Clean up on error
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};

module.exports = { processPDFFile };