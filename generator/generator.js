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
const TemplatePath = path.resolve(__dirname, "./ComponentTemplate.vue");
const TemplateTarget = "[[TARGET]]";
const TemplateAssetsPath = path.resolve(__dirname, "../packages/assets");

const template = readFileSync(TemplatePath).toString();

// test template
const TestTemplatePath = path.resolve(__dirname, "./TestTemplate.vue");
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

    for (let {code, name: enName} of countries) {
        const rawName = enName;
        enName = replaceNonCharacter(enName);

        // copy svg to assets
        copyFileSync(getSvgPath(RectanglePath, code), getSvgPath(TemplateAssetsPath, code));

        // generate template
        let tmp = template.replace(TemplateTarget, toHTML(enName, code.toLowerCase(), rawName, '../assets/'));

        // write template file
        writeFile(path.join(TemplateDistPath, enName + "FLag.vue"), tmp, () => {
            console.clear();
            progress++;
            console.log(progress, "/", length);
            if (progress === length) console.log("Generator has done.");
        });
    }
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