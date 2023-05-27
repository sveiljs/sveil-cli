#!/usr/bin/env node
export enum Structure {
  DOMAIN = "DOMAIN",
  FEATURE = "FEATURE",
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
  componentssDir: string;
  servicessDir: string;
  reactiveServicessDir: string;
  statesDir: string;
  sharedDir: string;
  featuresDir?: string;
  defaultScriptLang: ScriptLangs | string;
  defaultCssLang: CssLangs | string;
}

export interface ComponentSchemaOptions {
  scriptLang?: ScriptLangs;
  externalCss?: boolean;
  CssLang?: CssLangs;
}
