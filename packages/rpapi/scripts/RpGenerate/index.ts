import * as fs from "fs";
import * as path from "path";

import { generateRpDictionaryFile } from "./RpDictionaryFileGenerator";
import { generateClientFile } from "./ClientFileGenerator";
import { generateServerFile } from "./ServerFileGenerator";


function parseRpDefinitions(pathToRpapiDir: string): Array<string> {
    const prNames = path.join(pathToRpapiDir, "procedures");

    return fs.readdirSync(path.join(prNames))
        .filter(file => file.endsWith(".p.ts"))
        .filter(file => fs.lstatSync(path.join(prNames, file)).isFile())
        .map(file => file.replace(".p.ts", ""));
}

function createTypesFileIfMissing(pathToRpapiDir: string) {
    const pathToTypesFile = path.join(pathToRpapiDir, "types.ts");

    if (fs.existsSync(pathToTypesFile)) {
        return;
    }

    const typesFileContent = "export default {}";
    fs.writeFileSync(pathToTypesFile, typesFileContent);
}

export { parseRpDefinitions, generateRpDictionaryFile, generateClientFile, generateServerFile};

export function rpGenerate(pathToRpapiDir: string): void {
    let rpNames = parseRpDefinitions(pathToRpapiDir);

    console.log("Found remote procedure definitions:")
    rpNames.forEach(rmName => console.log(rmName));
    console.log("----------------------");

    const pathToAgDir = path.join(pathToRpapiDir, ".ag");

    if (!fs.existsSync(pathToAgDir)) {
        fs.mkdirSync(pathToAgDir);
    }

    createTypesFileIfMissing(pathToRpapiDir);
    generateRpDictionaryFile(pathToAgDir, rpNames);
    generateClientFile(pathToAgDir, rpNames);
    generateServerFile(pathToAgDir, rpNames);

    console.log("Rpapi generation finished successfully.");
}
