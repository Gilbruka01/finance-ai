# FINANCE AI — Arquitetura técnica

Data: 23/11/2026. Estado: planejamento, sem implementação.

## 1. Status das decisões

- **DECISÃO APROVADA:** decisão expressamente definida pelo produto.
- **PROPOSTA TÉCNICA:** recomendação técnica documentada; depende de aprovação antes da implementação correspondente.
- **PENDÊNCIA DE DECISÃO:** escolha ou requisito ainda sem definição.

A autorização para criar esta documentação não representa aprovação automática das propostas. Este documento é a referência para limites dos componentes e para o registro de decisões. O modelo de dados está em [database.md](database.md), os controles em [security.md](security.md), as fases em [product-roadmap.md](product-roadmap.md) e a IA em [ai-strategy.md](ai-strategy.md).

## 2. Base aprovada do produto

**DECISÃO APROVADA:** FINANCE AI é um SaaS por assinatura, prioritariamente para pessoas físicas, atendendo também empresas desde o lançamento. Mercado inicial brasileiro, interface pt-BR, moeda inicial BRL e aplicação web responsiva para computadores e celulares.

**DECISÃO APROVADA — D01:** gestão financeira para pessoas físicas, famílias, MEIs, profissionais autônomos e pequenas empresas, com núcleo financeiro compartilhado e experiências específicas. O escopo contempla investimentos, planejamento, relatórios, projeções e IA integrada, além da gestão pessoal, familiar e empresarial. O detalhamento de instrumentos de investimento e métodos de projeção permanece pendente, sem retirar essas capacidades do escopo.

Cada usuário pode possuir seu espaço pessoal e participar de espaços familiares e empresariais. Os espaços mantêm dados isolados. A IA interpreta resultados financeiros determinísticos e somente realiza alterações com autorização explícita do usuário. São requisitos controle de acesso por workspace, PostgreSQL RLS, migrations versionadas, auditoria, escalabilidade, segurança e consideração da LGPD.

**DECISÃO APROVADA — stack:** Next.js App Router, React, TypeScript, Tailwind CSS, PostgreSQL, Supabase para infraestrutura inicial, autenticação e armazenamento, OpenAI API, GitHub e Codex. Open Finance será contratado por meio de provedores especializados; sua utilização não é presumida gratuita.

## 3. Organização e limites

**DECISÃO APROVADA — estrutura pretendida:**

```text
apps/web
packages/finance-core
packages/ai-engine
packages/integrations
packages/shared
supabase/migrations
supabase/functions
docs
```

Somente os cinco documentos existentes são atualizados nesta etapa; a estrutura acima não é uma declaração de pastas ou código já existentes.

**PROPOSTA TÉCNICA — monólito modular:** uma aplicação web e módulos com contratos explícitos. O processamento assíncrono pode executar separadamente, mas reutiliza regras e contratos do mesmo repositório. Separar serviços adicionais quando houver evidência de necessidade operacional.

| Componente | Responsabilidade proposta | Limite |
|---|---|---|
| apps/web | Interface, sessão, Route Handlers, Server Actions e composição dos casos de uso | Autorizar cada operação; componentes de cliente recebem somente dados necessários |
| finance-core | Valores monetários, lançamentos, transferências, obrigações, conciliação e cálculos | Sem dependência de Next.js, Supabase ou OpenAI; persistência através de interfaces |
| ai-engine | Contexto autorizado, ferramentas, propostas, avaliações e limites de IA | Não possui acesso irrestrito ao banco nem poder de aprovação |
| integrations | Adaptadores Supabase, Open Finance, OpenAI, cobrança e armazenamento | Isola SDKs e contratos externos; não duplica regras financeiras |
| shared | Tipos de contratos, validações de fronteira e erros comuns | Sem segredos, acesso a rede ou importação dos demais pacotes |
| supabase/migrations | Evolução futura de tabelas, restrições, funções e RLS | Fonte versionada do esquema, sem alterações manuais não rastreadas |
| supabase/functions | Entradas curtas para eventos, agendamento e consumidores de lotes | Validar identidade/origem; tarefas devem respeitar limites de execução |
| docs | Decisões, modelo, segurança, roadmap e IA | Manter mudanças correlatas consistentes |

Dependências propostas: finance-core depende apenas de shared; ai-engine depende de shared e contratos de finance-core; integrations implementa contratos desses módulos; web e funções compõem os adaptadores. Evitar ciclos e imports de adaptadores em regras de domínio. Compatibilidade entre runtime web e Edge Functions exige validação posterior; não pressupor suporte idêntico a bibliotecas Node.js.

