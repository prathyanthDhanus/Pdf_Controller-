import  { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import Button from '@mui/material/Button';
import { PDFDocument } from 'pdf-lib';
import axios from "axios";
import Grid from "@mui/material/Grid";
import "../Pages/homeStyle.css"
import { useNavigate } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Home = () => {
  //---------------------------hooks-------------------------------

  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const navigate = useNavigate();

  //---------------------------pdf selection--------------------

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);

    } else {
      alert("Please select a valid PDF file.");
    }
  };

  //------------------------page extraction when pdf selection-----------

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
      }else{
        const formData = new FormData()
        formData.append("file", file)
      

        const response = await axios.post("http://localhost:3000/upload/pdf",formData,{
            headers:{"Content-Type":"multipart/form-data"},
        })
        if (response.data.status === "success") {
          alert(response.data.message);
      }
      }
     
    } catch (error) {
      console.log('Error:', error);
    }
  };

  let buttonText = selectedPages.length > 0 ? "Generate New PDF" : "Upload";

  return (

    <div className="home-div">
    <Grid container spacing={2} justifyContent="center">
    <Grid item xs={12} sm={6}>
      <div >
        <h1>File Upload</h1>
        <br />
        <input type="file" accept=".pdf" onChange={handleChange} />
        <br />
        <br />

        <div >
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

        <Button variant="contained" color="success" onClick={newlyCreatedPdf}>
          {buttonText}
        </Button>
        <Button  onClick={()=>navigate("/view")}>View Pdf Collection</Button>
      </div>
    </Grid>
  </Grid>
  </div>
  );
};

export default Home;