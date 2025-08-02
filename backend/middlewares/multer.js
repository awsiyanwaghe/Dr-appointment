import multer from "multer"
import fs from "fs"

const uploadDir = './uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname
    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true)
  else cb(new Error("Only image files are allowed"), false)
}

const upload = multer({ storage, fileFilter })

export default upload
