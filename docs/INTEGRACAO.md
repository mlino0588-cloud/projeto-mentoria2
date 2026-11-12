# Checkout e acesso à comunidade

## O papel de cada parte

| Parte | Responsabilidade |
| --- | --- |
| Instagram | Atrair visitantes; link do perfil, Stories e campanhas para a página |
| Página de vendas | Explicar oferta, preço e datas; encaminhar para o checkout vigente |
| GitHub | Guardar e versionar o código |
| Vercel ou Hostinger | Hospedar os arquivos e disponibilizar o site por HTTPS |
| Kiwify | Receber pagamento e confirmar aprovação; disponibilizar eventos e acesso configurado |
| WhatsApp | Comunidade das participantes aprovadas desta edição |

Não é preciso colar o HTML na Kiwify. Cadastre a URL do site no produto, e use os links de checkout da Kiwify nos botões da página. A Kiwify também oferece personalização da página de pagamento; isso é separado desta página de vendas própria.

## Entrega inicial verificável

1. Configure o produto, as três ofertas e o suporte na Kiwify.
2. Na opção de entrega/área de membros escolhida, apresente as instruções de acesso somente após a liberação da compra aprovada. Confira o funcionamento na conta real.
3. Encaminhe todas as compradoras da mesma edição para a mesma comunidade, inclusive as que comprarem após o início.
4. Valide cada participante contra a relação de matrículas. Convite pode ser encaminhado a terceiros; o link isolado não controla pagamento.
5. Teste Pix pendente, aprovado, cartão recusado, reembolso e compra tardia. Um redirecionamento para a página de obrigado não é a confirmação do pagamento.

## Automação posterior por evento

O site não inclui um webhook fictício nem segredos no navegador. A automação depende da conta Kiwify, de um serviço com armazenamento e de um canal de envio autorizado. Não houve configuração de disparos ou mensagens nesta entrega.

O serviço deverá validar a autenticidade do evento conforme o mecanismo efetivamente oferecido pela Kiwify, validar produto/oferta e registrar o pedido com uma chave única. Eventos repetidos não podem duplicar matrícula ou boas-vindas. Depois de confirmar compra aprovada, deverá encerrar recuperação pendente e enfileirar confirmação/convite pelo canal escolhido. E-mail é uma alternativa para quem não recebe pelo WhatsApp.

Situações distintas: pagamento pendente, aprovado, recusado, reembolsado; convite pendente, enviado ou com falha; entrada confirmada ou ainda não confirmada. Abrir o convite não comprova ingresso. Adição automática direta em Comunidades exige prova de compatibilidade do conector e da conta reais.

Mensagens automatizadas e recuperação devem usar os contatos, permissões e recursos disponíveis na operação real. Primeiro verificar a recuperação nativa da Kiwify para evitar duas ferramentas contatando a mesma pessoa. Visita anônima à página não revela nome ou WhatsApp.

## Verificação antes do lançamento

- Preço, prazo e checkout concordam em todas as fases; links vencidos também ficam indisponíveis na Kiwify.
- Uma compra aprovada libera as orientações corretas, em todos os preços.
- Pix apenas gerado e cartão recusado não liberam acesso.
- Repetir o evento aprovado não duplica entrega.
- Uma compradora tardia recebe o escopo e o material anterior descritos na oferta, com os mesmos encerramentos da turma.
- Nome, suporte, termos, privacidade, garantia e materiais autorizados foram revisados pela responsável.

