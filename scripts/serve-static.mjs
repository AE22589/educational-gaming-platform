import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const root = resolve("out");
const basePath =
  process.env.GITHUB_ACTIONS === "true" ? "/educational-gaming-platform" : "";
const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff2", "font/woff2"],
]);

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    let pathname = decodeURIComponent(url.pathname);
    if (basePath && pathname.startsWith(`${basePath}/`)) {
      pathname = pathname.slice(basePath.length);
    } else if (pathname === basePath && basePath) {
      pathname = "/";
    }

    const filePath = resolve(root, `.${pathname}`);
    if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
      response.writeHead(400).end("Bad request");
      return;
    }

    let target = filePath;
    let info = await stat(target).catch(() => null);
    if (info?.isDirectory()) {
      target = resolve(target, "index.html");
      info = await stat(target).catch(() => null);
    }
    if (!info?.isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }

    response.writeHead(200, {
      "content-length": info.size,
      "content-type": mimeTypes.get(extname(target)) ?? "application/octet-stream",
      "x-content-type-options": "nosniff",
    });
    createReadStream(target).pipe(response);
  } catch {
    response.writeHead(400).end("Bad request");
  }
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, "127.0.0.1");
