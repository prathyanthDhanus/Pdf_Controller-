import  { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import Button from '@mui/material/Button';
import { PDFDocument } from 'pdf-lib';
import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Home = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);

  const handleCahnge = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      console.log("Please select a valid PDF file.");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const pageSelection = (pageNumber) => {
    if (selectedPages.includes(pageNumber)) {
      setSelectedPages(selectedPages.filter((page) => page !== pageNumber));
    } else {
      setSelectedPages([...selectedPages, pageNumber]);
    }
  };
  const newlyCreatedPdf = async (e) => {
    e.preventDefault();
    try {
      if (file && selectedPages.length > 0) {
        const reader = new FileReader();
        reader.onload = async function () {
          const pdfBytes = new Uint8Array(reader.result);
  
          const pdfDoc = await PDFDocument.load(pdfBytes);
          const newPdfDoc = await PDFDocument.create();
  
          for (const pageNumber of selectedPages) {
            const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
            newPdfDoc.addPage(copiedPage);
          }
  
          const newPdfBytes = await newPdfDoc.save();
          const formData = new FormData();
          formData.append('file', new Blob([newPdfBytes], { type: 'application/pdf' }));
  
          const response = await axios.post('http://localhost:3000/upload/pdf', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
  
          if (response.data.status === 'success') {
            alert(response.data.message);
          }
          console.log(response.data);
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };


  return (
    <div className="input-div">
      <h3>File Upload</h3>
      <br />
      <input type="file" accept=".pdf" onChange={handleCahnge} />
      <br />
      <br />

      <div id="pdf-container">
        {file && (
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(index + 1)}
                    onChange={() => pageSelection(index + 1)}
                  />
                  Page {index + 1}
                </label>
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            ))}
          </Document>
        )}
      </div>

      <Button variant="primary">Upload</Button>
      <Button variant="primary" onClick={newlyCreatedPdf}>
        Generate New PDF
      </Button>
    </div>
  );
};

export default Home;