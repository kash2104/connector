import {
  CreateMultipartUploadCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  credentials: {
    accessKeyId: accessKey ?? "",
    secretAccessKey: secretAccessKey ?? "",
  },
  region: bucketRegion,
});
export default s3Client;

export async function uploadVideoS3(video: any, title: string) {
  const bytes = await video.arrayBuffer();
  const buffer = Buffer.from(bytes);
  // console.log("video", buffer);
  // console.log("title", title);

  const params = {
    Bucket: bucketName,
    Key: title,
    Body: buffer,
    ContentType: video.type,
  };

  const command = new PutObjectCommand(params);

  const result = await s3Client.send(command);

  return result;
}

export async function startMultipart(video: any, title: string) {
  const params = {
    Bucket: bucketName,
    Key: title,
  };

  const command = new CreateMultipartUploadCommand(params);
  const mutlipart = await s3Client.send(command);

  return mutlipart;
}

export async function generateMultiPartPreSignedUrl(
  title: string,
  uploadId: string,
  totalParts: number
) {
  const urls = [];

  for (let i = 1; i <= totalParts; i++) {
    const command = new UploadPartCommand({
      Bucket: bucketName,
      Key: title,
      UploadId: uploadId,
      PartNumber: i,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    urls.push(signedUrl);
  }

  return urls;
}