**PROPOSTA TÉCNICA:** pnpm workspaces; SDK Supabase e funções transacionais restritas no PostgreSQL, sem ORM adicional no início. Tipos serão gerados a partir do esquema versionado. Invariantes financeiras e de isolamento devem ser garantidas no banco além das validações de domínio.

## 4. Workspaces e módulos funcionais

**DECISÃO APROVADA — D02:** três tipos de workspace: pessoal privado e individual, sem convidados; familiar compartilhado, com owner, admin, editor e viewer; empresarial compartilhado, com permissões granulares personalizáveis por área. O papel e as permissões são locais ao workspace; participação em espaços compartilhados não concede acesso aos espaços pessoais dos membros.

Owner tem controle integral do workspace e é o único que administra sua assinatura. Admin administra operações e participantes dentro das permissões concedidas; editor cria e edita registros autorizados; viewer somente lê. A edição não permite alterar diretamente lançamentos confirmados, que seguem D03. Operações financeiras seguem permissões individuais, sem exigência geral de dupla aprovação.

Convites são individuais por e-mail, com validade, uso único e aceitação obrigatória. Remoção revoga imediatamente o acesso e preserva registros/auditoria. Transferência de propriedade exige autorização do owner atual e aceitação do novo owner. Compartilhamento pessoal → familiar ocorre somente por cópia independente: original privado, sem sincronização automática e sem concessão de acesso à origem.

**PROPOSTA TÉCNICA:** unicidade do workspace pessoal ativo por proprietário e estruturas de permissões, convites, cópias e transferência descritas em [database.md](database.md). Catálogo de áreas e precedência entre permissões ainda precisam de detalhamento; não estão implicitamente aprovados por D02.

**PROPOSTA TÉCNICA — decomposição funcional do escopo aprovado:**

| Módulo | Compartilhado | Pessoal | Familiar | Empresarial |
|---|---|---|---|---|
| Identidade e espaços | Sessão e seleção explícita do workspace | Proprietário único | Convites e papéis | Convites e permissões por área |
| Contas e movimentações | Contas, categorias, entradas, saídas e transferências internas | Organização privada | Organização compartilhada e cópias independentes | Organização por empresa |
| Planejamento | Orçamentos, recorrências e projeções | Metas pessoais | Metas familiares | Centros de custo e obrigações |
| Investimentos | Acompanhamento e relatórios; sem ordens | Carteira pessoal | Registros compartilhados autorizados | Carteira empresarial |
| Cartões | Compras, parcelas, faturas e liquidação | Cartões pessoais | Registros familiares | Cartões empresariais |
| Importação e conciliação | Arquivos, deduplicação e revisão | Conexões PF | Titularidade e compartilhamento a detalhar | Conexões PJ e representação autorizada |
| Relatórios | Saldos, categorias, fluxo e projeções | Visão pessoal | Visão familiar | Visão gerencial por área autorizada |
| IA | Perguntas, sugestões e autorização explícita | Dados pessoais | Dados do espaço familiar | Dados das áreas permitidas |
| Assinaturas | Plano, limites e consumo; gestão exclusiva do owner | Oferta a detalhar | Oferta a detalhar | Oferta a detalhar |
| Privacidade e auditoria | Histórico e direitos | Original privado | Cópia sem acesso à origem | Responsabilidades organizacionais |

**DECISÃO APROVADA — D01:** a primeira versão não executa movimentação de dinheiro, iniciação de pagamentos, emissão de notas fiscais, folha de pagamento, escrituração contábil oficial, ERP completo ou ordens de investimento. Registrar uma transferência é registrar um fato financeiro, sem mover dinheiro no banco. Investimentos fazem parte da gestão e não autorizam execução de ordens. Exclusões adicionais sugeridas anteriormente não são tratadas como decisões aprovadas.

## 5. Fluxos e consistência

### Requisição do usuário

Navegador → sessão Supabase validada no servidor → associação ativa ao workspace → caso de uso → persistência com contexto do usuário e RLS → resultado mínimo para a interface.

