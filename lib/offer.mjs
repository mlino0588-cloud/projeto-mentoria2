const OFFSET_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-03:00$/;
const DAY = 86400000;
export const OFFER_KEYS = ["presale", "live", "regular"];

export function timestamp(value) {
  if (typeof value !== "string" || !OFFSET_DATE.test(value)) return NaN;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return NaN;
  // Date.parse normaliza algumas datas impossíveis; rejeitá-las.
  return new Date(parsed - 3 * 3600000).toISOString().slice(0, 19) === value.slice(0, 19) ? parsed : NaN;
}

export function checkoutIsValid(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "pay.kiwify.com.br" &&
      url.pathname.length > 1 && !url.username && !url.password && !url.port;
  } catch { return false; }
}

export function scheduleErrors(config) {
  const d = config.dates;
  const fields = ["opensAt", "liveAt", "liveEndsAt", "cohortStartsAt", "salesCloseAt"];
  const errors = fields.filter(key => !Number.isFinite(timestamp(d[key])))
    .map(key => `dates.${key}: informe data e horário reais com -03:00.`);
  if (errors.length) return errors;
  const [open, live, end, start, close] = fields.map(key => timestamp(d[key]));
  if (d.opensAt.slice(0, 10) !== d.opensOn) errors.push("A abertura deve ocorrer em 14/11/2026, conforme o plano.");
  if (!(open < live && live < end && end <= close)) errors.push("Abertura, início/fim da live e encerramento devem estar em ordem.");
  if (!(open <= start && start < close)) errors.push("A turma deve começar após a abertura e antes do encerramento.");
  if (new Date(start - 3 * 3600000).getUTCDay() !== 5) errors.push("O início confirmado deve ser uma sexta-feira.");
  if (close - start !== 20 * DAY) errors.push("O encerramento deve ser início da turma + 20 dias corridos, no mesmo horário.");
  if (close > Date.parse(`${d.supportEndsOn}T23:59:59-03:00`)) errors.push("As compras não podem ultrapassar o fim do acompanhamento.");
  if (Date.parse(`${d.communityEndsOn}T00:00:00-03:00`) <= Date.parse(`${d.supportEndsOn}T00:00:00-03:00`)) errors.push("O acesso ao grupo deve terminar depois do acompanhamento.");
  return errors;
}

export function publishErrors(config) {
  const errors = scheduleErrors(config);
  if (!config.responsibleName.trim()) errors.push("Informe a responsável pela oferta.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.supportEmail)) errors.push("Informe um e-mail real de suporte.");
  for (const field of ["termsUrl", "privacyUrl"]) {
    try { if (new URL(config[field]).protocol !== "https:") throw new Error(); }
    catch { errors.push(`${field}: informe o endereço HTTPS do documento aprovado.`); }
  }
  if (!config.deliveryReady) errors.push("Configure e teste a entrega após a compra; marque deliveryReady.");
  if (!config.lateEntryPolicy.trim()) errors.push("Defina o acesso ao material anterior para entrada após o início.");
  for (const key of OFFER_KEYS) if (!checkoutIsValid(config.offers[key].checkoutUrl)) errors.push(`offers.${key}.checkoutUrl: informe o link real pay.kiwify.com.br.`);
  return errors;
}

export function getOfferState(config, now = Date.now()) {
  const ready = publishErrors(config).length === 0;
  const validSchedule = scheduleErrors(config).length === 0;
  let phase = OFFER_KEYS.includes(config.previewOffer) ? config.previewOffer : "presale";
  let status = "unconfigured";
  let countdown = null;
  if (validSchedule) {
    const d = config.dates;
    const open = timestamp(d.opensAt), live = timestamp(d.liveAt), end = timestamp(d.liveEndsAt), close = timestamp(d.salesCloseAt);
    if (now < open) { status = "upcoming"; phase = "presale"; countdown = { label: "A pré-venda começa em", target: open }; }
    else if (now >= close) { status = "closed"; }
    else if (now < live) { status = "open"; phase = "presale"; countdown = { label: "A live de lançamento começa em", target: live }; }
    else if (now < end) { status = "open"; phase = "live"; countdown = { label: "A condição da live termina em", target: end }; }
    else { status = "open"; phase = "regular"; countdown = { label: "As inscrições terminam em", target: close }; }
  }
  const canBuy = config.mode === "production" && ready && status === "open";
  return { status, phase, offer: config.offers[phase], countdown, canBuy, ready };
}

export function checkoutWithAttribution(base, search = "") {
  if (!checkoutIsValid(base)) return null;
  const target = new URL(base), incoming = new URLSearchParams(search);
  // Encaminha apenas a origem fornecida nesta visita. Nenhum cadastro/cookie oculto.
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src", "sck"]) {
    const value = incoming.get(key);
    if (value) target.searchParams.set(key, value.slice(0, 200));
  }
  return target.toString();
}

export function countdownParts(target, now = Date.now()) {
  let total = Math.max(0, Math.ceil((target - now) / 1000));
  const days = Math.floor(total / 86400); total %= 86400;
  const hours = Math.floor(total / 3600); total %= 3600;
  return [days, hours, Math.floor(total / 60), total % 60].map(value => String(value).padStart(2, "0"));
}
