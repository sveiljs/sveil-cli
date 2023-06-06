#!/usr/bin/env node
export enum Structure {
  DOMAIN = "domain",
  FEATURE = "feature",
}

export enum ScriptLangs {
  TS = "ts",
}

export enum CssLangs {
  SCSS = "scss",
  POSTCSS = "postcss",
}

export interface Config {
  structure: string;
  rootDir: string;
  libDir: string;
  componentsDir: string;
  servicesDir: string;
  stateDir: string;
  sharedDir: string;
  featuresDir?: string;
  defaultScriptLang: ScriptLangs | string;
  defaultCssLang: CssLangs | string;
}

export interface ComponentSchemaOptions {
  scriptLanguage?: ScriptLangs | string;
  cssLanguage?: CssLangs | string;
  cssExternal?: boolean;
}