O workspace solicitado é validado; não basta aceitar um identificador enviado pelo navegador. Server Actions e endpoints são superfícies de autorização independentes. A documentação do [Next.js sobre segurança de dados](https://nextjs.org/docs/app/guides/data-security) fundamenta a concentração do acesso em uma camada de servidor e a redução dos dados enviados ao cliente.

### Alteração financeira

**DECISÃO APROVADA — D03:** usar partidas dobradas internas; cada lançamento confirmado equilibra débitos/créditos. O razão mantém rastreabilidade, sem representar escrituração oficial. Lançamentos válidos são confirmados automaticamente após as validações; inválidos, incompletos ou suspeitos de duplicidade são rejeitados ou ficam pendentes, sem afetar saldos confirmados. A confirmação automática não dispensa autorização explícita de alterações pela IA.

Lançamentos confirmados são preservados: correções por estorno e novo lançamento, com autoria, justificativa e histórico. Transferências ocorrem somente entre contas do mesmo workspace, sem receita/despesa. Não existe transferência direta entre workspaces; a cópia pessoal → familiar é compartilhamento de informação independente, não transferência financeira.

**DECISÃO APROVADA — saldos:** armazenar e atualizar diretamente os saldos a cada movimentação confirmada, com atualização atômica, idempotência, conciliação periódica com o razão e possibilidade de reconstrução pelos lançamentos confirmados. Precisão decimal, isolamento e transações são obrigatórios.

**PROPOSTA TÉCNICA — fluxo:** validar permissão efetiva por área, autorização IA quando aplicável, valores, moeda, duplicidade e versão esperada → persistir lançamento balanceado, atualizar saldos armazenados e gravar auditoria na mesma transação → registrar outbox quando necessário → confirmar atomicamente. Retentativas não reaplicam deltas nos saldos. Não fazer chamadas externas dentro de uma transação longa. Mecanismo de concorrência e frequência da conciliação permanecem detalhes a validar.

### Open Finance

Criar sessão de conexão no provedor → redirecionar para jornada oficial de consentimento/autenticação → receber retorno verificado → armazenar identificadores e referência segura ao segredo → sincronizar por jobs → normalizar dados → detectar duplicatas → conciliar → publicar registros válidos.

Cada conexão e consentimento pertence a um workspace, mesmo quando a pessoa administra vários. PF e PJ precisam ser avaliados separadamente na cobertura do fornecedor. Revogação interrompe novas coletas; tratamento dos dados já coletados segue a política de retenção e base legal aplicável. O [Banco Central](https://www.bcb.gov.br/meubc/faqs/p/como-levar-seus-dados-de-um-banco-para-outro) informa a necessidade de consentimento para compartilhamento no Open Finance.

### Assinaturas

**DECISÃO APROVADA — D02:** somente owner administra a assinatura do workspace. **PROPOSTA TÉCNICA:** cobrança por workspace, separada dos lançamentos financeiros do usuário. Eventos de cobrança são verificados e idempotentes; o estado local é reconciliado com o provedor. O cliente não pode elevar seu próprio plano. Inadimplência limita funcionalidades conforme política comercial, sem apagar registros. Ofertas pessoais, familiares e empresariais, bundles, preços e limites permanecem pendentes em D07.

## 6. Assíncrono, falhas e escalabilidade

**PROPOSTA TÉCNICA:** fila persistente no PostgreSQL, outbox transacional e consumidores em lotes pequenos. Entrega é pelo menos uma vez; garantir efeito idempotente, sem prometer execução exatamente uma vez. Jobs têm workspace, tipo, referência de payload, tentativas, prazo de lease, próxima execução, estado e chave de deduplicação. Falhas permanentes vão para revisão, com reprocessamento controlado.

Edge Functions são candidatas para lotes curtos, webhooks e agendamento. Seus [limites oficiais](https://supabase.com/docs/guides/functions/limits) precisam ser confrontados com carga, tempo e memória antes de selecionar o executor. Tarefas longas podem exigir worker dedicado; hospedagem e eventual nova pasta serão decisões posteriores, sem alterar a estrutura aprovada nesta etapa.

Manter aplicação web sem estado local persistente; usar pool de conexões; paginar resultados; indexar por workspace e período; limitar concorrência por cliente e provedor. Cache financeiro precisa incorporar workspace e autorização, com invalidação após alterações. Agregados podem ser reconstruídos; não substituir a fonte de verdade por cache ou saída de IA.

Escalar mediante métricas: latência de consultas, atraso da fila, taxa de erros, saturação de conexões e custo por workspace. Particionamento, réplicas e serviços separados dependem de medições.

## 7. Operação e qualidade

**PROPOSTA TÉCNICA:** ambientes separados de desenvolvimento, homologação e produção; dados sintéticos fora de produção; secrets isolados; CI com tipos, lint, testes de domínio, integração RLS, migrations e jornadas críticas. Implantação futura por pipeline revisado, com migrations compatíveis e estratégia de correção progressiva.

Observar erros, latência, atraso de sincronização, idade dos dados, custo de IA, falhas de autorização e restauração. Definir responsáveis por incidentes e rotinas de revisão de dependências. GitHub e Codex não devem receber segredos ou extratos reais em prompts, logs ou fixtures.

## 8. Registro de decisões

Os identificadores abaixo são usados nos demais documentos. D01–D03 são **DECISÃO APROVADA**; seus requisitos não transformam estruturas de banco ou detalhes de implementação em decisões aprovadas.

| ID | Status | Conteúdo aprovado |
|---|---|---|
| D01 | DECISÃO APROVADA | Gestão pessoal, familiar e empresarial para PF, famílias, MEIs, autônomos e pequenas empresas; investimentos, planejamento, relatórios, projeções e IA; exclusões da primeira versão descritas na seção 4 |
| D02 | DECISÃO APROVADA | Três tipos de workspace; papéis e granularidade empresarial; cópia pessoal/familiar independente; convites, revogação imediata, propriedade aceita e assinatura exclusiva do owner; sem dupla aprovação geral |
| D03 | DECISÃO APROVADA | Partidas dobradas, estorno e novo lançamento, confirmação automática válida, transferências internas, saldos armazenados atômicos e conciliáveis, precisão decimal e autorização IA |

**PENDÊNCIA DE DECISÃO:** D04–D12 permanecem abertas. As sugestões anteriores abaixo são preservadas como **PROPOSTA TÉCNICA**, sem decisão, ampliação de escopo ou início de trabalho em D04.

| ID | Decisão | Proposta ou critério |
|---|---|---|
| D04 | Ferramentas de persistência e monorepo | pnpm, SDK Supabase e funções transacionais; sem ORM inicial |
| D05 | Executor e hospedagem | Web hospedada e fila PostgreSQL; validar Edge Functions versus worker |
| D06 | Provedor Open Finance | Cobertura PF/PJ, contrato, consentimento, qualidade, segurança, SLA e custo |
| D07 | Cobrança e planos | Assinatura por workspace; escolher provedor, quotas e política de inadimplência |
| D08 | IA | Modelos, orçamento, contexto, retenção, limiares de qualidade e autorizações |
| D09 | Privacidade e requisitos jurídicos | Bases legais, responsabilidades, retenção, transferências internacionais e público etário |
| D10 | Continuidade | Região, disponibilidade, RPO/RTO, backups e orçamento operacional |
| D11 | Políticas financeiras | Arredondamento, datas, fechamento, parcelamento e reconhecimento de despesas |
| D12 | Metas e calendário | SLOs, desempenho, acessibilidade, capacidade, equipe e datas de entrega |

**PENDÊNCIA DE DECISÃO — detalhamento sem reabrir D01–D03:** cobertura de instrumentos e fontes de investimento; métodos de projeção; catálogo de áreas empresariais; seleção de campos/anexos na cópia familiar e seu tratamento nos relatórios; titularidade de conexões compartilhadas; frequência e procedimento de reparo da conciliação de saldos. Nenhuma dessas lacunas autoriza implementação nesta tarefa.

## 9. Riscos técnicos principais

| Risco | Mitigação proposta | Dependência |
|---|---|---|
| Vazamento entre espaços | RLS, FKs compostas, testes adversariais, cache e arquivos segregados | D02 |
| Saldos incorretos | Razão balanceado, precisão decimal, transações, reconciliação e estornos | D03/D11 |
| Open Finance indisponível ou caro | Adaptador substituível, contrato medido, limites e importação alternativa | D06 |
| IA incorreta ou onerosa | Ferramentas restritas, avaliações, quotas e confirmação vinculada à proposta | D08 |
| Dependência de fornecedor | Domínio desacoplado, exportação e restauração testadas | D04/D05/D10 |
| Jobs duplicados ou interrompidos | Idempotência, lease, retentativas e fila de falhas | D05 |
| Escopo empresarial excessivo | Critérios explícitos de lançamento e fases com aceite | D01/D12 |

Fontes técnicas consultadas em 23/11/2026. Custos, versões, limites e contratos devem ser revalidados no momento da implementação.
