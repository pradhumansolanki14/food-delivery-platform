import cloudinary from '../config/cloudinary.js';

/**
 * Checks if Cloudinary credentials are fully configured and not placeholder values
 * @returns {boolean}
 */
export const isConfigured = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return false;
  if (cloudName.includes("placeholder") || cloudName.includes("your_")) return false;
  if (apiKey.includes("placeholder") || apiKey.includes("your_")) return false;
  if (apiSecret.includes("placeholder") || apiSecret.includes("your_")) return false;

  return true;
};

/**
 * Uploads a file buffer to Cloudinary and returns the secure URL
 * @param {Buffer} fileBuffer 
 * @param {string} folder 
 * @returns {Promise<string>}
 */
export const uploadToCloudinary = (fileBuffer, folder) => {
  if (!isConfigured()) {
    return Promise.reject(new Error("Cloudinary credentials are not configured. Please add valid keys in your backend .env file."));
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Extracts public ID from a Cloudinary secure URL
 * @param {string} url 
 * @returns {string|null}
 */
export const extractPublicId = (url) => {
  if (!url) return null;
  // Match the standard cloud image upload path
  if (!url.includes('/image/upload/')) return null;
  
  try {
    const parts = url.split('/image/upload/');
    if (parts.length < 2) return null;
    
    // Remove the version segment (e.g. v12345678/) if it exists
    let publicIdWithExtension = parts[1];
    if (publicIdWithExtension.match(/^v\d+\//)) {
      const slashIndex = publicIdWithExtension.indexOf('/');
      if (slashIndex !== -1) {
        publicIdWithExtension = publicIdWithExtension.substring(slashIndex + 1);
      }
    }
    
    // Remove the file extension
    const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return publicIdWithExtension.substring(0, lastDotIndex);
    }
    return publicIdWithExtension;
  } catch (err) {
    console.error("Failed to extract public ID from Cloudinary URL:", err);
    return null;
  }
};

/**
 * Deletes an image from Cloudinary by its secure URL
 * @param {string} url 
 * @returns {Promise<any>}
 */
export const deleteFromCloudinary = async (url) => {
  if (!url) return null;
  const publicId = extractPublicId(url);
  if (!publicId) return null;

  if (!isConfigured()) {
    console.warn("[Cloudinary] Credentials not configured or using placeholders. Skipping image deletion for:", publicId);
    return null;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
    throw error;
  }
};
