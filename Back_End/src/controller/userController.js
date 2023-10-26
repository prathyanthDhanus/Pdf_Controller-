const pdf = require("../model/pdfSchema")

//---------------------------upload pdf file------------------------

const uploadPdf = async (req, res) => {
    // console.log(req.file);
    const fileName = req.file.filename;
    const pdfData = await pdf.create({ pdf: fileName })

    res.json({

        status: "success",

        message: "pdf saved successfully",

        data: pdfData
    })

}


//-------------------------------get pdf file----------------------

const getPdf = async(req,res)=>{
 const findPdf = await pdf.find()
//  console.log(findPdf);
 res.json({

    status: "success",

    message: "file retrived successfully ",

    data: findPdf
})
}

//----------------------------------get pdf by id------------------------

const getPdfbyId = async(req,res)=>{
    const id = req.params.id
    console.log(id)
    const findPdf = await pdf.findById({_id:id})
    res.json({

        status: "success",
    
        message: "file retrived successfully ",
    
        data: findPdf
    })

}


module.exports = { uploadPdf ,getPdf,getPdfbyId}