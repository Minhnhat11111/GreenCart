import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Tạo thư mục uploads nếu chưa có
const uploadsDir = 'uploads'
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

export default upload
