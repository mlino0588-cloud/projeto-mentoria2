import config from "../config.js";
import { publishErrors } from "../lib/offer.mjs";
const errors = publishErrors(config);
if (errors.length) {
  console.error("Configuração comercial pendente:\n- " + errors.join("\n- "));
  process.exitCode = 1;
} else console.log("Configuração preenchida. Confira os valores e a validade de cada oferta no painel Kiwify antes de ativar mode: production.");

