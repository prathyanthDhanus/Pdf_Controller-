import React, { useEffect, useState } from 'react'
import axios from "axios"
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {useNavigate} from "react-router-dom"
import Grid from '@mui/material/Grid';

const View = () => {

    const [pdf,setpdf] = useState([])
    const navigate = useNavigate()
      

    //--------------------------get pdf--------------------------

    useEffect(()=>{
        const getPdfFile = async ()=>{
            const response = await axios.get("http://localhost:3000/getfile/pdf");
            const data = response.data.data
            // console.log(data);
            setpdf(data)
        }
        getPdfFile()
    },[])

const showPdf = (pdf)=>{
    window.open(`http://localhost:3000/uploads/${pdf}`,"_blank","noreferrer")
}

    return (

        <div>
        <Grid container spacing={2}>
        {pdf.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia component="img" alt="pdf image" height="200" image="/src/image/pdfimage2.png" />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.pdf}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => showPdf(item.pdf)}>Show pdf</Button>
                <Button size="small" onClick={() => navigate(`/view/single/pdf/${item._id}`)}>Extract New Pdf</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
        </div>
    )
}

export default View