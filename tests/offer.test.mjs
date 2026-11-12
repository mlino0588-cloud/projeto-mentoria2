import { test } from "node:test";
import assert from "node:assert/strict";
import original from "../config.js";
import { timestamp, getOfferState, countdownParts, checkoutIsValid, checkoutWithAttribution, publishErrors, scheduleErrors } from "../lib/offer.mjs";

// Datas e URLs abaixo são somente fixtures de teste; não configuram a campanha.
function fixture() {
  const config = structuredClone(original);
  Object.assign(config, { mode: "production", responsibleName: "Responsável teste", supportEmail: "suporte@example.org", deliveryReady: true, lateEntryPolicy: "Orientação de teste", termsUrl: "https://example.org/termos", privacyUrl: "https://example.org/privacidade" });
  Object.assign(config.dates, { opensAt: "2026-11-14T08:00:00-03:00", liveAt: "2026-11-20T20:00:00-03:00", liveEndsAt: "2026-11-20T22:00:00-03:00", cohortStartsAt: "2026-11-27T08:00:00-03:00", salesCloseAt: "2026-12-17T08:00:00-03:00" });
  for (const key of Object.keys(config.offers)) config.offers[key].checkoutUrl = `https://pay.kiwify.com.br/fixture-${key}`;
  return config;
}
test("a versão entregue nunca permite compra sem dados comerciais", () => {
  assert.equal(getOfferState(original, Date.parse("2026-11-16T12:00:00Z")).canBuy, false);
  assert.equal(getOfferState(original).countdown, null);
  assert.ok(publishErrors(original).length > 0);
});
test("antes da abertura, não oferece checkout e conta até a abertura real", () => {
  const c = fixture(), state = getOfferState(c, timestamp(c.dates.opensAt) - 1);
  assert.equal(state.status, "upcoming"); assert.equal(state.canBuy, false); assert.equal(state.countdown.target, timestamp(c.dates.opensAt));
});
test("as fronteiras comerciais trocam tanto o preço quanto o checkout", () => {
  const c = fixture();
  for (const [when, phase, price] of [[c.dates.opensAt, "presale", 99], [c.dates.liveAt, "live", 119], [c.dates.liveEndsAt, "regular", 189]]) {
    const state = getOfferState(c, timestamp(when));
    assert.equal(state.phase, phase); assert.equal(state.offer.price, price); assert.equal(state.canBuy, true); assert.ok(state.offer.checkoutUrl.endsWith(phase));
  }
  const closed = getOfferState(c, timestamp(c.dates.salesCloseAt));
  assert.equal(closed.status, "closed"); assert.equal(closed.canBuy, false); assert.equal(closed.countdown, null);
});
test("não reabre uma inscrição encerrada e não reinicia contador", () => {
  const c = fixture(), instant = timestamp(c.dates.salesCloseAt) + 7 * 86400000;
  assert.equal(getOfferState(c, instant).canBuy, false);
  assert.deepEqual(countdownParts(instant - 10, instant), ["00", "00", "00", "00"]);
  assert.deepEqual(countdownParts(instant + 90061000, instant), ["01", "01", "01", "01"]);
});
test("configuração incompleta ou cronologia incompatível bloqueia compras", () => {
  const c = fixture(); assert.deepEqual(publishErrors(c), []);
  c.offers.live.checkoutUrl = ""; assert.equal(getOfferState(c, timestamp(c.dates.opensAt)).canBuy, false);
  const other = fixture(); other.dates.salesCloseAt = "2026-12-18T08:00:00-03:00";
  assert.ok(scheduleErrors(other).some(error => error.includes("20 dias")));
  assert.equal(getOfferState(other, timestamp(other.dates.opensAt)).canBuy, false);
});
test("datas exigem fuso explícito e rejeitam calendário impossível", () => {
  assert.ok(Number.isNaN(timestamp("2026-11-14T08:00:00")));
  assert.ok(Number.isNaN(timestamp("2026-02-30T08:00:00-03:00")));
});
test("somente o domínio exato do checkout Kiwify é aceito", () => {
  assert.ok(checkoutIsValid("https://pay.kiwify.com.br/abc123"));
  for (const url of ["https://pay.kiwify.com.br.evil.example/a", "http://pay.kiwify.com.br/a", "javascript:alert(1)", "https://user:password@pay.kiwify.com.br/a", "https://pay.kiwify.com.br/"]) assert.equal(checkoutIsValid(url), false);
});
test("atribuição encaminha somente campanhas, preserva a URL da oferta e exclui dados pessoais", () => {
  const url = new URL(checkoutWithAttribution("https://pay.kiwify.com.br/abc?afid=original", "?utm_source=instagram&email=pessoa@example.org&cpf=123&redirect=https://evil.example"));
  assert.equal(url.searchParams.get("utm_source"), "instagram"); assert.equal(url.searchParams.get("afid"), "original");
  assert.equal(url.searchParams.has("email"), false); assert.equal(url.searchParams.has("cpf"), false); assert.equal(url.searchParams.has("redirect"), false);
});

