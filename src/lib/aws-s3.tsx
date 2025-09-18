import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'combi-blog';

// Interface for S3 file metadata
export interface S3File {
  key: string;
  name: string;
  size?: number;
  lastModified?: Date;
  url?: string | null;
  contentType?: string;
}

// Type alias for backward compatibility
export type S3Image = S3File;

// List all files in the bucket
export async function listFiles(prefix: string = '', maxKeys: number = 100, fileExtensions?: string[]): Promise<S3File[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: maxKeys,
    });

    const response = await s3Client.send(command);
    
    if (!response.Contents) {
      return [];
    }

    const files = response.Contents
      .filter(obj => {
        if (!obj.Key) return false;
        
        // If file extensions are specified, filter by them
        if (fileExtensions && fileExtensions.length > 0) {
          const extension = obj.Key.toLowerCase().substring(obj.Key.lastIndexOf('.'));
          return fileExtensions.includes(extension);
        }
        
        // Otherwise, return all files
        return true;
      })
      .map(obj => ({
        key: obj.Key!,
        name: obj.Key!.split('/').pop() || obj.Key!,
        size: obj.Size,
        lastModified: obj.LastModified,
        contentType: getContentType(obj.Key!),
      }));

    return files;
  } catch (error) {
    console.error('Error listing files from S3:', error);
    throw new Error('Failed to fetch files from S3');
  }
}

// Get a presigned URL for any file (valid for 1 hour)
export async function getFileUrl(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
    return url;
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    throw new Error('Failed to get file URL');
  }
}


// Upload any file to S3
export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await s3Client.send(command);
    return `Successfully uploaded ${key}`;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file');
  }
}


// Delete any file from S3
export async function deleteFile(key: string): Promise<string> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return `Successfully deleted ${key}`;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error('Failed to delete file');
  }
}


// Get content type based on file extension
function getContentType(key: string): string {
  const extension = key.toLowerCase().substring(key.lastIndexOf('.'));
  
  const contentTypes: { [key: string]: string } = {
    // Images
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',
    
    // Documents
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    
    // Text files
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.ts': 'application/typescript',
    
    // Archives
    '.zip': 'application/zip',
    '.rar': 'application/vnd.rar',
    '.tar': 'application/x-tar',
    '.gz': 'application/gzip',
    
    // Audio
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.m4a': 'audio/mp4',
    
    // Video
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.wmv': 'video/x-ms-wmv',
    '.webm': 'video/webm',
  };

  return contentTypes[extension] || 'application/octet-stream';
}

// Utility functions for common file type operations

// Get images specifically
export async function listImages(prefix: string = '', maxKeys: number = 100): Promise<S3File[]> {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  return listFiles(prefix, maxKeys, imageExtensions);
}

// Get all documents
export async function listDocuments(prefix: string = '', maxKeys: number = 100): Promise<S3File[]> {
  const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'];
  return listFiles(prefix, maxKeys, documentExtensions);
}

// Get all media files (images + videos + audio)
export async function listMediaFiles(prefix: string = '', maxKeys: number = 100): Promise<S3File[]> {
  const mediaExtensions = [
    // Images
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico',
    // Videos
    '.mp4', '.avi', '.mov', '.wmv', '.webm',
    // Audio
    '.mp3', '.wav', '.ogg', '.m4a'
  ];
  return listFiles(prefix, maxKeys, mediaExtensions);
}

// Get all archive files
export async function listArchives(prefix: string = '', maxKeys: number = 100): Promise<S3File[]> {
  const archiveExtensions = ['.zip', '.rar', '.tar', '.gz'];
  return listFiles(prefix, maxKeys, archiveExtensions);
}

// Check if file is an image
export function isImageFile(key: string): boolean {
  const extension = key.toLowerCase().substring(key.lastIndexOf('.'));
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
  return imageExtensions.includes(extension);
}

// Check if file is a document
export function isDocumentFile(key: string): boolean {
  const extension = key.toLowerCase().substring(key.lastIndexOf('.'));
  const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'];
  return documentExtensions.includes(extension);
}

// Check if file is media (image, video, or audio)
export function isMediaFile(key: string): boolean {
  const extension = key.toLowerCase().substring(key.lastIndexOf('.'));
  const mediaExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico',
    '.mp4', '.avi', '.mov', '.wmv', '.webm',
    '.mp3', '.wav', '.ogg', '.m4a'
  ];
  return mediaExtensions.includes(extension);
}

export { s3Client, BUCKET_NAME };

