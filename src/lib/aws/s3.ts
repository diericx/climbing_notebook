// Create S3 service object
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
const client = new S3Client({});

const uploadFile = async (key: string, file: File) => {
  const fileContents = Buffer.from(await file.arrayBuffer())
  const command = new PutObjectCommand({
    Bucket: 'cn-uploads-prod',
    Key: key,
    Body: fileContents,
  });
  return await client.send(command);
};

export { uploadFile };
