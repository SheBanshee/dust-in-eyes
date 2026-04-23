import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.S3_SECRET_KEY || "minioadmin",
  },
});

const BUCKET = process.env.S3_BUCKET || "car-images";

export async function uploadFile(
  file: Buffer,
  originalName: string,
  contentType: string
): Promise<string> {
  const ext = originalName.split(".").pop() || "jpg";
  const key = `${randomUUID()}.${ext}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  const publicUrl = process.env.S3_PUBLIC_URL || "http://localhost:9000";
  return `${publicUrl}/${BUCKET}/${key}`;
}

export async function deleteFile(url: string): Promise<void> {
  const key = url.split("/").pop();
  if (!key) return;

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}
