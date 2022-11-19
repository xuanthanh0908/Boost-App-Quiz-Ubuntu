const cloudinary = require('cloudinary')
const config = require('../config/config')

cloudinary.config({
  cloud_name: config.cloudinary.cloudname,
  api_key: config.cloudinary.apikey,
  api_secret: config.cloudinary.apisecret,
})
const uploadfile = (file, folder) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader
      .upload(file, {
        folder: folder,
        use_filename: true,
        height: 1024,
        width: 1024,
      })
      .then((result) => {
        resolve({
          public_id: result.public_id,
          url: result.url,
        })
      })
  })
}

const removefile = (public_id) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader
      .destroy(public_id, {
        resource_type: 'image',
      })
      .then((result) => {
        resolve(result)
      })
  })
}

module.exports = {
  uploadfile,
  removefile,
}
