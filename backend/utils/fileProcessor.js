const pdfParse = require('pdf-parse');
const ExcelJS = require('exceljs');

const extractChaptersFromPDF = async (fileContent) => {
  try {
    console.log('Starting PDF parsing...');
    // Load and parse the PDF document
    const data = await pdfParse(fileContent);
    console.log('PDF parsed successfully');
    const contentText = data.text;
    console.log('Extracted text length:', contentText.length);

    // Regular expressions to identify chapter patterns
    const chapterPatterns = [
      /Chapter\s+(\d+|[IVXLC]+)[:\s]+([^\n]+)/gi,  // Chapter 1: Title or Chapter I: Title
      /(\d+|[IVXLC]+)\.\s+([^\n]+)/g,              // 1. Title or I. Title
      /Unit\s+(\d+|[IVXLC]+)[:\s]+([^\n]+)/gi,     // Unit 1: Title or Unit I: Title
    ];

    const chapters = [];
    let matches;

    // Try each pattern until we find chapters
    for (const pattern of chapterPatterns) {
      while ((matches = pattern.exec(contentText)) !== null) {
        chapters.push({
          title: matches[0].trim(),
          content: `Chapter content will be extracted later from page ${matches.index}`
        });
      }
      if (chapters.length > 0) break;
    }

    return chapters;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error('Failed to process PDF file');
  }
};

const extractChaptersFromExcel = async (fileContent) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileContent);

    const chapters = [];
    const worksheet = workbook.getWorksheet(1); // Get first worksheet

    // Assume first row is headers
    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex > 1) { // Skip header row
        const title = row.getCell(1).value;
        const content = row.getCell(2).value;
        
        if (title) {
          chapters.push({
            title: title.toString(),
            content: content ? content.toString() : ''
          });
        }
      }
    });

    return chapters;
  } catch (error) {
    console.error('Error processing Excel:', error);
    throw new Error('Failed to process Excel file');
  }
};

module.exports = {
  extractChaptersFromPDF,
  extractChaptersFromExcel
};
