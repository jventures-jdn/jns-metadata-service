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
  "0xc9259D1B7Ff668F3d3936768F08CaD71a921800b";
const ADDRESS_ETH_REGISTRY =
  process.env.ADDRESS_ETH_REGISTRY ||
  "0x97f49F388Fb533746EA6f8494963037e864CFEAD";
const ADDRESS_NAME_WRAPPER =
  process.env.ADDRESS_NAME_WRAPPER ||
  "0x8Cd716d9cf32d4C3605E3Ba60932BD71CfeEb689";

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
const APP_V3_ENDPOINT = process.env.APP_V3_ENDPOINT || "https://fc2991c4.jns-app.pages.dev";

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
