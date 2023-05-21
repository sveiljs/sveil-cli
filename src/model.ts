#!/usr/bin/env node
export enum Structure {
  DOMAIN = "DOMAIN",
  FEATURE = "FEATURE",
}

export interface Config {
  structure: string;
  rootDir: string;
  libDir: string;
  componentssDir: string;
  servicessDir: string;
  reactiveServicessDir: string;
  statesDir: string;
  sharedDir: string;
  featuresDir?: string;
}
