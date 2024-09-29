import * as path from "path"
import * as fs from "fs"

import { Command } from "commander";

import { rpAdd } from "./RpAdd";
import { rpGenerate } from "./RpGenerate";

enum RpapiChannel {
    Http = "http",
    WebSockets = "ws"
}

interface RpapiConfig {
    channel: RpapiChannel;
    dir: string;
}

function extractRpapiConfigFromPackageJson(): RpapiConfig {
    const pathToPackageJson = path.join(process.cwd(), "package.json");

    if (!fs.existsSync(pathToPackageJson)) {
        console.log("ERROR: Cannot find local package.json. Change working directory in your terminal to package root where package.json is present.");
        process.exit(1);
    }

    const stringContent = fs.readFileSync(pathToPackageJson).toString();
    const jsonContent = JSON.parse(stringContent);

    if (!jsonContent.hasOwnProperty("rpapi")) {
        console.log("ERROR: package.json does not contain RPAPI configuration.");
        process.exit(1);
    }

    const rpapiConfig = jsonContent["rpapi"];

    const channel = rpapiConfig["channel"];

    if (channel != "http") {
        console.log(`ERROR: Value ${channel} invalid for property channel. Please use 'http'. Check package.json.`);
        process.exit(1);
    }

    let dir = "rpapi";
    if (rpapiConfig.hasOwnProperty("dir")) {
        dir = rpapiConfig["dir"];
    }

    const dirAbsPath = path.join(process.cwd(), dir);
    
    if (!fs.existsSync(dirAbsPath)) {
        fs.mkdirSync(dirAbsPath);
    }

    return {
        channel,
        dir: dirAbsPath
    }
}

function main(): void {
    const rpapiConfig = extractRpapiConfigFromPackageJson();

    const program = new Command();

    program
        .name("rpapi")
        .description("Rpapi CLI for generating client and server stubs and adding new remote procedures.")
        .version("1.0.0")

    program.command("add")
        .description("add remote procedure")
        .argument("<ProcedureName>", "procedure name in PascalCase")
        .action((name) => {
            rpAdd(rpapiConfig.dir, name);
        });

    program.command("generate")
        .description("recreate client and server auto-generated code")
        .action(() => {
            rpGenerate(rpapiConfig.dir);
        });

    program.parse(); 
}

main();
