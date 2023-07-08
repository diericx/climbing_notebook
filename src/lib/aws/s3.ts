// Create S3 service object
import { PutObjectCommand, DeleteObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import {
  getSignedUrl,
} from '@aws-sdk/s3-request-presigner';
const client = new S3Client({ region: 'us-west-2' });
const bucket = 'cn-uploads-prod';

const uploadFile = async (key: string, file: File) => {
  const fileContents = Buffer.from(await file.arrayBuffer())
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileContents,
  });
  return await client.send(command);
};

const deleteFile = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return await client.send(command);
};

const getPresignedUrl = async (key: string) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 60 });
}

export { uploadFile, getPresignedUrl, deleteFile };
