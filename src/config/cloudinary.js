const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const { CLOUD_NAME, CLOUD_KEY, API_SECRET } = process.env;

cloudinary.config({ 
    cloud_name: CLOUD_NAME, 
    api_key: CLOUD_KEY, 
    api_secret: API_SECRET
  });

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'pi_food'
    });
    return result;
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error);
    throw error;
  }
}

module.exports = uploadImage