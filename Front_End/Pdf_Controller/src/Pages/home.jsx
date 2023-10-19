// import React, { useEffect } from 'react'
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Box from '@mui/material/Box';



// import { useState } from 'react';


// const Home = () => {

//   const[title,setTitle] = useState("")
//   const[file,setFile] = useState("")

//   const submitImage = async (e)=>{
//   e.preventDefault();
//   const formData = new FormData();
//   formData.append("title",title);
//   formData.append("file",file)
//   console.log(file,title)
//   }

// return(
//   <div>

//   <form onSubmit={submitImage}>
//   <input type='text'placeholder='title' 
//   onChange={(e)=>setTitle(e.target.value)}
//   /><br/>
//   <input type='file' accept='application/pdf'
//    onChange={(e)=>setFile(e.target.files[0])}
//   /><br/>
//   <button type='submit'>Submit</button>
  
//   </form>
  
//   </div>

//   )
// }

// export default Home

// import React, { useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Box from '@mui/material/Box';
// import { useMemo } from 'react';

// const Home = () => {
//   const [title, setTitle] = useState('');
//   const [file, setFile] = useState(null);
//   const [numPages, setNumPages] = useState(null);
//   const [selectedPages, setSelectedPages] = useState([]);

//   const onFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);
//     setSelectedPages([]); // Reset selected pages when a new file is selected
//   };

//   const handlePageCheck = (page) => {
//     if (selectedPages.includes(page)) {
//       setSelectedPages(selectedPages.filter((p) => p !== page));
//     } else {
//       setSelectedPages([...selectedPages, page]);
//     }
//   };

//   const submitImage = (e) => {
//     e.preventDefault();
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


//   const pageNumbers = useMemo(() => {
//     return new Array(numPages).fill(null).map(( index) => index + 1);
//   }, [numPages]);

//   return (
//      <div>
//       <form onSubmit={submitImage}>
//         <TextField
//           type="text"
//           placeholder="title"
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <br />
//         <input
//           type="file"
//           accept="application/pdf"
//           onChange={onFileChange}
//         />
//         <br />
//         <Button type="submit" onClick={submitImage}>
//           Submit
//         </Button>
//       </form>

//       {file && (
//         <div>
//           <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
//             {pageNumbers.map((pageNumber) => (
//               <div key={`page-${pageNumber}`}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={selectedPages.includes(pageNumber)}
//                     onChange={() => handlePageCheck(pageNumber)}
//                   />
//                   Page {pageNumber}
//                 </label>
//                 <Page pageNumber={pageNumber} />
//               </div>
//             ))}
//           </Document>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const Home = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setSelectedPages([]); // Reset selected pages when a new file is selected

    // Calculate the number of pages here
    const loadingTask = pdfjs.getDocument(URL.createObjectURL(selectedFile));
    loadingTask.promise.then((pdf) => {
      setNumPages(pdf.numPages);
    });
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePageCheck = (page) => {
    if (selectedPages.includes(page)) {
      setSelectedPages(selectedPages.filter((p) => p !== page));
    } else {
      setSelectedPages([...selectedPages, page]);
    }
  };

  const submitImage = async (e) => {
    e.preventDefault();

    let selectedPageNumbers = selectedPages.slice();

    if (selectedPageNumbers.length === 0) {
      selectedPageNumbers = Array.from({ length: numPages }, (_, index) => index + 1);
    }
    
    try {
      // Generate a new PDF document containing the selected pages
      const pdfDoc = await pdfjs.getDocument(URL.createObjectURL(file)).promise;
      console.log("pdfDoc",pdfDoc);
      const newPdf = await pdfjs.getDocument({ data: pdfDoc.data });
      newPdf.numPages = selectedPageNumbers.length;

      console.log('Selected Pages:', selectedPageNumbers);
      // console.log('PDF Document:', pdfDoc);

      const blob = await newPdf.output();
      const formData = new FormData();
      formData.append('file', new Blob([blob], { type: 'application/pdf' }), 'new_document.pdf');
      console.log(formData);

      // Send the blob to the backend
      const response = await fetch('/api/save-pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Handle success, e.g., show a success message or redirect
        alert('PDF file saved successfully.');
      } else {
        // Handle the error
        alert('Failed to save the PDF file.');
      }
    } catch (error) {
      // Handle any errors
      console.error('Error:', error);
      alert('An error occurred while processing the PDF.');
    }
  };
console.log(selectedPages);
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  return (
    <div>
      <form onSubmit={submitImage}>
        <TextField
          type="text"
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
        />
        <br />
        <Button type="submit" onClick={submitImage}>
          Submit
        </Button>
      </form>

      {file && numPages && (
        <div>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from({ length: numPages }).map((_, index) => (
              <div key={`page-${index}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(index + 1)}
                    onChange={() => handlePageCheck(index + 1)}
                  />
                  Page {index + 1}
                </label>
                <Page pageNumber={index + 1} renderTextLayer={false} renderAnnotationLayer={false}/>
              </div>
            ))}
          </Document>
        </div>
      )}

      {selectedPages.map((item)=>{
        <div>

        {item.length}
        <h2>hujy</h2>
        </div>
      })}
     
    </div>
  );
};

export default Home;
