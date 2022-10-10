// Copyright (c) 2022 Steven Dean (StevenDean21st)

import { CountryList } from "./country.js";
import * as path from "path";
import {
  copyFileSync,
  readFileSync,
  writeFile,
  writeFileSync,
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

// test
const TEST_SFC_TEMPLATE_PATH = path.resolve(
  __templateRoot,
  "./TestTemplate.vue"
);
const TEST_FILE_DIST_PATH = path.resolve(
  __monorepoRoot,
  "./projects/test_field/src/App.vue"
);
const TEST_PUBLIC_PATH = path.resolve(
  __monorepoRoot,
  "./projects/test_field/public"
);
const TEST_PUBLIC_FLAGS_PATH = path.resolve(TEST_PUBLIC_PATH, "./flags");

// assets
const FLAG_ICON_ROOT_PATH = path.resolve(
  __packageRoot,
  "./node_modules/flag-icons/flags/"
);
const ICON_4X3_PATH = path.join(FLAG_ICON_ROOT_PATH, "4x3");

// manifest
const MANIFEST_DIST_PATH = path.resolve(__packageRoot, "./manifest");
const COMPONENTS_MANIFEST_TEMPLATE_PATH = path.resolve(
  __templateRoot,
  "./ComponentsManifestTemplate.js"
);
const COUNTRIES_MANIFEST_TEMPLATE_PATH = path.resolve(
  __templateRoot,
  "./CountriesManifestTemplate.js"
);
const MANIFEST_INDEX_TEMPLATE_PATH = path.resolve(
  __templateRoot,
  "./ManifestIndexTemplate.js"
);
const MANIFEST_INDEX_DIST_PATH = path.resolve(MANIFEST_DIST_PATH, "./index.js");

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
const COMPONENTS_INDEX_TEMPLATE_PATH = path.resolve(
  __templateRoot,
  "./IndexTemplate.js"
);
const COMPONENTS_INDEX_DIST_PATH = path.resolve(__packageRoot, "./index.js");
const TEMPLATE_ASSETS_PATH = path.resolve(__packageRoot, "./assets");

const SFC_TEMPLATE_TARGET = define.__SFC_TEMPLATE_TARGET__;
const EXPORT_NAME = define.__EXPORT_NAME__;
const INDEX_IMPORTS_TARGET = define.__INDEX_IMPORTS_TARGET__;
const INDEX_EXPORTS_TARGET = define.__INDEX_EXPORTS_TARGET__;
const TEST_TARGET = define.__TEST_TARGET__;
const H_TEST_TARGET = define.__H_TEST_TARGET__;
const H_TEST_TEMPLATE_TARGET = define.__H_TEST_TEMPLATE_TARGET__;
const TEST_IMPORT = define.__TEST_IMPORT__;
const COMPONENTS_MANIFEST_TARGET = define.__COMPONENTS_MANIFEST_TARGET__;
const COUNTRIES_MANIFEST_TARGET = define.__COUNTRIES_MANIFEST_TARGET__;

// templates
const sfcTemplate = readFileSync(SFC_TEMPLATE_PATH).toString();
const exportIndexTemplate = readFileSync(EXPORT_TEMPLATE_PATH).toString();
const indexTemplate = readFileSync(COMPONENTS_INDEX_TEMPLATE_PATH).toString();
const testFileTemplate = readFileSync(TEST_SFC_TEMPLATE_PATH).toString();
const componentsManifestTemplate = readFileSync(
  COMPONENTS_MANIFEST_TEMPLATE_PATH
).toString();
const countriesManifestTemplate = readFileSync(
  COUNTRIES_MANIFEST_TEMPLATE_PATH
).toString();

// country code references
const countryList = CountryList;
let length = countryList.length;
let progress = 0;

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
  }

  if (existsSync(TEMPLATE_ASSETS_PATH)) {
    emptyDirSync(TEMPLATE_ASSETS_PATH);
    rmdirSync(TEMPLATE_ASSETS_PATH);
  }

  if (existsSync(MANIFEST_DIST_PATH)) {
    emptyDirSync(MANIFEST_DIST_PATH);
    rmdirSync(MANIFEST_DIST_PATH);
  }

  mkdirSync(SFC_DIST_PATH);
  mkdirSync(TEMPLATE_ASSETS_PATH);
  mkdirSync(MANIFEST_DIST_PATH);

  let indexImports = "";
  let indexExports = "";
  let components = "";
  let countries = "";

  for (let { code, name: enName } of countryList) {
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
    let template = sfcTemplate.replace(
      SFC_TEMPLATE_TARGET,
      toHTML(enName, code.toLowerCase(), rawName, "../../assets")
    );

    // generate export
    let index = exportIndexTemplate.replaceAll(EXPORT_NAME, enName + "Flag");

    // generate index imports and exports
    indexImports += `import ${enName}Flag from "./components/${enName}Flag/index.js";\n`;
    indexExports += `${enName}Flag,\n`;

    // write manifest
    components += `'${code}':{enName:'${enName}',component:Components.${enName}Flag},`;
    countries += `'${code}':{enName:'${enName}',asset:'${code}.svg'},`;

    // write template file
    writeFileSync(path.join(dist, enName + "FLag.vue"), template);
    // write export
    writeFileSync(path.join(dist, "index.js"), index);

    progress++;
    console.log(
      `${rawName} => ${enName + "Flag.vue"} progress:`,
      progress,
      "/",
      length
    );
    if (progress === length) console.log("Components generated");
  }

  // write manifest
  writeFileSync(
    path.join(MANIFEST_DIST_PATH, "components.js"),
    componentsManifestTemplate.replaceAll(
      COMPONENTS_MANIFEST_TARGET,
      components
    )
  );
  console.log("Components manifest generated.");

  writeFileSync(
    path.join(MANIFEST_DIST_PATH, "countries.js"),
    countriesManifestTemplate.replaceAll(COUNTRIES_MANIFEST_TARGET, countries)
  );
  console.log("Countries manifest generated.");
  copyFileSync(MANIFEST_INDEX_TEMPLATE_PATH, MANIFEST_INDEX_DIST_PATH);
  console.log("Manifest entry index.js generated.");

  // write index imports and exports
  let indexJs = indexTemplate
    .replaceAll(INDEX_EXPORTS_TARGET, indexExports)
    .replace(INDEX_IMPORTS_TARGET, indexImports);
  writeFileSync(COMPONENTS_INDEX_DIST_PATH, indexJs);
  console.log("Components entry index.js generated.");
};

