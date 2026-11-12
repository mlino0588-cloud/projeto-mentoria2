import config from "./config.js";
import { getOfferState, countdownParts, checkoutWithAttribution, timestamp } from "./lib/offer.mjs";

const $ = id => document.getElementById(id);
const money = value => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
let lastState = "";

document.querySelectorAll("[data-title]").forEach(el => { el.textContent = config.title; });
document.title = `${config.title} — Você não precisa fazer isso sozinha.`;
if (config.responsibleName) { $("responsible").textContent = `Responsável: ${config.responsibleName}`; $("responsible").hidden = false; }
if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.supportEmail)) { $("support").href = `mailto:${config.supportEmail}`; $("support").hidden = false; }
else if (/^55\d{10,11}$/.test(config.supportWhatsapp)) { $("support").href = `https://wa.me/${config.supportWhatsapp}`; $("support").hidden = false; }
function httpsUrl(value) { try { return new URL(value).protocol === "https:"; } catch { return false; } }
for (const [id, field] of [["terms", "termsUrl"], ["privacy", "privacyUrl"]]) {
  if (httpsUrl(config[field])) { $(id).href = config[field]; $(id).hidden = false; }
}
if (config.lateEntryPolicy) { $("late-entry-policy").textContent = config.lateEntryPolicy; $("late-entry-policy").hidden = false; }

// Nenhum depoimento ou identidade fictícia é criado. Se não há material real, a seção não aparece.
if (config.mentor.name && config.mentor.bio && config.mentor.image) {
  $("mentor-title").textContent = config.mentor.name;
  $("mentor-bio").textContent = config.mentor.bio;
  $("mentor-image").src = config.mentor.image;
  $("mentor-image").alt = config.mentor.name;
  $("mentor-section").hidden = false;
}
for (const item of config.testimonials) {
  if (!item.image || !item.alt) continue;
  const image = document.createElement("img");
  image.src = item.image; image.alt = item.alt; image.loading = "lazy";
  $("testimonials").append(image); $("testimonials-section").hidden = false;
}

function render() {
  const now = Date.now();
  const state = getOfferState(config, now);
  const signature = `${state.status}:${state.phase}:${state.canBuy}`;
  const preview = config.mode !== "production" || !state.ready;
  $("preview-note").hidden = !preview;
  if (signature !== lastState) {
    document.querySelectorAll("[data-price]").forEach(el => { el.textContent = money(state.offer.price); });
    document.querySelectorAll("[data-offer-label]").forEach(el => { el.textContent = state.offer.label; });
    $("price-value").textContent = state.offer.price;
    const button = $("checkout");
    button.removeAttribute("href");
    button.setAttribute("aria-disabled", String(!state.canBuy));
    button.tabIndex = state.canBuy ? 0 : -1;
    if (state.canBuy) {
      button.href = checkoutWithAttribution(state.offer.checkoutUrl, location.search);
      button.innerHTML = 'Quero garantir minha participação <span aria-hidden="true">↗</span>';
      $("checkout-status").textContent = "Você será direcionada ao checkout da Kiwify.";
    } else if (state.status === "closed") {
      button.textContent = "Inscrições encerradas";
      $("checkout-status").textContent = "As inscrições desta edição terminaram.";
    } else if (state.status === "upcoming" || now < Date.parse(`${config.dates.opensOn}T00:00:00-03:00`)) {
      button.textContent = "Pré-venda em 14/11";
      $("checkout-status").textContent = "As inscrições ainda não foram abertas.";
    } else {
      button.textContent = "Inscrições em preparação";
      $("checkout-status").textContent = "A abertura será anunciada nos canais oficiais do projeto.";
    }
    lastState = signature;
  }
  $("countdown").hidden = !state.countdown;
  $("date-stamp").hidden = !!state.countdown;
  if (state.countdown) {
    $("timer-label").textContent = state.countdown.label.toUpperCase();
    $("launch-copy").textContent = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(state.countdown.target);
    $("launch-sub").textContent = "Horário de Brasília.";
    countdownParts(state.countdown.target, now).forEach((value, i) => { $(["days", "hours", "minutes", "seconds"][i]).textContent = value; });
  } else if (state.status === "closed") {
    $("timer-label").textContent = "EDIÇÃO NOVEMBRO / DEZEMBRO";
    $("launch-copy").textContent = "As inscrições desta edição foram encerradas.";
    $("launch-sub").textContent = "Acompanhamento até 24/12. Grupo disponível até 24/01.";
    $("date-stamp").hidden = true;
  } else if (now >= Date.parse(`${config.dates.opensOn}T00:00:00-03:00`)) {
    $("launch-copy").textContent = "Acompanhe a abertura nos canais oficiais.";
    $("launch-sub").textContent = "A data da live e o início da turma serão anunciados.";
    $("date-stamp").hidden = true;
  }
  const startsAt = timestamp(config.dates.cohortStartsAt);
  if (Number.isFinite(startsAt) && now >= startsAt && state.status !== "closed") $("launch-sub").textContent = "A turma já começou. Você ainda pode entrar enquanto as inscrições estiverem abertas.";
}
$("checkout").addEventListener("click", event => {
  // Revalidar no próprio clique evita usar a condição anterior na virada da oferta.
  render();
  const state = getOfferState(config);
  if (!state.canBuy) { event.preventDefault(); return; }
  // Evento local, sem identidade e sem integração automática com pixels ou mensagens.
  window.dispatchEvent(new CustomEvent("mentoria:checkout-click", { detail: { phase: state.phase, price: state.offer.price } }));
});
const dialog = $("privacy-dialog");
$("privacy-info").addEventListener("click", () => dialog.showModal());
dialog.querySelectorAll("button").forEach(button => button.addEventListener("click", () => dialog.close()));
render();
setInterval(render, 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
