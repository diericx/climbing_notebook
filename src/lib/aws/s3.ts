// Create S3 service object
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const client = new S3Client({ region: 'us-west-2' });
const bucket = 'cn-uploads-prod';

const uploadFile = async (
  key: string,
  file: File,
  metadata: Record<string, string> | undefined
) => {
  const fileContents = Buffer.from(await file.arrayBuffer());
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileContents,
    Metadata: metadata,
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
};

const getMetadata = async (key: string) => {
  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const result = await client.send(command);
  return result.Metadata;
};

const getSignedUrlsAndMetadata = async (keys: string[]) => {
  const s3ObjectUrls: { [key: string]: string } = {};
  for (const key of keys) {
    s3ObjectUrls[key] = await getPresignedUrl(key);
  }

  const s3ObjectMetadatas: { [key: string]: Record<string, string> | undefined } = {};
  for (const key of keys) {
    s3ObjectMetadatas[key] = await getMetadata(key);
  }

  return { s3ObjectUrls, s3ObjectMetadatas };
};

export { deleteFile, getMetadata, getPresignedUrl, uploadFile, getSignedUrlsAndMetadata };
