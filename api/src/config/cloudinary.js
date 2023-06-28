const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const { CLOUD_NAME, CLOUD_KEY, API_SECRET } = process.env;

cloudinary.config({ 
    cloud_name: CLOUD_NAME, 
    api_key: CLOUD_KEY, 
    api_secret: API_SECRET
  });

const uploadImage = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'pi_food'
  })
}

module.exports = uploadImage