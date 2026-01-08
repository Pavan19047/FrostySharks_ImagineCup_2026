const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

function buildPdf(draft) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(18).text(draft.subject || 'Legal Document', { underline: true });
      doc.moveDown();
      doc.fontSize(12).text(`To: ${draft.to || 'Concerned Authority'}`);
      doc.moveDown();
      doc.text(draft.body || 'Details pending.');
      doc.moveDown();
      doc.text(`Relief requested: ${draft.reliefRequested || 'Not specified'}`);
      doc.moveDown();
      doc.text(`Sender: ${draft.senderDetails || 'Anonymous / Not provided'}`);
      if (draft.checklist?.length) {
        doc.moveDown();
        doc.text('Checklist:', { underline: true });
        draft.checklist.forEach((item) => doc.text(`- ${item}`));
      }
      doc.moveDown();
      doc.fontSize(10).fillColor('gray').text('Disclaimer: This is guidance, not legal advice. Please verify with a lawyer.');

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

async function buildDocx(draft) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ text: draft.subject || 'Legal Document', heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: `To: ${draft.to || 'Concerned Authority'}` }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: draft.body || 'Details pending.' }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: `Relief requested: ${draft.reliefRequested || 'Not specified'}` }),
          new Paragraph({ text: `Sender: ${draft.senderDetails || 'Anonymous / Not provided'}` }),
          ...(draft.checklist?.length
            ? [
                new Paragraph({ text: 'Checklist:' }),
                ...draft.checklist.map((item) => new Paragraph({ text: `- ${item}` }))
              ]
            : []),
          new Paragraph({
            children: [
              new TextRun({ text: 'Disclaimer: This is guidance, not legal advice. Please verify with a lawyer.', italics: true, size: 20, color: '808080' })
            ]
          })
        ]
      }
    ]
  });

  return Packer.toBuffer(doc);
}

async function generateDocuments(draft) {
  const [pdfBuffer, docBuffer] = await Promise.all([buildPdf(draft), buildDocx(draft)]);
  return { pdfBuffer, docBuffer };
}

module.exports = {
  generateDocuments
};
