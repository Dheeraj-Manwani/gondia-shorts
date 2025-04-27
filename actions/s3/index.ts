import AWS from "aws-sdk";
import { File } from "node:buffer";
import { v4 as uuid } from "uuid";

export const storeFileInS3 = async (
  file: File | undefined
): Promise<string | undefined> => {
  if (!file) return;
  const fileKey = uuid();
  // Set the region and access keys
  AWS.config.update({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  // Create a new instance of the S3 class
  const s3 = new AWS.S3();
  // Set the parameters for the file you want to upload
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey + file.name,
    Body: file,
    // ContentType: "image/jpeg", // Adjust based on the image type
  };
  // Upload the file to S3
  s3.upload(params, (err: Error) => {
    if (err) {
      console.log("Error uploading file:", err);
    }
  });

  return fileKey;
};

export const deleteFileFromS3 = async (fileKey: string) => {
  // Set AWS region and credentials
  AWS.config.update({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  // Create an S3 instance
  const s3 = new AWS.S3();

  // Set delete parameters
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey + ".jpeg", // Ensure you pass the correct file key
  };

  try {
    await s3.deleteObject(params).promise();
    console.log(`File ${fileKey}.jpeg deleted successfully`);
  } catch (err) {
    console.error("Error deleting file:", err);
  }
};
