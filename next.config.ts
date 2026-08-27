import type { NextConfig } from "next";
import sdkContract from "./data/contracts/sdk.json";

const nextConfig: NextConfig = {
  serverExternalPackages: sdkContract.serverExternalPackages,
};

export default nextConfig;
