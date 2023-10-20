const mongoose = require("mongoose");


const pdfSchema = new mongoose.Schema({
    pdf:String,

})

const pdf = mongoose.model("pdf", pdfSchema)
module.exports = pdf