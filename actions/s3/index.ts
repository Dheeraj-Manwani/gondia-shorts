"use server";

import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";

AWS.config.update({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

export const storeFileInS3 = async (
  file: File | undefined
): Promise<string | undefined> => {
  if (!file) return;

  const fileKey = uuid() + "_" + file.name;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
    Body: buffer,
    ContentType: file.type,
  };

  try {
    await s3.upload(params).promise();
    return fileKey;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return undefined;
  }
};

export const deleteFileFromS3 = async (fileKey: string) => {
  // // Set AWS region and credentials
  // AWS.config.update({
  //   region: "ap-south-1",
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // });

  // // Create an S3 instance
  // const s3 = new AWS.S3();

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
