// Copyright (c) 2022 Steven Dean (StevenDean21st)

import {CountryList} from "./country.js";
import * as path from "path"
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
    unlinkSync
} from "fs";
import {fileURLToPath} from 'url'

// es module
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// assets
const FlagIconsRoot = path.resolve(__dirname, "../node_modules/flag-icons/flags/");
const RectanglePath = path.join(FlagIconsRoot, "4x3");
const ClassName = "__flag-svg";

// flag template
const TemplateDistPath = path.resolve(__dirname, "../packages/components/");
const TemplatePath = path.resolve(__dirname, "./ComponentTemplate.vue.txt");
const ExportTemplatePath = path.resolve(__dirname, "./ComponentTemplate.js.txt");
const IndexTemplatePath = path.resolve(__dirname, "./IndexTemplate.js.txt");
const IndexDistPath = path.resolve(__dirname, "../packages/index.js");
const TemplateTarget = "[[TARGET]]";
const TemplateAssetsPath = path.resolve(__dirname, "../packages/assets");
const ExportName = "[[NAME]]";
const IndexImports = "[[INDEX.IMPORTS]]";
const IndexExports = "[[INDEX.EXPORTS]]";


const template = readFileSync(TemplatePath).toString();
const exportIndex = readFileSync(ExportTemplatePath).toString();
const index = readFileSync(IndexTemplatePath).toString();


// test template
const TestTemplatePath = path.resolve(__dirname, "./TestTemplate.vue.txt");
const TestFileDist = path.resolve(__dirname, "../test/App.vue");
const TestTarget = "[[TARGET]]";
const TestImport = "[[IMPORT]]";

// country code references
const countries = CountryList;
let length = countries.length;
let progress = 0;

const testFile = readFileSync(TestTemplatePath).toString();

const getSvgPath = (assetsDir, code) => path.join(assetsDir, code + '.svg');

const toHTML = (country, code, countryRaw, assetsDir) => {
    return `<img class="${ClassName}" src="${assetsDir}${code}.svg" alt="${country} Flag" title="${countryRaw}">`;
};

const replaceNonCharacter = (string) => string.replaceAll(/[^a-zA-Z\d]/g, '');

const emptyDirSync = (path) => {
    const files = readdirSync(path);
    files.forEach(file => {
        const filePath = `${path}/${file}`;
        const stats = statSync(filePath);
        if (stats.isDirectory()) {
            emptyDirSync(filePath);
            rmdirSync(filePath);
        } else {
            unlinkSync(filePath);
        }
    });
}

const ProcessTemplate = () => {
    // delete last
    if (existsSync(TemplateDistPath)) {
        emptyDirSync(TemplateDistPath);
        rmdirSync(TemplateDistPath);
        emptyDirSync(TemplateAssetsPath);
        rmdirSync(TemplateAssetsPath);
    }

    mkdirSync(TemplateDistPath);
    mkdirSync(TemplateAssetsPath);

    let indexImports = '';
    let indexExports = '';

    for (let {code, name: enName} of countries) {
        const rawName = enName;
        enName = replaceNonCharacter(enName);

        // create dir
        const dist = path.join(TemplateDistPath, enName + "Flag");
        mkdirSync(dist);

        // copy svg to assets
        copyFileSync(getSvgPath(RectanglePath, code), getSvgPath(TemplateAssetsPath, code));

        // generate template, attention to assetsDir
        let tmp = template.replace(TemplateTarget, toHTML(enName, code.toLowerCase(), rawName, '../../assets/'));

        // generate export
        let index = exportIndex.replaceAll(ExportName, enName + "Flag");

        // generate index imports and exports
        indexImports += `import ${enName}Flag from "./components/${enName}Flag/index.js";\n`;
        indexExports += `${enName}Flag,\n`;

        // write template file
        writeFile(path.join(dist, enName + "FLag.vue"), tmp, () => {
            // write export
            writeFile(path.join(dist, "index.js"), index, () => {
                progress++;
                console.log(`${rawName} => ${enName + "Flag.vue"} progress:`, progress, "/", length);
                if (progress === length) console.log("Generator has done.");
            })
        });
    }

    // write index imports and exports
    let indexJs = index.replaceAll(IndexExports, indexExports).replace(IndexImports, indexImports);
    writeFile(IndexDistPath, indexJs, () => {
        console.log("index.js has been generated.");
    });
};

const GenerateTest = () => {
    let insert = "";
    let imports = "";
    for (let {name: enName} of countries) {
        enName = replaceNonCharacter(enName);
        insert += `<${enName}Flag/>` + "\n";
        imports += `import ${enName}Flag from "../packages/components/${enName}Flag.vue"` + "\n";
    }
    let res = testFile.replace(TestTarget, insert).replace(TestImport, imports);
    rmSync(TestFileDist, {force: true});
    writeFile(TestFileDist, res, () => console.log("Done."));
};

ProcessTemplate();
GenerateTest();