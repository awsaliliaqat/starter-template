// A tiny web server for your project.
//
// You do NOT need to edit this file. It just serves the files in your public/
// folder. Edit public/index.html, public/styles.css and public/script.js to
// build your site — this server takes care of the rest.
//
// It works the same on your computer (http://localhost:3000) and on the course
// server (where your app lives under a path like /s/student1).

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

// When deployed, your app is served under a path like "/s/student1". On your
// own computer this is empty, so your site is simply at http://localhost:3000/.
const BASE_PATH = process.env.APP_BASE_PATH || "";

const PUBLIC_DIR = path.join(__dirname, "public");

// Map file extensions to the right content type so browsers render them well.
const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
  // Drop any query string, and remove the deploy base path so the same code
  // works both locally and when deployed.
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (BASE_PATH && urlPath.startsWith(BASE_PATH)) {
    urlPath = urlPath.slice(BASE_PATH.length) || "/";
  }
  if (urlPath === "/") urlPath = "/index.html";

  // Work out which file to serve, and make sure it stays inside public/
  // (this blocks sneaky "../" paths from reaching other files).
  const filePath = path.join(PUBLIC_DIR, urlPath);
  if (filePath !== PUBLIC_DIR && !filePath.startsWith(PUBLIC_DIR + path.sep)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        "<h1>404 — Page not found</h1><p>Check the file name in your <code>public/</code> folder.</p>"
      );
      return;
    }
    const type =
      CONTENT_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(
    `Your site is running on port ${PORT}${BASE_PATH ? " under " + BASE_PATH : ""}`
  );
});
