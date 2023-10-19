// import React from 'react'
// import { useState } from "react";
// import { PDFDocument } from "pdf-lib";



// const CopyHome = () => {

//     const [pdfFileData, setPdfFileData] = useState();

//     function readFileAsync(file) {
//       return new Promise((resolve, reject) => {
//         let reader = new FileReader();
//         reader.onload = () => {
//           resolve(reader.result);
//         };
//         reader.onerror = reject;
//         reader.readAsArrayBuffer(file);
//       });
//     }
  
//     function renderPdf(uint8array) {
//       const tempblob = new Blob([uint8array], {
//         type: "application/pdf",
//       });
//       const docUrl = URL.createObjectURL(tempblob);
//       setPdfFileData(docUrl);
//     }
  
//     function range(start, end) {
//       let length = end - start + 1;
//       return Array.from({ length }, (_, i) => start + i - 1);
//     }
  
//     async function extractPdfPage(arrayBuff) {
//       const pdfSrcDoc = await PDFDocument.load(arrayBuff);
//       const pdfNewDoc = await PDFDocument.create();
//       const pages = await pdfNewDoc.copyPages(pdfSrcDoc, range(2, 3));
//       pages.forEach((page) => pdfNewDoc.addPage(page));
//       const newpdf = await pdfNewDoc.save();
//       return newpdf;
//     }
  
//     // Execute when user select a file
//     const onFileSelected = async (e) => {
//       const fileList = e.target.files;
//       if (fileList?.length > 0) {
//         const pdfArrayBuffer = await readFileAsync(fileList[0]);
//         const newPdfDoc = await extractPdfPage(pdfArrayBuffer);
//         renderPdf(newPdfDoc);
//       }
//     };

//   return (
//     <div>
    
//     <input
//         type="file"
//         id="file-selector"
//         accept=".pdf"
//         onChange={onFileSelected}
//       />
//       <iframe
//         style={{ display: "block", width: "100vw", height: "90vh" }}
//         title="PdfFrame"
//         src={pdfFileData}
//         frameborder="0"
//         type="application/pdf"
//       ></iframe>
//     </div>
//   )
// }

// export default CopyHome

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

const CopyHome = () => {
  const [pdfFileData, setPdfFileData] = useState();
  const [selectedPages, setSelectedPages] = useState([]);
  const [newPdfData, setNewPdfData] = useState(null);

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  async function renderPdf(uint8array) {
    const tempBlob = new Blob([uint8array], {
      type: "application/pdf",
    });
    const docUrl = URL.createObjectURL(tempBlob);
    setPdfFileData(docUrl);
  }

  function range(start, end) {
    let length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i - 1);
  }

  async function extractPdfPage(arrayBuff, selectedPages) {
    const pdfSrcDoc = await PDFDocument.load(arrayBuff);
    const pdfNewDoc = await PDFDocument.create();
    for (const pageNum of selectedPages) {
      const pages = await pdfNewDoc.copyPages(pdfSrcDoc, [pageNum - 1]);
      pages.forEach((page) => pdfNewDoc.addPage(page));
    }
    const newPdf = await pdfNewDoc.save();
    return newPdf;
  }

  const onFileSelected = async (e) => {
    const fileList = e.target.files;
    if (fileList?.length > 0) {
      const pdfArrayBuffer = await readFileAsync(fileList[0]);
      renderPdf(pdfArrayBuffer);
    }
  };

  const onSaveButtonClick = async () => {
    if (selectedPages.length > 0) {
      const pdfArrayBuffer = await readFileAsync(selectedPages[0].originalFile);
      const newPdfData = await extractPdfPage(pdfArrayBuffer, selectedPages.map((page) => page.pageNumber));
      const newPdfBlob = new Blob([newPdfData], { type: "application/pdf" });
      setNewPdfData(URL.createObjectURL(newPdfBlob));
    }
  };

  return (
    <div>
      <input
        type="file"
        id="file-selector"
        accept=".pdf"
        onChange={onFileSelected}
      />
      <iframe
        style={{ display: "block", width: "100vw", height: "90vh" }}
        title="PdfFrame"
        src={pdfFileData}
        frameBorder="0"
        type="application/pdf"
      ></iframe>
      <div>
        <h3>Select Pages:</h3>
        <label>
          Page 1
          <input
            type="checkbox"
            onChange={(e) =>
              handlePageSelection(e, { pageNumber: 1, originalFile: e.target.files[0] })
            }
          />
        </label>
        <label>
          Page 2
          <input
            type="checkbox"
            onChange={(e) =>
              handlePageSelection(e, { pageNumber: 2, originalFile: e.target.files[0] })
            }
          />
        </label>
      </div>
      <button onClick={onSaveButtonClick}>Save Selected Pages</button>
      {newPdfData && (
        <a href={newPdfData} download="selected_pages.pdf">
          Download Selected Pages
        </a>
      )}
    </div>
  );
};

export default CopyHome;
