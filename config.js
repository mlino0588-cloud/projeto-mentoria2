// Este arquivo é público. Nunca coloque senhas, tokens ou o convite privado do grupo aqui.
export default {
  mode: "preview", // Troque para "production" somente após npm run check:publish.
  title: "Ritualize",
  responsibleName: "Aline Lino",
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
  mentor: {
    name: "Aline Lino",
    bio: "O Ritualize nasceu da minha experiência com mudanças de hábitos e da vontade de compartilhar esse caminho com outras mulheres.\n\nAcredito que a transformação acontece na rotina: no cuidado com a alimentação, com o corpo e com a forma como vivemos, todos os dias.\n\nMinha proposta é caminhar com você na construção de escolhas mais conscientes e hábitos possíveis. Com troca, apoio e constância, um passo de cada vez.",
    image: "assets/aline-lino-v1.webp"
  },
  testimonials: [] // [{ image: "assets/depoimento-01.webp", alt: "Transcrição acessível do depoimento real" }]
};
