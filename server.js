// Serveur Node.js de NotePro — aucune dépendance. Lancer : node server.js
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, "public");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const rel = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname);
  const file = path.normalize(path.join(PUBLIC, rel));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end("Interdit"); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Introuvable"); }
    const name = path.basename(file);
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(file)] || "application/octet-stream",
      // le service worker, le manifest et la page ne doivent jamais rester en vieux cache
      "Cache-Control": ["sw.js", "manifest.webmanifest", "index.html"].includes(name) ? "no-cache" : "public, max-age=86400",
    });
    res.end(buf);
  });
}).listen(PORT, () => console.log(`NotePro tourne sur http://localhost:${PORT}`));
