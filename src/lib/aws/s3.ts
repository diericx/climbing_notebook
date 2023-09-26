// Create S3 service object
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dayjs from 'dayjs';
const client = new S3Client({ region: 'us-west-2' });
const bucket = 'cn-uploads-prod';

const s3ObjectUrlCache: { [key: string]: { url: string; expiresAt: Date } } = {};
const s3ObjectMetadataCache: { [key: string]: any } = {};

const uploadFile = async (
  key: string,
  file: File,
  metadata: Record<string, string> | undefined
) => {
  // Invalidate metadata cache
  delete s3ObjectMetadataCache[key];

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
  // Invalidate metadata cache
  delete s3ObjectMetadataCache[key];

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return await client.send(command);
};

const getPresignedUrl = async (key: string) => {
  // Attempt to get result from cache
  const cachedResult = s3ObjectUrlCache[key];
  if (cachedResult && new Date() < cachedResult.expiresAt) {
    return cachedResult.url;
  }

  // Get the new value
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const expiresInSeconds = 43200;
  const signedUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });

  // Cache the value
  s3ObjectUrlCache[key] = {
    url: signedUrl,
    expiresAt: dayjs().add(expiresInSeconds, 'seconds').toDate(),
  };

  return signedUrl;
};

const getMetadata = async (key: string) => {
  // Return cached result
  if (s3ObjectMetadataCache[key]) {
    return s3ObjectMetadataCache[key];
  }

  // Fetch
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
