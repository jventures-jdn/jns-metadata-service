import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3_ACCESS_KEY, S3_ENDPOINT, S3_SECRET_ACCESS_KEY } from "../config";
import { getBlacklist } from "./blacklist";

/**
 * Move R2 avatar object based on the blacklist
 * 
 * @param rawName The blacklisted name
 * @param tokenId The blacklisted tokenId
 */
export async function handleBlacklistAvatar(rawName?: string, tokenId?: string) {
  if (!rawName || !tokenId) {
    return
  }

  const S3 = new S3Client({
    region: "auto",
    endpoint: S3_ENDPOINT,
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
  });

  try {
    const isBlacklisted = getBlacklist().includes(tokenId)
    const sourceBucket = isBlacklisted ? "jns" : "jns-blacklist";
    const destinationBucket = isBlacklisted ? "jns-blacklist" : "jns";

    const getObjectParams = {
      Bucket: sourceBucket,
      Key: `jfintestnet/registered/${rawName}`,
    };

    // get avatar object with key
    await S3.send(new GetObjectCommand(getObjectParams));

    const copyObjectParams = {
      Bucket: destinationBucket,
      CopySource: `/${sourceBucket}/jfintestnet/registered/${rawName}`,
      Key: `jfintestnet/registered/${rawName}`,
    };

    // transfer avatar object to the destination bucket
    await S3.send(new CopyObjectCommand(copyObjectParams));

    const deleteObjectParams = {
      Bucket: sourceBucket,
      Key: `jfintestnet/registered/${rawName}`,
    };

    // delete from the source bucket
    await S3.send(new DeleteObjectCommand(deleteObjectParams));
  } catch {
    return
  }
}
