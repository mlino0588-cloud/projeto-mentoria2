import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "../config.js";
import { publishErrors } from "../lib/offer.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
if (path.dirname(output) !== root || path.basename(output) !== "dist") throw new Error("Destino de build inválido.");
if (config.mode === "production") {
  const errors = publishErrors(config);
  if (errors.length) throw new Error(`Publicação bloqueada:\n- ${errors.join("\n- ")}`);
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of ["index.html", "styles.css", "app.js", "config.js", "obrigado.html", "assets", "lib"]) {
  await cp(path.join(root, file), path.join(output, file), { recursive: true });
}
console.log(`Build concluído em dist/ (${config.mode}).`);

