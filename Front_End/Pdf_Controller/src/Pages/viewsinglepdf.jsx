  import React, { useState } from "react";
  import { PDFDocument } from "pdf-lib";
  import { useParams } from "react-router-dom";
  import { useEffect } from "react";
  import axios from "axios";
  import { Document, Page, pdfjs } from "react-pdf";
  import { Button } from "@mui/material";


  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const ViewSinglePdf = () => {
    const[file,setFile] =  useState(null);
    const {id }= useParams()
    const [numPages, setNumPages] = useState(null);
    const [selectedPages, setSelectedPages] = useState([]);
    // console.log(id);

    useEffect(() => {
      const getPdfFile = async () => {
        const response = await axios.get(`http://localhost:3000/getfile/pdf/${id}`);
        const data = response.data.data
        console.log(data);
      setFile(data)
      };
      getPdfFile();
    }, [id]);
    
    console.log( "file",file);


  


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
            console.log(response);
            alert(response.data.message);
          }
          console.log(response.data);
        };
        reader.readAsArrayBuffer(file);
      }else{
        const formData = new FormData()
        formData.append("file", file)
        // console.log(file);

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


  return(

    <div>
    <div >
    <h1>File Upload</h1>
    <br />
    
    <br />
    <br />

    <div >
      {file && (
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), ( index) => (
            <div key={`page_${index + 1}`}>
              <label>
                <input
                  type="checkbox"
                  
                  checked={selectedPages.includes(index)}
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
      upload
    </Button>
    </div>


    </div>
  
      
    );
  };

  export default ViewSinglePdf;
