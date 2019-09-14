const path = require("path");
const fs = require("fs");
const shell = require("child_process");

const [, , packageName, ...optionsArray] = process.argv;

const options = {};

optionsArray.forEach(option => {
  let [name, value] = option.split("=");
  if (value === undefined) {
    value = true;
  } else if (value === "false") {
    value = false;
  }
  name = name.replace("--", "");
  options[name] = value;
});

if (packageName === "--help" || !packageName) {
  console.log("Usage: yarn package:create <packageName> [parameters]");
  console.log("");
  console.log("  --rollup       includes Rollup dependencies to transpile");
  console.log("  --shortName    namespace in Xethya's IIFE (use with --rollup)");
  console.log("  --moduleName   used to build the file name (xethya.moduleName.js, use with --rollup)");
  process.exit();
}

const monorepoPackageJson = require(path.resolve("./package.json"));

const templatePackageJson = `
{
  "name": "@xethya/${packageName}",
  ${options.rollup ? '"shortName": "' + options.shortName + '",' : ""}
  "version": "0.0.1",
  "description": "",
  ${options.rollup ? '"main": "dist/xethya.' + options.moduleName + '.js",' : ""}
  ${options.rollup ? '"module": "dist/xethya.' + options.moduleName + '.es.js",' : ""}
  ${options.rollup ? '"iife": "dist/xethya.' + options.moduleName + '.iife.js",' : ""}
  "repository": "https://github.com/xethya/framework",
  "author": "Joel A. Villarreal Bertoldi",
  "license": "MIT",
  "devDependencies": {
    "@types/jest": "${monorepoPackageJson.devDependencies["@types/jest"]}",
    "jest": "${monorepoPackageJson.devDependencies["jest"]}",
    "ts-jest": "${monorepoPackageJson.devDependencies["ts-jest"]}",
    "tslint": "${monorepoPackageJson.devDependencies["tslint"]}",
    "typescript": "${monorepoPackageJson.devDependencies["typescript"]}"
  },
  "scripts": {
    "build": "tsc -b${options.rollup ? " && rollup -c" : ""}",
    "test": "jest --runInBand --detectOpenHandles --bail --forceExit",
    "test:coverage": "jest --runInBand --detectOpenHandles --bail --forceExit --coverage"
  },
  "publishConfig": {
    "access": "public"
  },
  "jest": {
    "preset": "ts-jest",
    "collectCoverageFrom": [
      "src/**/*.ts",
      "!**/index.ts",
      "!**/errors.ts"
    ],
    "transformIgnorePatterns": [
      "/node_modules/[^@xethya]/"
    ]
  }
}
`.trim();

const templateRollupConfig = `
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

const globals = {};

import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        sourcemap: true,
        format: 'cjs',
        globals: globals
      },
      {
        file: pkg.module,
        sourcemap: true,
        format: 'es',
        globals: globals
      },
      {
        file: pkg.iife,
        sourcemap: true,
        format: 'iife',
        name: 'xethya.' + pkg.shortName,
        globals: globals
      }
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      typescript({
        typescript: require('typescript')
      }),
      json({ compact: true })
    ]
  }
];
`.trim();

const templateTsconfigJson = `
{
  "extends": "../../tsconfig.json"
}
`.trim();

const templateTslintJson = `
{
  "extends": [
    "../../tslint.json"
  ]
}
`.trim();

console.log("Creating: ", packageName);
console.log("Options: ", options);

const basePath = path.resolve(`./packages/${packageName}`);

console.log("Creating skeleton directories in: ", basePath);

fs.mkdirSync(basePath);
fs.mkdirSync(`${basePath}/src`);
fs.mkdirSync(`${basePath}/tests`);

console.log("Writing package and linting configuration...");

fs.writeFileSync(`${basePath}/package.json`, templatePackageJson);
fs.writeFileSync(`${basePath}/tsconfig.json`, templateTsconfigJson);
fs.writeFileSync(`${basePath}/tslint.json`, templateTslintJson);

if (options.rollup) {
  console.log("Writing Rollup configuration...");
  fs.writeFileSync(`${basePath}/rollup.config.js`, templateRollupConfig);
}

process.chdir(basePath);

console.log("Installing dependencies...");

const yarnExecution = shell.exec("yarn");
yarnExecution.stdout.on("data", data => {
  console.log(data);
});
yarnExecution.stderr.on("data", data => {
  console.error(data);
});
yarnExecution.on("exit", () => {
  console.log("Ready!");
});
