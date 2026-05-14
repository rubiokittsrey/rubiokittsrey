import 'server-only';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { requireR2WriteEnv } from './env';

let clientCache: { client: S3Client; bucket: string } | null = null;

function getClient() {
    if (clientCache) return clientCache;
    const { accountId, accessKeyId, secretAccessKey, bucket } = requireR2WriteEnv();
    const client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
    });
    clientCache = { client, bucket };
    return clientCache;
}

export async function putR2Object(
    key: string,
    body: Buffer,
    contentType: string
): Promise<void> {
    const { client, bucket } = getClient();
    await client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key.replace(/^\/+/, ''),
            Body: body,
            ContentType: contentType,
            CacheControl: 'public, max-age=31536000, immutable',
        })
    );
}
