# Projeto Mentoria

Página de vendas em **HTML, CSS e JavaScript**, sem dependências externas. Paleta `#FF422A`, branco e preto; fontes de sistema com preferência pela família nativa da Apple, quando disponível. Repositório preparado para Vercel ou hospedagem estática na Hostinger.

O nome “Projeto Mentoria” é provisório. Não há fotos, credenciais ou depoimentos inventados.

## Executar e verificar

Requer Node.js 18 ou superior.

```sh
npm run dev
```

Abra http://127.0.0.1:4173. Não é necessário `npm install`.

```sh
npm test
npm run build
npm run check:publish
```

`check:publish` informa os dados comerciais que faltam. É esperado que ele falhe na versão inicial; a prévia funciona e o build é permitido. Em `mode: "production"`, o build falha se esses dados não estiverem preenchidos. Isso evita publicar uma oferta ativa sem prazo, checkout ou processo de entrega.

## O que já está implementado

- Página responsiva com uma ação principal: a inscrição.
- Copy baseada no plano do projeto; FAQ acessível com `<details>`.
- Ofertas R$ 99, R$ 119 e R$ 189, exibindo apenas a fase vigente.
- Agendamento em horário de Brasília, troca de preço e link no mesmo instante, fechamento das compras e revalidação no clique.
- Contador de prazo fixo, sem reinício por visitante, somente quando todo o calendário está definido.
- Transmissão dos parâmetros de campanha presentes na URL ao checkout. Sem formulários, pixels ou cookies de publicidade.
- Seções de mentora e depoimentos ocultas até receber material real em `config.js`.
- Página `obrigado.html` com orientações, sem expor o convite da comunidade ou declarar pagamento aprovado sem verificação.
- Build estático e configuração Vercel com cabeçalhos de segurança.

## Calendário recuperado

| Evento | Definição registrada |
| --- | --- |
| Abertura da pré-venda | 14/11/2026; horário pendente |
| Pré-venda | R$ 99 |
| Live de lançamento | R$ 119; data e horários pendentes |
| Após a live | R$ 189 |
| Início da turma | Sexta-feira; data e horário pendentes |
| Encerramento das compras | Início da turma + 20 dias corridos |
| Fim do acompanhamento | 24/12/2026 |
| Fim do acesso ao grupo | 24/01/2027 |

Não reutilizar a sugestão antiga de 20/11 às 20h como confirmação. As datas em `tests/` são cenários artificiais e não são carregadas pelo site.

## Conectar a oferta real

Edite **`config.js`**:

1. Preencha o nome comercial, a responsável, o suporte e os endereços dos termos/privacidade aprovados.
2. Preencha `opensAt`, `liveAt`, `liveEndsAt`, `cohortStartsAt` e `salesCloseAt`. Formato obrigatório: `AAAA-MM-DDTHH:mm:ss-03:00`. O encerramento deve ser exatamente 20 dias depois do início, no mesmo horário.
3. Crie as três ofertas no mesmo produto Kiwify e coloque cada link `https://pay.kiwify.com.br/...` no respectivo `checkoutUrl`.
4. Defina `lateEntryPolicy`, com o acesso ao conteúdo anterior das alunas que entrarem depois do início.
5. Configure e teste a entrega na Kiwify; só então marque `deliveryReady: true`.
6. Rode `npm run check:publish`. Após corrigir as pendências, altere `mode` para `production`, teste e publique.

A validação de links verifica o endereço, não se o checkout está ativo nem se o valor corresponde à página. Confirme os três valores no painel e nos checkouts reais.

O contador e a troca do botão **não desativam ofertas na Kiwify**. Configure ou execute o encerramento dos links antigos também no painel. Defina o tratamento de Pix/boletos emitidos antes da virada. O relógio do navegador controla apenas a apresentação; a Kiwify deve impor o preço e a validade da cobrança.

## Fluxo de venda e entrega

```text
Instagram → esta página → checkout Kiwify
Compra aprovada na Kiwify → entrega de orientações/convite → comunidade WhatsApp
```

O pós-venda não está automatizado neste repositório. Página estática não verifica pagamento. Não colocar o link da comunidade, tokens ou chaves no código público; visitar `obrigado.html` não comprova compra.

Para a primeira versão, configure na área de membros da Kiwify as instruções de acesso pós-aprovação e mantenha conferência das matrículas. Para entrega automatizada por mensagem, use o evento autêntico de compra aprovada via webhook e um serviço no servidor/conector validado. Veja [docs/INTEGRACAO.md](docs/INTEGRACAO.md).

## GitHub e VS Code

Abra esta pasta no VS Code. O editor é opcional; o mesmo código pode ser editado pelo GitHub. Para criar e enviar um novo repositório privado com GitHub CLI autenticado:

```powershell
.\scripts\publish-github.ps1
```

O script usa `gh auth login` se necessário; não pede token em texto. Ele só adiciona os arquivos deste site ao commit. Caso já exista um remote `origin`, confira o destino em vez de sobrescrevê-lo.

## Vercel

1. Importe o repositório no painel da Vercel.
2. Framework: **Other**. Root Directory: a raiz do repositório. Build: `npm run build`. Output: `dist`.
3. A configuração está em `vercel.json`. A versão inicial abre como prévia, sem aceitar compras.
4. Para operar uma página comercial, use o plano permitido pela Vercel: Hobby é restrito a uso pessoal não comercial. Não há contratação nem implantação Vercel realizada por este código.

## Hostinger

Rode `npm run build` e envie **o conteúdo** de `dist/` para `public_html` no plano de hospedagem de sites, com HTTPS habilitado. Preserve os caminhos relativos e MIME types dos arquivos JavaScript (`.js` e `.mjs`). `vercel.json` só é aplicado na Vercel; configure os cabeçalhos equivalentes no servidor da Hostinger, conforme o plano. Não envie o diretório `.git`, testes ou dados da operação para `public_html`.

Não é obrigatório migrar para Hostinger: domínio, editor, repositório, hospedagem e checkout têm funções independentes.

## Fontes oficiais

- [Kiwify: cadastro de produto e entrega externa](https://ajuda.kiwify.com.br/pt-br/article/como-cadastrar-o-seu-produto-1lxh5g7/)
- [Kiwify: checkout builder](https://ajuda.kiwify.com.br/pt-br/article/como-funciona-o-checkout-builder-uileik/)
- [Kiwify: webhooks](https://ajuda.kiwify.com.br/pt-br/article/como-funcionam-os-webhooks-2ydtgl/)
- [Vercel: uso comercial e planos](https://vercel.com/docs/limits/fair-use-guidelines)

