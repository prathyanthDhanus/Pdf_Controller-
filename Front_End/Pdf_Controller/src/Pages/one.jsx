import React, { useEffect, useState } from 'react'
import axios from "axios"

const One = () => {

    const [file, setFile] = useState("");
    const [pdf,setpdf] = useState([])

    const submitFile = async (e) => {
        e.preventDefault()
       
        const formData = new FormData()
        formData.append("file", file)
        // console.log(file);

        const response = await axios.post("http://localhost:3000/upload/pdf",formData,{
            headers:{"Content-Type":"multipart/form-data"},
        })
        if (response.data.status === "success") {
            alert(response.data.message);
        }
        console.log(response.data)
    }


    //--------------------------grt pdf --------------------------

    useEffect(()=>{
        const getPdfFile = async ()=>{
            const response = await axios.get("http://localhost:3000/getfile/pdf");
            const data = response.data.data
            console.log(data);
            setpdf(data)
        }
        getPdfFile()
    },[])

  
const showPdf = (pdf)=>{
    window.open(`http://localhost:3000/uploads/${pdf}`,"_blank","noreferrer")
}

    return (

        <div>

            <form onSubmit={submitFile}>

                <input type='file' accept='application/pdf' required onChange={(e) => setFile(e.target.files[0])} />
                <button type='submit'>Submit</button>

            </form>

            <div>
            {pdf==null?"":pdf.map((item)=>{
               return(
                <div>
                {item.pdf}
                
                <button onClick={()=>showPdf(item.pdf)}>Show pdf</button>
                </div>
               )
            })}
            
            </div>
        </div>
    )
}

export default One