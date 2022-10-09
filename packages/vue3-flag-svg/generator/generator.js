// Copyright (c) 2022 Steven Dean (StevenDean21st)

import { CountryList } from "./country.js";
import * as path from "path";
import {
  copyFileSync,
  readFileSync,
  writeFile,
  mkdirSync,
  rmdirSync,
  rmSync,
  existsSync,
  readdirSync,
  statSync,
  unlinkSync,
} from "fs";
import { fileURLToPath } from "url";
import { define } from "../define.js";

const PACKAGE_NAME = "vue3-flag-svg";

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // es module
const __monorepoRoot = path.resolve(__dirname, "../../../");
const __packageRoot = path.resolve(__dirname, "../");
const __templateRoot = path.resolve(__packageRoot, "./generator/template");

// test template
const TEST_SFC_TEMPLATE_PATH = path.resolve(
  __templateRoot,
  "./TestTemplate.vue"
);
const TEST_FILE_DIST_PATH = path.resolve(
  __monorepoRoot,
  "./projects/test_field/src/App.vue"
);

// assets
const FLAG_ICON_ROOT_PATH = path.resolve(
  __packageRoot,
  "./node_modules/flag-icons/flags/"
);
const ICON_4X3_PATH = path.join(FLAG_ICON_ROOT_PATH, "4x3");

// manifest
const MANIFEST_DIST_PATH = path.resolve(__packageRoot, "./manifest");
const MANIFEST_TEMPLATE_PATH = path.resolve(
  __templateRoot,
  "./ManifestTemplate.js"
);

// flag template
const SFC_DIST_PATH = path.resolve(__packageRoot, "./components/");
const SFC_TEMPLATE_PATH = path.resolve(
  __templateRoot,
  "./ComponentTemplate.vue"
);
const EXPORT_TEMPLATE_PATH = path.resolve(
  __templateRoot,
  "./ComponentTemplate.js"
);
const INDEX_TEMPLATE_PATH = path.resolve(__templateRoot, "./IndexTemplate.js");
const INDEX_DIST_PATH = path.resolve(__packageRoot, "./index.js");
const TEMPLATE_ASSETS_PATH = path.resolve(__packageRoot, "./assets");

const SFC_TEMPLATE_TARGET = define.__SFC_TEMPLATE_TARGET__;
const EXPORT_NAME = define.__EXPORT_NAME__;
const INDEX_IMPORTS_TARGET = define.__INDEX_IMPORTS_TARGET__;
const INDEX_EXPORTS_TARGET = define.__INDEX_EXPORTS_TARGET__;
const TEST_TARGET = define.__TEST_TARGET__;
const H_TEST_TARGET = define.__H_TEST_TARGET__;
const H_TEST_TEMPLATE_TARGET = define.__H_TEST_TEMPLATE_TARGET__;
const TEST_IMPORT = define.__TEST_IMPORT__;
const MANIFEST_TARGET = define.__MANIFEST_TARGET__;

// templates
const template = readFileSync(SFC_TEMPLATE_PATH).toString();
const exportIndex = readFileSync(EXPORT_TEMPLATE_PATH).toString();
const index = readFileSync(INDEX_TEMPLATE_PATH).toString();

// country code references
const countries = CountryList;
let length = countries.length;
let progress = 0;

const testFile = readFileSync(TEST_SFC_TEMPLATE_PATH).toString();

const getSvgPath = (assetsDir, code) => path.join(assetsDir, code + ".svg");

const toHTML = (country, code, countryRaw, assetsDir) => {
  return `<img style="width: 100%; height: auto" src="${assetsDir}/${code}.svg" alt="${country} Flag" title="${countryRaw}">`;
};

const replaceNonCharacter = (string) => string.replaceAll(/[^a-zA-Z\d]/g, "");

const emptyDirSync = (path) => {
  const files = readdirSync(path);
  files.forEach((file) => {
    const filePath = `${path}/${file}`;
    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      emptyDirSync(filePath);
      rmdirSync(filePath);
    } else {
      unlinkSync(filePath);
    }
  });
};

const ProcessTemplate = () => {
  // delete last
  if (existsSync(SFC_DIST_PATH)) {
    emptyDirSync(SFC_DIST_PATH);
    rmdirSync(SFC_DIST_PATH);
    emptyDirSync(TEMPLATE_ASSETS_PATH);
    rmdirSync(TEMPLATE_ASSETS_PATH);
    emptyDirSync(MANIFEST_DIST_PATH);
    rmdirSync(MANIFEST_DIST_PATH);
  }

  mkdirSync(SFC_DIST_PATH);
  mkdirSync(TEMPLATE_ASSETS_PATH);
  mkdirSync(MANIFEST_DIST_PATH);

  let indexImports = "";
  let indexExports = "";
  let manifests = "";

  for (let { code, name: enName } of countries) {
    const rawName = enName;
    enName = replaceNonCharacter(enName);

    // create dir
    const dist = path.join(SFC_DIST_PATH, enName + "Flag");
    mkdirSync(dist);

    // copy svg to assets
    copyFileSync(
      getSvgPath(ICON_4X3_PATH, code),
      getSvgPath(TEMPLATE_ASSETS_PATH, code)
    );

    // generate template, attention to assetsDir, must be components relative path
    let tmp = template.replace(
      SFC_TEMPLATE_TARGET,
      toHTML(enName, code.toLowerCase(), rawName, "../../assets")
    );

    // generate export
    let index = exportIndex.replaceAll(EXPORT_NAME, enName + "Flag");

    // generate index imports and exports
    indexImports += `import ${enName}Flag from "./components/${enName}Flag/index.js";\n`;
    indexExports += `${enName}Flag,\n`;

    // write manifest
    manifests += `'${code}':{enName:'${enName}',component:Components.${enName}Flag},`;

    // write template file
    writeFile(path.join(dist, enName + "FLag.vue"), tmp, () => {
      // write export
      writeFile(path.join(dist, "index.js"), index, () => {
        progress++;
        console.log(
          `${rawName} => ${enName + "Flag.vue"} progress:`,
          progress,
          "/",
          length
        );
        if (progress === length) console.log("Done.");
      });
    });
  }

  // write manifest
  writeFile(
    path.join(MANIFEST_DIST_PATH, "index.js"),
    readFileSync(MANIFEST_TEMPLATE_PATH)
      .toString()
      .replaceAll(MANIFEST_TARGET, manifests),
    () => {
      console.log("Manifest done.");
    }
  );

  // write index imports and exports
  let indexJs = index
    .replaceAll(INDEX_EXPORTS_TARGET, indexExports)
    .replace(INDEX_IMPORTS_TARGET, indexImports);
  writeFile(INDEX_DIST_PATH, indexJs, () => {
    console.log("index.js has been generated.");
  });
};

const GenerateTest = () => {
  let templates = "";
  let hTemplates = "";
  let imports = "";
  for (let { code, name: enName } of countries) {
    enName = replaceNonCharacter(enName);
    templates += `<${enName}Flag style="width: 100px"/>` + "\n";
    hTemplates +=
      `<component :is="FlagCodeName['${code}'].component" style="width: 100px"/>` +
      "\n";
    imports += `import {${enName}Flag} from "${PACKAGE_NAME}"` + "\n";
  }
  let res = testFile
    .replace(H_TEST_TEMPLATE_TARGET, hTemplates)
    .replace(TEST_TARGET, templates)
    .replace(TEST_IMPORT, imports);
  rmSync(TEST_FILE_DIST_PATH, { force: true });
  writeFile(TEST_FILE_DIST_PATH, res, () => console.log("Done."));
};

ProcessTemplate();
GenerateTest();
