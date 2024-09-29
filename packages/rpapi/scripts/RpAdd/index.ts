import path from "path";
import fs from "fs";

import { rpGenerate} from "../RpGenerate";


function createRpapiProcedureStub(pathToRpapiDir: string, rpName: string): void {
    const pathToProcedureFile = path.join(pathToRpapiDir, "procedures", `${rpName}.p.ts`);

    const file = `import { Handler, SuccessStatus } from "@bognikol/rpapi";

export interface ${rpName}Request {
}

export interface ${rpName}Response {
    status: SuccessStatus;
}

export const ${rpName}: Handler<${rpName}Request, ${rpName}Response> = 
async (request: ${rpName}Request, token: string) => {
    return Promise.resolve({
        status: 200
    });
};
`;

    fs.writeFileSync(pathToProcedureFile, file);
}

function validateInput(pathToRpapiDir: string, rpName: string): void {
    const re = new RegExp("^[A-Z](([a-z0-9]+[A-Z]?)*)$");
    
    if (!re.test(rpName)) {
        console.log("ERROR: Remote procedure name must be in PascalCase.");
        process.exit(1);
    }

    const pathToProceduresDir = path.join(pathToRpapiDir, "procedures");

    if (!fs.existsSync(pathToProceduresDir)) {
        fs.mkdirSync(pathToProceduresDir);
    }

    const pathToProcedureFile = path.join(pathToProceduresDir, `${rpName}.p.ts`);

    if (fs.existsSync(pathToProcedureFile)) {
        console.log(`ERROR: Remote procedure with name ${rpName} already exists.`);
        process.exit(1);
    }
}

export function rpAdd(pathToRpapiDir: string, rpName: string): void {
    console.log(`Adding remote procedure ${rpName} stubs...`);

    validateInput(pathToRpapiDir, rpName);
    createRpapiProcedureStub(pathToRpapiDir, rpName);

    console.log("Regenerating Rpapi...")

    rpGenerate(pathToRpapiDir);

    console.log(`Remote Procedure ${rpName} successfully added.`)
}
