import multer from "multer";

// TODO: 
    // Configure storage, file filter, limits as needed
    // File validation can be added here
    
const storage = multer.memoryStorage();

const upload = multer({ storage });

// For multiple files upload (e.g., product images)
export const uploadMultipleFiles = upload.array("files", 10);

// For single file upload (e.g., profile picture)
export const uploadSingleFile = upload.single("profile");