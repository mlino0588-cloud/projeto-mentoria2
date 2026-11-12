// Este arquivo é público. Nunca coloque senhas, tokens ou o convite privado do grupo aqui.
export default {
  mode: "preview", // Troque para "production" somente após npm run check:publish.
  title: "Projeto Mentoria", // Nome de trabalho; substituir pelo nome comercial aprovado.
  responsibleName: "",
  supportEmail: "",
  supportWhatsapp: "", // Ex.: 5544999999999, somente dígitos; atendimento, não comunidade.
  termsUrl: "",
  privacyUrl: "",
  previewOffer: "presale",
  dates: {
    opensOn: "2026-11-14", // Data confirmada; o horário ainda precisa ser definido.
    opensAt: null, // Formato: AAAA-MM-DDTHH:mm:ss-03:00. Sem horário presumido.
    liveAt: null,
    liveEndsAt: null,
    cohortStartsAt: null, // Sexta-feira a confirmar.
    salesCloseAt: null, // Exatamente 20 dias corridos após cohortStartsAt.
    supportEndsOn: "2026-12-24",
    communityEndsOn: "2027-01-24"
  },
  offers: {
    presale: { label: "Condição de pré-venda", price: 99, checkoutUrl: "" },
    live: { label: "Condição da live", price: 119, checkoutUrl: "" },
    regular: { label: "Inscrições", price: 189, checkoutUrl: "" }
  },
  // Ative apenas quando o escopo e o processo de entrega forem confirmados.
  deliveryReady: false,
  lateEntryPolicy: "", // Explique o acesso ao material anterior para quem entra após o início.
  // Foto e depoimentos reais são opcionais. Só use material autorizado.
  mentor: { name: "", bio: "", image: "" },
  testimonials: [] // [{ image: "assets/depoimento-01.webp", alt: "Transcrição acessível do depoimento real" }]
};
