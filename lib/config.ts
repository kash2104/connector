import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3Client = new S3Client({
    credentials:{
        accessKeyId: accessKey ?? "",
        secretAccessKey: secretAccessKey ?? ""
    },
    region: bucketRegion
})
export default s3Client;

export async function uploadVideoS3(video: any, title: string){
    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // console.log("video", buffer);
    // console.log("title", title);

    const params = {
      Bucket: bucketName,
      Key: title,
      Body: buffer,
      ContentType: video.type,
    }

    const command = new PutObjectCommand(params);

    const result = await s3Client.send(command);

    return result;
}