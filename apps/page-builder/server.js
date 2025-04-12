const { createServer } = require("https");
const next = require("next");
const fs = require("fs");

// Set the correct path for your app inside Nx workspace
const dev = false;
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT, 10) || 3000;

const sslOptions = {
  key: fs.readFileSync("./ssl/amla.io.key"),
  cert: fs.readFileSync("./ssl/amla.io.crt"),
};
const app = next({ dev, dir: "apps/page-builder" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(sslOptions, async (req, res) => {
    handle(req, res);
  }).listen(port, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(`> Ready on ${hostname}:${port} `);
  });
});
