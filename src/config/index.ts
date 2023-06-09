import { Config, Structure } from "../model";

export const defaultConfig: Config = {
  sourceDir: "src",
  libDir: "lib",
  componentsDir: "components",
  servicesDir: "services",
  sharedDir: "shared",
  stateDir: "state",
  structure: Structure.DOMAIN,
};
