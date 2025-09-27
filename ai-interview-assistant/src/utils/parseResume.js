// Install pdfjs-dist and mammoth for parsing (npm install pdfjs-dist mammoth)
import * as pdfjsLib from 'pdfjs-dist/webpack';

export async function parsePDF(file) {
  let name = '', email = '', phone = '';
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async (event) => {
      const typedarray = new Uint8Array(event.target.result);
      try {
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let textContent = '';
        for (let page = 1; page <= pdf.numPages; page++) {
          const pageObj = await pdf.getPage(page);
          const content = await pageObj.getTextContent();
          textContent += content.items.map(i => i.str).join(' ');
        }
        // RegEx for extraction
        name = (textContent.match(/([A-Z][a-z]+ [A-Z][a-z]+)/) || [])[1] || '';
        email = (textContent.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/i) || [])[0] || '';
        phone = (textContent.match(/(\d{10,})/) || [])[1] || '';
        resolve({ name, email, phone });
      } catch (e) { reject(e); }
    };
    reader.readAsArrayBuffer(file);
  });
}

// DOCX: See mammoth (npm install mammoth)
import mammoth from 'mammoth';
export async function parseDOCX(file) {
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  let name = '', email = '', phone = '';
  name = (value.match(/([A-Z][a-z]+ [A-Z][a-z]+)/) || [])[1] || '';
  email = (value.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/i) || [])[0] || '';
  phone = (value.match(/(\d{10,})/) || [])[1] || '';
  return { name, email, phone };
}
