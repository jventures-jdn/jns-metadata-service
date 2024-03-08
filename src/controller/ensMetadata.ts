import { strict as assert } from "assert";
import { Contract } from "ethers";
import { Request, Response } from "express";
import { FetchError } from "node-fetch";
import {
  ContractMismatchError,
  ExpiredNameError,
  NamehashMismatchError,
  UnsupportedNetwork,
  Version,
} from "../base";
import {
  ADDRESS_ETH_REGISTRY,
  ETH_REGISTRY_ABI,
  RESPONSE_TIMEOUT,
} from "../config";
import { checkContract } from "../service/contract";
import { getDomain } from "../service/domain";
import { Metadata } from "../service/metadata";
import getNetwork, { NetworkName } from "../service/network";
import { constructEthNameHash } from "../utils/namehash";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getBlacklist } from "../utils/blacklist";

export async function ensMetadata(req: Request, res: Response) {
  // #swagger.description = 'ENS NFT metadata'
  // #swagger.parameters['networkName'] = { schema: { $ref: '#/definitions/networkName' } }
  // #swagger.parameters['{}'] = { name: 'contractAddress', description: 'Contract address which stores the NFT indicated by the tokenId', schema: { $ref: '#/definitions/contractAddress' } }
  // #swagger.parameters['tokenId'] = { type: 'string', description: 'Labelhash(v1) /Namehash(v2) of your ENS name.\n\nMore: https://docs.ens.domains/contract-api-reference/name-processing#hashing-names', schema: { $ref: '#/definitions/tokenId' } }
  res.setTimeout(RESPONSE_TIMEOUT, () => {
    res.status(504).json({ message: "Timeout" });
    return;
  });

  const { contractAddress, networkName, tokenId: identifier } = req.params;
  const { provider, SUBGRAPH_URL } = getNetwork(networkName as NetworkName);
  const last_request_date = Date.now();
  let tokenId, version;
  try {
    ({ tokenId, version } = await checkContract(
      provider,
      contractAddress,
      identifier
    ));

    let result = await getDomain(
      provider,
      networkName as NetworkName,
      SUBGRAPH_URL,
      contractAddress,
      tokenId,
      version,
      false
    );

    // add timestamp of the request date
    result.last_request_date = last_request_date;

    if (getBlacklist().includes(tokenId)) {
      const S3 = new S3Client({
        region: "auto",
        endpoint:
          "https://f0e1db329ba4b7f30833ff222c1009f7.r2.cloudflarestorage.com",
        credentials: {
          accessKeyId: "",
          secretAccessKey: "",
        },
      });

      try {
        await S3.send(
          new GetObjectCommand({
            Bucket: "jns",
            Key: `jfintestnet/registered/${result.getOriginal()}`,
          })
        );
      } catch (err) {
        result.removeOriginalName();
        res.json(result);
        return;
      }

      await S3.send(
        new CopyObjectCommand({
          Bucket: "jns-blacklist",
          CopySource: `/jns/jfintestnet/registered/${result.getOriginal()}`,
          Key: `jfintestnet/registered/${result.getOriginal()}`,
        })
      );

      await S3.send(
        new DeleteObjectCommand({
          Bucket: "jns",
          Key: `jfintestnet/registered/${result.getOriginal()}`,
        })
      );
    }
    /* #swagger.responses[200] = { 
      description: 'Metadata object',
      schema: { $ref: '#/definitions/ENSMetadata' }
    } */
    result.removeOriginalName();
    res.json(result);
    return;
  } catch (error: any) {
    const errCode = (error?.code && Number(error.code)) || 500;
    /* #swagger.responses[500] = { 
             description: 'Internal Server Error'
    } */
    /* #swagger.responses[501] = { 
           description: 'Unsupported network' 
    } */
    if (
      error instanceof FetchError ||
      error instanceof ContractMismatchError ||
      error instanceof ExpiredNameError ||
      error instanceof NamehashMismatchError ||
      error instanceof UnsupportedNetwork
    ) {
      if (!res.headersSent) {
        res.status(errCode).json({
          message: error.message,
        });
        return;
      }
    }

    try {
      // Here is the case; if subgraph did not index fresh ENS name but registry has the record,
      // instead of 'not found' send positive unknown metadata information
      const registry = new Contract(
        ADDRESS_ETH_REGISTRY,
        ETH_REGISTRY_ABI,
        provider
      );
      if (!tokenId || !version) {
        throw "Missing parameters to construct namehash";
      }
      const _namehash = constructEthNameHash(tokenId, version as Version);
      const isRecordExist = await registry.recordExists(_namehash);
      assert(isRecordExist, "JNS name does not exist");

      // When entry is not available on subgraph yet,
      // return unknown name metadata with 200 status code
      const { url, ...unknownMetadata } = new Metadata({
        name: "unknown.name",
        description: "Unknown JNS name",
        created_date: 1580346653000,
        tokenId: "",
        version: Version.v1,
        // add timestamp of the request date
        last_request_date,
      });
      res.status(200).json({
        message: unknownMetadata,
      });
      return;
    } catch (error) {}

    /* #swagger.responses[404] = {
      description: 'No results found'
    } */
    if (!res.headersSent) {
      res.status(404).json({
        message: "No results found.",
      });
    }
  }
}
