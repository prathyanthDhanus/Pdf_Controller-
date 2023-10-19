const express = require("express");
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const port = 3000
// const port = 27017
require('dotenv').config();

const url = process.env.MONGODB_URL


app.use(express.json());

app.use(cors());

//----------------------admin route------------------------

// const adminRoutes = require("./src/routes/adminRoutes")
// app.use("/",adminRoutes);

//-------------------student route-------------------------

// const studentRoutes = require("./src/routes/studentRoutes")
// app.use("/",studentRoutes)



// //mongodb connection setup
mongoose.connect(url)
    .then(() => console.log("mongodb atlas connected"))
    .catch((e) => console.log("error found", e))

app.listen(port, () => {
    console.log(`port is starting on ${port}`)
})

