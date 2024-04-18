import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3_ACCESS_KEY, S3_ENDPOINT, S3_SECRET_ACCESS_KEY } from "../config";
import { isNameTakenDown } from "./checkNameTakedown";

/**
 * Move R2 avatar object based on the takedown list
 * 
 * @param rawName The taken down name
 * @param tokenId The taken down token id
 */
export async function handleTakendownAvatar(rawName?: string, tokenId?: string) {
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
    const isTakendown = await isNameTakenDown(tokenId);
    const sourceBucket = isTakendown ? process.env.IS_TESTNET ? "jns-testnet" : "jns" : process.env.IS_TESTNET ? "jns-takedown-testnet" : "jns-takedown";
    const destinationBucket = isTakendown ? process.env.IS_TESTNET ? "jns-takedown-testnet" : "jns-takedown" : process.env.IS_TESTNET ? "jns-testnet" : "jns";
    const network = process.env.IS_TESTNET ? 'jfintestnet' : 'jfin'

    const getObjectParams = {
      Bucket: sourceBucket,
      Key: `${network}/registered/${rawName}`,
    };

    // get avatar object with key
    await S3.send(new GetObjectCommand(getObjectParams));

    const copyObjectParams = {
      Bucket: destinationBucket,
      CopySource: `/${sourceBucket}/${network}/registered/${rawName}`,
      Key: `${network}/registered/${rawName}`,
    };

    // transfer avatar object to the destination bucket
    await S3.send(new CopyObjectCommand(copyObjectParams));

    const deleteObjectParams = {
      Bucket: sourceBucket,
      Key: `${network}/registered/${rawName}`,
    };

    // delete from the source bucket
    await S3.send(new DeleteObjectCommand(deleteObjectParams));
  } catch {
    return
  }
}
