import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { resolve } from "node:path";

function parsePort(args) {
  const index = args.findIndex((arg) => arg === "--port" || arg === "-p");
  const value = index >= 0 ? args[index + 1] : args.find((arg) => arg.startsWith("--port="))?.split("=")[1];
  const port = Number(value ?? process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid port: ${value}`);
  }
  return port;
}

function isPortAvailable(port) {
  return new Promise((resolveAvailability, reject) => {
    const server = createServer();
    server.once("error", (error) => {
      if (error.code === "EADDRINUSE" || error.code === "EACCES") {
        resolveAvailability(false);
      } else {
        reject(error);
      }
    });
    server.listen({ host: "127.0.0.1", port, exclusive: true }, () => {
      server.close((error) => error ? reject(error) : resolveAvailability(true));
    });
  });
}

async function choosePort(requestedPort) {
  for (let port = requestedPort; port <= 65535; port += 1) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No free local port is available from ${requestedPort} onward.`);
}

async function main() {
  const userArgs = process.argv.slice(2);
  const requestedPort = parsePort(userArgs);
  const port = await choosePort(requestedPort);
  const nextArgs = userArgs.filter((arg, index) => {
    if (arg === "--port" || arg === "-p") return false;
    if (index > 0 && (userArgs[index - 1] === "--port" || userArgs[index - 1] === "-p")) return false;
    return !arg.startsWith("--port=");
  });

  if (port !== requestedPort) {
    console.log(`Port ${requestedPort} is busy; using port ${port} instead.`);
  }
  console.log(`Shop preview: http://localhost:${port}/shop/`);

  const nextCli = resolve("node_modules/next/dist/bin/next");
  const child = spawn(
    process.execPath,
    [nextCli, "dev", "--webpack", "--hostname", "127.0.0.1", "--port", String(port), ...nextArgs],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PORT: String(port),
        NEXT_DEV_DIST_DIR: `.next-dev-${port}`,
      },
      stdio: "inherit",
    },
  );

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => child.kill(signal));
  }
  child.on("error", (error) => {
    console.error(`Could not start Next.js: ${error.message}`);
    process.exitCode = 1;
  });
  child.on("exit", (code, signal) => {
    process.exitCode = code ?? (signal ? 1 : 0);
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