const GenerateTest = () => {
  let templates = "";
  // let hTemplates = "";
  let imports = "";
  for (let { code, name: enName } of countryList) {
    enName = replaceNonCharacter(enName);
    templates += `<${enName}Flag style="width: 100px"/>` + "\n";
    // hTemplates +=
    //     `<component :is="FlagCodeName['${code}'].component" style="width: 100px"/>` +
    //     "\n";
    imports += `import {${enName}Flag} from "${PACKAGE_NAME}"` + "\n";
  }
  let res = testFileTemplate
    .replace(TEST_TARGET, templates)
    .replace(TEST_IMPORT, imports);
  // .replace(H_TEST_TEMPLATE_TARGET, hTemplates);

  rmSync(TEST_FILE_DIST_PATH, { force: true });
  writeFileSync(TEST_FILE_DIST_PATH, res);
  console.log("Test generated.");

  // copy assets
  if (existsSync(TEST_PUBLIC_FLAGS_PATH)) {
    emptyDirSync(TEST_PUBLIC_FLAGS_PATH);
    rmdirSync(TEST_PUBLIC_FLAGS_PATH);
  }
  mkdirSync(TEST_PUBLIC_FLAGS_PATH);
  for (let { code } of countryList) {
    copyFileSync(
      getSvgPath(ICON_4X3_PATH, code),
      TEST_PUBLIC_FLAGS_PATH + "/" + code + ".svg"
    );
  }
  console.log("Assets copied.");
};

ProcessTemplate();
GenerateTest();
