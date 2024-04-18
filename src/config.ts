const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost";
const ENV = process.env.ENV || "local"; // local/prod
const REDIS_URL = process.env.REDIS_URL;

const FONT_FOLDER = path.join(ENV === "local" ? "src" : "dist", "assets");
const CANVAS_FONT_PATH = path.join(FONT_FOLDER, "Satoshi-Bold.ttf");
const CANVAS_EMOJI_FONT_PATH = path.join(FONT_FOLDER, "NotoColorEmoji.ttf");
const INAMEWRAPPER = process.env.INAMEWRAPPER || "0x019a38fe";

const IPFS_GATEWAY = process.env.IPFS_GATEWAY || "https://ipfs.io";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY || "";
const NODE_PROVIDER = process.env.NODE_PROVIDER || "geth";
const NODE_PROVIDER_URL =
  process.env.NODE_PROVIDER_URL || "http://localhost:8545";

// undocumented, temporary keys
const NODE_PROVIDER_URL_CF = process.env.NODE_PROVIDER_URL_CF || "";
const NODE_PROVIDER_URL_GOERLI = process.env.NODE_PROVIDER_URL_GOERLI || "";

const ADDRESS_ETH_REGISTRAR =
  process.env.ADDRESS_ETH_REGISTRAR ||
  "0x843A1b4385B1e2FF192d2997e1D7DCd71645b231";
const ADDRESS_ETH_REGISTRY =
  process.env.ADDRESS_ETH_REGISTRY ||
  "0x8Dd72c36Df956bC2220b09dAc908DdC8C62AeC2b";
const ADDRESS_NAME_WRAPPER =
  process.env.ADDRESS_NAME_WRAPPER ||
  "0x34a30717aaE3659CC84246EA8e4A7FB0DCC4093C";

const SERVER_URL =
  ENV === "local" ? `http://localhost:${PORT}` : `https://${HOST}`;

const ETH_REGISTRY_ABI = [
  "function recordExists(bytes32 node) external view returns (bool)",
];

// response timeout: 1 min
const RESPONSE_TIMEOUT = 15 * 1000;

// s3
const S3_ENDPOINT = process.env.S3_ENDPOINT || "";
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || "";
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || "";

// JNS app
const APP_V3_ENDPOINT = process.env.APP_V3_ENDPOINT || "https://jns.testnet.jfinchain.com/";

export {
  ADDRESS_ETH_REGISTRAR,
  ADDRESS_ETH_REGISTRY,
  ADDRESS_NAME_WRAPPER,
  CANVAS_FONT_PATH,
  CANVAS_EMOJI_FONT_PATH,
  ETH_REGISTRY_ABI,
  INAMEWRAPPER,
  IPFS_GATEWAY,
  INFURA_API_KEY,
  OPENSEA_API_KEY,
  REDIS_URL,
  NODE_PROVIDER,
  NODE_PROVIDER_URL,
  NODE_PROVIDER_URL_CF,
  NODE_PROVIDER_URL_GOERLI,
  RESPONSE_TIMEOUT,
  SERVER_URL,
  S3_ENDPOINT,
  S3_ACCESS_KEY,
  S3_SECRET_ACCESS_KEY,
  APP_V3_ENDPOINT
};
