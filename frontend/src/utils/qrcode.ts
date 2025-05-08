import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Function to download QR code as an image
export const downloadQRCodeAsImage = (qrCodeElementId: string, fileName: string): void => {
  const qrCodeElement = document.getElementById(qrCodeElementId);
  
  if (!qrCodeElement) {
    console.error('QR Code element not found');
    return;
  }

  html2canvas(qrCodeElement).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

// Function to download QR code as a PDF
export const downloadQRCodeAsPDF = (qrCodeElementId: string, fileName: string, title: string): void => {
  const qrCodeElement = document.getElementById(qrCodeElementId);
  
  if (!qrCodeElement) {
    console.error('QR Code element not found');
    return;
  }

  html2canvas(qrCodeElement).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Add title
    pdf.setFontSize(16);
    pdf.text(title, pageWidth / 2, 20, { align: 'center' });
    
    // Add QR code image
    const imgWidth = 80;
    const imgHeight = 80;
    const x = (pageWidth - imgWidth) / 2;
    pdf.addImage(imgData, 'PNG', x, 40, imgWidth, imgHeight);
    
    // Add URL text below the QR code
    pdf.setFontSize(10);
    pdf.text('Scan to access content', pageWidth / 2, 130, { align: 'center' });
    
    pdf.save(`${fileName}.pdf`);
  });
};