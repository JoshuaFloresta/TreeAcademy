import { spawn } from "node:child_process";

const processes = [
  spawn(process.execPath, ["--watch", "--watch-path=.env", "server/index.js"], { stdio: "inherit" }),
  spawn(process.execPath, ["node_modules/vite/bin/vite.js"], { stdio: "inherit" }),
];

let stopping = false;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of processes) {
    if (!child.killed) child.kill();
  }
  process.exit(exitCode);
}

for (const child of processes) {
  child.on("error", (error) => {
    console.error("Unable to start local development services:", error);
    stop(1);
  });
  child.on("exit", (code, signal) => {
    if (!stopping) {
      console.error(`A development service stopped (${signal || `exit code ${code}`}).`);
      stop(code || 1);
    }
  });
}

process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
