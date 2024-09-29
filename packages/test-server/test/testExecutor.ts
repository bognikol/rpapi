import * as fs from "fs";
import * as path from "path";
import { ChildProcess, exec, execSync } from "child_process";
import kill from "tree-kill";
const RPAPI_DIR = path.join(__dirname, "..", "src", "api");
const PROCEDURES_DIR = path.join(RPAPI_DIR, "procedures");

let serverProcess: ChildProcess = null;

function clean(): void {
    if (serverProcess != null) {
        console.log("Killing server process")
        serverProcess.stdin.destroy();
        serverProcess.stdout.destroy();
        serverProcess.stderr.destroy();
        kill(serverProcess.pid, (err) => console.log(err));
    }
    console.log("Deleting rpapi ag files...")
    fs.rmSync(path.join(RPAPI_DIR, ".ag"), { recursive: true, force: true });
    fs.rmSync(path.join(RPAPI_DIR, "types.ts"), { force: true });
    fs.rmSync(path.join(PROCEDURES_DIR, "NewProcedure.p.ts"), { force: true });
}

async function sleep(ms: number): Promise<void> {
    await new Promise((r) => setTimeout(r, ms));
}

function printStep(message: string): void {
    console.log();
    console.log("===========================================================");
    console.log(message);
    console.log("-----------------------------------------------------------")
}

async function main(): Promise<void> {
    printStep("STEP 1: Cleaning any residual garbage")
    clean();

    printStep("STEP 2: Generating rpapi ag code");
    execSync("pnpm run rpapi add NewProcedure", { stdio: "inherit" });

    printStep("STEP 3: Starting node server that uses rpapi")
    serverProcess = exec("pnpm run start");
    serverProcess.stdout.setEncoding('utf8');
    serverProcess.stdout.on("data", function(data) {
        process.stdout.write(data.toString());
    });
    await sleep(5000);

    printStep("STEP 4: Running jest tests")
    execSync("pnpm run jest", { stdio: "inherit" });

    printStep("STEP 5: Cleaning up")
    clean();
}

main();
