


// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../config/cloudinary');

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'ums_uploads',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//   },
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     console.log('Multer received file:', file); // Log incoming file
//     if (!file.mimetype.startsWith('image/')) {
//       return cb(new Error('Only image files are allowed'), false);
//     }
//     cb(null, true);
//   },
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });

// module.exports = upload;


// uploads/multer.js
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../config/cloudinary');

// // Test cloudinary connection
// console.log('Cloudinary config:', {
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
//     api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'
// });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'ums_uploads',
//         allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
//         public_id: (req, file) => {
//             // Generate unique filename
//             return `user_${Date.now()}_${Math.round(Math.random() * 1E9)}`;
//         },
//     },
// });

// const upload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         console.log('=== MULTER FILEFILTER ===');
//         console.log('File received:', {
//             fieldname: file.fieldname,
//             originalname: file.originalname,
//             mimetype: file.mimetype,
//             size: file.size
//         });
        
//         if (!file.mimetype.startsWith('image/')) {
//             console.log('File rejected: Not an image');
//             return cb(new Error('Only image files are allowed'), false);
//         }
        
//         console.log('File accepted');
//         cb(null, true);
//     },
//     limits: { 
//         fileSize: 5 * 1024 * 1024, // 5MB limit
//         files: 1 // Only one file
//     },
// });

// module.exports = upload;


const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary"); 
const cloudinary = require("../config/cloudinary"); 


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "React-usermanagement", 
    format: async (req, file) => "jpg",
    transformation: [{ width: 1000, height: 1000, crop: "limit" }], 
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG and PNG are allowed."), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;