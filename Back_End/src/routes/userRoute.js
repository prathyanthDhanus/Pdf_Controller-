const express = require("express");
const user = require("../controller/userController");
const tryatch = require ("../middleware/tryCatch");
const upload = require("../middleware/multer");

const router = express.Router();


router.post("/upload/pdf",upload.single("file"),tryatch(user.uploadPdf));

router.get("/getfile/pdf",tryatch(user.getPdf));
router.get("/getfile/pdf/:id",tryatch(user.getPdfbyId))

module.exports = router