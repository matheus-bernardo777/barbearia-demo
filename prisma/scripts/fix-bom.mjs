import { readFileSync, writeFileSync, existsSync } from "node:fs";

const path = "prisma/schema.prisma";

if (!existsSync(path)) {
  console.error(`[fix-bom] Arquivo não encontrado: ${path}`);
  process.exit(0); // não falha o build se não existir
}

let buf = readFileSync(path);
let txt = buf.toString("utf8");

// remove BOM no início, se existir
if (txt.charCodeAt(0) === 0xFEFF) {
  txt = txt.slice(1);
}

// também limpa BOM escondido em quebras de linha/acidental
txt = txt.replace(/\uFEFF/g, "");

// garante que a primeira linha começa com "generator"
const firstLine = txt.split(/\r?\n/, 1)[0] || "";
if (!firstLine.trimStart().startsWith("generator ")) {
  console.warn("[fix-bom] Aviso: primeira linha não começa com 'generator'. Continuando mesmo assim…");
}

writeFileSync(path, txt, { encoding: "utf8" });
console.log("[fix-bom] BOM removido (se existia).");
