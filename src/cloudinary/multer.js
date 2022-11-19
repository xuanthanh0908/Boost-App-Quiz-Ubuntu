const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const filterfile = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true)
  } else {
    // reject file
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: filterfile,
  limits: { fileSize: 1024 * 1024 },
})

module.exports = upload
