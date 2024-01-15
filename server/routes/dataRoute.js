const router = require("express").Router();
const Data = require("../models/dataModel");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddlewares");
const mongoose = require("mongoose");
const multer = require('multer');
const cloudinary = require("cloudinary").v2;

// Configure multer for handling file uploads to memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Configure cloudinary for handling cloud-based image storage
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


// Function to handle the upload of images to cloudinary
async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });
    return res;
}


// Route to handle image upload with authentication middleware
router.post("/upload", upload.single("image"), authMiddleware, async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);

        req.body.image = cldRes.secure_url;
        console.log(req.body);
        const data = new Data(req.body);
        await data.save();

        return res.send({
            success: true,
            message: "Data Added Successfully",
        })

    }
    catch (error) {
        return res.send({ success: false, message: error.message });
    }
});


// Route to fetch data with authentication middleware
router.get("/fetch", authMiddleware, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.body.userId);
        const data = await Data.find({ userId: userId });
        const user = await User.findOne({ _id: userId });
        if (data) {
            res.send({
                success: true,
                data: data,
                user: user,
            })
        }
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
})

// Route to update data view count with authentication middleware
router.post("/update/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const existingDocument = await Data.findOne({ _id: id });
        existingDocument.viewCount = existingDocument.viewCount + 1;
        await existingDocument.save();
        console.log(req.body);
        res.send({
            success: true,
            data: existingDocument,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
})

module.exports = router;
