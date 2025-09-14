/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Decide resource type
function getResourceType(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (["zip", "pdf"].includes(ext || "")) return "raw"; // zip/pdf must be raw
  return "auto"; // images/videos
}

// Upload to Cloudinary
export async function uploadToCloudinary(
  file: Buffer,
  filename: string,
  folder: string = "products/files"
) {
  const resource_type = getResourceType(filename);

  return new Promise<{ url: string; public_id: string; format: string }>(
    (resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type,         // important for zip/pdf
          folder,
          public_id: filename.replace(/\s+/g, "_"),
          use_filename: true,
          unique_filename: false,
          overwrite: true,
          type: "upload",        // ✅ forces it to be PUBLIC
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Upload failed with no result"));
          }

          resolve({
            url: result.secure_url, // public https link
            public_id: result.public_id,
            format: result.format,
          });
        }
      ).end(file);
    }
  );
}
