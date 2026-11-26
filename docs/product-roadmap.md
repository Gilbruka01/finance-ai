# FINANCE AI — Roadmap de desenvolvimento

Data: 23/11/2026. Estado: planejamento; não constitui autorização para implementar ou contratar serviços.

## 1. Compromissos e status

**DECISÃO APROVADA:** SaaS por assinatura, Brasil, pt-BR, BRL, web responsiva, prioridade para PF e suporte a PF/PJ desde o lançamento; espaços isolados; stack e estrutura descritas em [architecture.md](architecture.md); IA integrada a dados reais. Conforme D06, o lançamento comercial terá OFX/CSV e cadastro manual de contas e movimentações; Open Finance automático será avaliado posteriormente e não bloqueia o lançamento.

| Decisão | Status | Requisitos para as futuras fases |
|---|---|---|
| D01 | DECISÃO APROVADA | Gestão pessoal, familiar e empresarial para PF, famílias, MEIs, autônomos e pequenas empresas; investimentos, planejamento, relatórios, projeções e IA; exclusões explícitas da primeira versão |
| D02 | DECISÃO APROVADA | Pessoal privado; familiar compartilhado; empresarial com permissões por área; cópia independente; convites aceitos; revogação imediata; transferência de propriedade autorizada e aceita; assinatura exclusiva do owner; sem dupla aprovação geral |
| D03 | DECISÃO APROVADA | Partidas dobradas, estorno e novo lançamento, confirmação automática válida, transferências internas, saldos armazenados atômicos, idempotência, conciliação e reconstrução pelo razão |
| D04 | DECISÃO APROVADA | D04.1 pnpm workspaces; D04.2 Supabase SDK; D04.3 funções transacionais PostgreSQL nas operações financeiras críticas; D04.4 sem ORM inicial, com possível reavaliação futura |

**DECISÃO APROVADA — D05.1:** Render para hospedagem inicial da aplicação Next.js; desenvolvimento local sem contratação obrigatória de hospedagem; produção em instância paga dimensionada por testes de desempenho, segurança e capacidade. O banco permanece no Supabase PostgreSQL. Isolamento, autenticação, autorização e proteção dos dados devem ser preservados; arquitetura preparada para evolução/migração, evitando dependências desnecessárias. Nenhum plano comercial específico está aprovado.

**DECISÃO APROVADA — D09:** lançamento exclusivo para usuários com 18 anos completos ou mais. Educação financeira supervisionada para menores é evolução condicionada às validações jurídicas e técnicas e à revisão de D02/D08. Desenvolvimento e testes usam dados sintéticos. Antes do lançamento comercial, versionar documentos jurídicos e políticas e distinguir o teste gratuito do direito de arrependimento. Antes de operar comercialmente com dados reais, concluir revisão jurídica, regulatória, fiscal, contratual e de segurança. As pendências e os requisitos completos constam de [security.md](security.md).

**DECISÕES APROVADAS — D12: entrega e critérios de aceite**

| ID | Decisão |
|---|---|
| D12.1 | Implementar incrementalmente. Cada etapa exige testes, validação e aprovação humana antes de avançar. |
| D12.2 | Preservar a sequência e os critérios de passagem das fases 0–8 da seção 3. |
| D12.3 | Planejar 24 semanas de referência para as fases 1–7: fundação (3), núcleo financeiro (4), jornadas (5), importação (3), IA (4), cobrança e piloto (3) e lançamento (2). O início depende de autorização explícita e da resolução das pendências bloqueadoras. A fase 0 precede esse período e a fase 8 é posterior. |
| D12.4 | Desenvolvimento individual com auxílio de ChatGPT e Codex, recorrendo a especialistas quando necessário. A responsabilidade e a aprovação são humanas. |
| D12.5 | Metas de latência no percentil 95: API até 500 ms, registro financeiro até 1 s, relatórios comuns até 2 s, LCP até 2,5 s, início da resposta da IA até 5 s e prévia de importação de 1.000 registros até 30 s. |
| D12.6 | Validar capacidade inicial para 1.000 cadastrados, 200 ativos por dia e 50 usuários simultâneos. Testar pico de 100 simultâneos. |
| D12.7 | Medir separadamente a disponibilidade do núcleo financeiro e da IA. Adotar como objetivos 99,5% de disponibilidade mensal, RPO de 1 hora e RTO de 4 horas. Testar restauração mensalmente e antes do lançamento, conforme D10. |
| D12.8 | Buscar WCAG 2.2 AA e avaliar acessibilidade com testes automatizados e manuais. |
| D12.9 | Exigir zero erros de TypeScript e lint, aprovação de 100% dos testes obrigatórios e cobertura de linhas mínima de 90% no núcleo financeiro e 80% geral. Exigir zero vulnerabilidades altas ou críticas não mitigadas e aprovação integral dos testes financeiros, de isolamento e de autorização. |
| D12.10 | Avaliar a IA em pelo menos 200 cenários. Exigir cálculos corretos em 100% dos casos testados, respostas factualmente corretas em pelo menos 95%, categorização correta em pelo menos 90% e avaliações humanas satisfatórias em pelo menos 90%. Exigir zero vazamentos e zero alterações não autorizadas. |
| D12.11 | Desenvolver com economia e definir o orçamento de produção após testes. Alertar ao atingir 70%, 90% e 100% do orçamento. No limite, bloquear de forma controlada novos consumos não essenciais. |
| D12.12 | Usar prompts econômicos, tarefas delimitadas, testes e relatórios concisos. Implementação e publicação exigem autorização explícita. |
| D12.13 | Realizar beta interno individual com dados sintéticos, depois beta fechado com 5–10 pessoas e piloto com 20–30 pessoas, abrangendo os workspaces pessoal, familiar e empresarial. Dados reais somente após as validações aplicáveis e em ambiente apropriado, conforme D09/D10. |
| D12.14 | Condicionar o lançamento comercial à implementação do escopo obrigatório e à validação de integridade financeira, isolamento, importação, IA, cobrança, desempenho, capacidade, acessibilidade e recuperação. Concluir as validações jurídicas e fiscais, validar custos e definir responsáveis operacionais. |
| D12.15 | Orientar a evolução por evidências de uso, priorizando estabilidade, segurança, desempenho e usabilidade. Ordem de referência após o lançamento: Open Finance, leitura de documentos, conciliação assistida por IA, anomalias avançadas e voz. |

**Estado:** a D12 conclui o planejamento arquitetural inicial. Cronograma, capacidade e indicadores são referências a validar durante o desenvolvimento. A aprovação documental não autoriza implementação, contratação ou publicação nem comprova resultados.

**Pendências:** disponibilidade diária, datas efetivas, orçamento numérico, fornecedores ainda a selecionar, responsáveis específicos e metodologias detalhadas de testes. Continuam abertos os parâmetros anteriores que a D12 não resolveu.

**DECISÃO APROVADA — D05.2: arquitetura principal:** Supabase Queues (pgmq) para persistência e entrega das tarefas, Render Background Worker para execução separado do Next.js e Supabase Cron para disparos periódicos. Princípios aprovados: entrega pelo menos uma vez, idempotência persistente, revalidação de permissões, isolamento por workspace, mensagens mínimas, proteção das credenciais privilegiadas, auditoria operacional distinta da financeira e recuperação de falhas. Ledger, saldos e auditoria financeira permanecem atômicos em funções PostgreSQL; confirmação do processamento respeita os efeitos persistidos. Enfileiramento não autoriza alterações da IA.

**DECISÃO APROVADA — D10:** antes do lançamento comercial, comprovar segurança, integridade e recuperação, inclusive pela restauração de banco, arquivos e configurações essenciais. Medir os resultados frente ao RPO de 1 hora e RTO de 4 horas e repetir o teste de restauração mensalmente. Preparar monitoramento, métricas e alertas para o lançamento, com objetivo operacional de disponibilidade de 99,5%, sem garantia contratual. Testar exportação, migração e recuperação de versões. Usar dados sintéticos em desenvolvimento e homologação. Os parâmetros pendentes de D05.2/D10 constam de [architecture.md, seção 6](architecture.md#6-assíncrono-falhas-e-escalabilidade).

**DECISÃO APROVADA — D06:** lançamento comercial com importação OFX/CSV, cadastro manual de contas e movimentações e preparação para integrações futuras. Prévia, seleção e confirmação, deduplicação/revisão, permissões específicas, processamento parcial recuperável, atomicidade por operação e idempotência persistente são requisitos. Arquivos privados, parsing determinístico, modelos CSV por workspace, auditoria e retenção limitada também são requisitos, sem limites numéricos ou prazos definidos.

**Revisão explícita do compromisso anterior:** Open Finance automático deixa de ser condição para o lançamento comercial. A conexão por Pluggy, Belvo ou outro provedor passa para evolução posterior, sujeita a avaliação técnica/comercial e autorização própria. Essa revisão não adia os demais requisitos de D01 nem altera D02–D05.2.

**DECISÃO APROVADA — D07:** cobrança independente por workspace, sob administração exclusiva do owner, com teste gratuito de 7 dias sem cartão obrigatório e prevenção de abuso. Cobrança automática exige autorização. D07.1–D07.14 estão detalhadas na seção 5 de [architecture.md](architecture.md#5-fluxos-e-consistência).

**PROPOSTA TÉCNICA — critérios da fase 6:** comparar fornecedores antes de contratar e analisar custos antes de fixar preços e quotas. Validar checkout seguro, versionamento do catálogo, quotas no servidor, eventos autenticados e idempotentes, conciliação e auditoria. Exercitar cancelamento, renovação, upgrade, downgrade, estorno e contestação sem efeitos no razão do cliente. Verificar que restrições progressivas preservam consulta, exportação e dados no workspace autorizado.

**PENDÊNCIA DE DECISÃO:** fornecedor definitivo, preços, quotas numéricas, periodicidade, tolerância à inadimplência e demais condições comerciais.

## 2. Escopo aprovado e decomposição proposta

Compartilhado no lançamento: cadastro e autenticação, seleção clara de workspace, cadastro manual de contas e movimentações, categorias, entradas/saídas/transferências, orçamentos, recorrências básicas, cartões/faturas/parcelas, importação OFX/CSV e conciliação, relatórios, assinatura, auditoria e privacidade. A arquitetura prepara integração bancária futura; conexão automática Open Finance não é requisito do lançamento.

**DECISÃO APROVADA:** gestão pessoal, familiar e empresarial, incluindo investimentos, planejamento, relatórios e projeções. **PROPOSTA TÉCNICA:** pessoal com metas/hábitos; familiar com metas compartilhadas, convites e cópia independente; empresarial para MEIs, autônomos e pequenas empresas com áreas autorizadas, clientes/fornecedores, centros de custo e obrigações com liquidação parcial. Os três contextos devem ser validados antes do lançamento; a experiência PF mantém prioridade de usabilidade.

**DECISÃO APROVADA — D08:** Conversação financeira, análise de receitas e despesas, planejamento, projeções, categorização inteligente, criação de registros autorizados e análise de investimentos integram o lançamento. Conciliação assistida por IA, detecção avançada de anomalias, leitura de fotos/comprovantes e voz ficam para evolução posterior. Os detalhes D08.1–D08.14 constam de [ai-strategy.md](ai-strategy.md). Modelos específicos, tarifas, orçamento numérico, quotas numéricas, retenção, métodos de projeção, metodologias detalhadas de avaliação e parâmetros operacionais permanecem pendentes.

**DECISÃO APROVADA — exclusões D01:** movimentação de dinheiro, iniciação de pagamentos, emissão de notas fiscais, folha, escrituração contábil oficial, ERP completo e ordens de investimento na primeira versão. BRL e web responsiva continuam a base aprovada. Outras exclusões anteriormente sugeridas não são convertidas em decisões aprovadas; novas capacidades dependem de análise própria.

## 3. Fases e critérios de passagem

| Fase | Entregas futuras propostas | Dependências | Critério de aceite |
|---|---|---|---|
| 0 — Decisões e viabilidade | Registrar decisões aprovadas até D12 e resolver detalhes necessários às próximas etapas | Parâmetros de D05/D06 e condições comerciais da D07, parâmetros da D08, detalhamentos de D09–D12 pendentes | Aprovações preservadas; desenvolvimento local sem contratação obrigatória; lançamento manual não depende de contrato Open Finance |
| 1 — Fundação | Monorepo pnpm workspaces, Supabase SDK sem ORM inicial, desenvolvimento local, ambientes, Auth, três workspaces, papéis/áreas, convites, propriedade, migrations, RLS e CI | D02/D04/D05.1 e arquitetura principal D05.2 aprovadas; parâmetros operacionais e detalhamentos da D09 pendentes conforme a etapa | Integração conforme D04; possibilidade de implantação futura na Render sem acoplamento desnecessário; pessoal sem convidados; aceite/expiração/uso único; remoção imediata; propriedade autorizada e aceita; nenhum vazamento ou acesso por área indevido |
| 2 — Núcleo financeiro | Razão, contas, funções transacionais PostgreSQL para operações críticas, lançamentos, confirmação automática, saldos armazenados, estornos, conciliação e reconstrução | Fase 1; D03/D04 e políticas da D11 aprovadas | Funções preservam autorização e atomicidade; falha parcial não confirma efeitos; débitos/créditos equilibrados, precisão decimal, retries sem duplicação, pendências sem saldo, estorno/novo lançamento auditados; nenhuma transferência direta entre espaços |
| 3 — Jornadas pessoal, familiar e empresarial | Planejamento, investimentos/projeções, metas, cópia independente, cartões, centros de custo, obrigações e importação | Fase 2; D01/D02 aprovadas; políticas da D11 aprovadas e detalhes de cobertura pendentes | Três jornadas responsivas; cópia sem acesso à origem/sincronização; áreas protegidas; investimento sem ordens; projeções determinísticas com premissas |
| 4 — Importação e conciliação | OFX SGML/XML validado, CSV padrão e mapeável, modelos por workspace, prévia, seleção, confirmação, deduplicação, histórico e recuperação | Fases 1–3; D06 aprovada; parâmetros aplicáveis de D05.2/D06 e dependências D09–D11 definidos antes da operação | Arquivos privados; ambiguidades/rejeições visíveis; permissões revalidadas; lote parcial recuperável; ausência de efeitos duplicados; atomicidade por operação |
| 5 — IA integrada | Consultas com fontes, sugestões, autorização vinculada e avaliações | Fases 2/3; dados manuais/importados com proveniência; D08; integração com fase 4 antes do piloto | Testes automatizados e avaliações humanas. Falhas de isolamento ou alterações não autorizadas bloqueiam o lançamento. Mudanças de modelos e prompts exigem regressão. Validar qualidade, limites de custo e fallback; parsing financeiro independente de IA |
| 6 — Cobrança e piloto | Planos, checkout, quotas e piloto pessoal/familiar/empresarial com cadastro manual e importações | Detalhes comerciais de D07 e detalhamentos da D09 e da D10; fases 3–5 integradas e parâmetros operacionais aplicáveis definidos | Somente owner administra assinatura; importação/recuperação testadas; inadimplência, direitos e restauração comprovados; sem dependência de conexão automática |
| 7 — Lançamento | Revisão operacional, segurança, privacidade e qualidade; implantação autorizada na Render paga com PostgreSQL no Supabase; OFX/CSV e cadastro manual | Critérios anteriores aplicáveis ao lançamento; plano/dimensionamento após testes e aprovação comercial específica | Três contextos habilitados; integridade, isolamento, importação e capacidade validados; responsáveis definidos; Open Finance automático não é bloqueador |
| 8 — Evolução posterior | Avaliar integração automática por Pluggy, Belvo ou outros provedores; ampliar métodos de projeção/investimentos, extração documental e otimizações | Evidência de uso/custo; avaliação técnica/comercial de Open Finance; políticas de sincronização, consentimento, segurança e autorização própria | Adaptador preserva IDs internos, conciliação e histórico confirmado; cobertura PF/PJ e falhas validadas antes de disponibilizar integração; demais evoluções não adiam requisitos aprovados do lançamento |

O compromisso anterior exigia Open Finance no lançamento e tratava a importação manual apenas como alternativa operacional. D06 revisa expressamente esse compromisso: o lançamento comercial utiliza OFX/CSV e cadastro manual, e a conexão automática passa para evolução posterior. Não há obrigação de contratar ou selecionar provedor na fase 0. Cobrança e IA podem avançar com dados sintéticos após contratos internos estáveis; todas as frentes preservam os critérios de segurança e domínio. Nenhum outro requisito aprovado de D01 é adiado por essa revisão.
### Aceite da Fundação

**Planejamento de referência (fase 1 da D12):** semana 1 — 1A Ambiente, 1B Estrutura e 1C Identidade e autenticação. Semana 2 — 1D Workspaces e segurança. Semana 3 — 1E Interface e 1F Validação final. A organização abaixo descreve as evidências a obter. O encerramento exige comprovação dos 14 critérios e aprovação humana.

| Critério | Evidência para aceite de F1.12 |
|---|---|
| 1. Ambiente | Reproduzir o ambiente F1.01 com as versões validadas e registradas. |
| 2. Estrutura | Conferir o monorepo, os pacotes e as ferramentas de F1.02. |
| 3. Supabase e migrations | Recriar o Supabase local com migrations versionadas e dados sintéticos. |
| 4. Autenticação | Validar os dois métodos de entrada, confirmação, recuperação, TOTP opcional, sessões, proteção contra abuso, reautenticação e requisito etário. |
| 5. Workspaces | Demonstrar o pessoal único automático e privado e a criação voluntária e atômica de familiar e empresarial com owner. |
| 6. Permissões | Exercitar papéis familiares, permissões empresariais, negação por padrão e assinatura exclusiva do owner. |
| 7. Convites | Testar destinatário, expiração em 7 dias, uso único, revogação e invalidação no reenvio. |
| 8. Propriedade | Testar reautenticação, aceite, expiração em 24 horas, revalidação e troca atômica de owner. |
| 9. Isolamento | Demonstrar autorização no servidor, RLS, funções restritas e bloqueio de acesso cruzado e elevação de privilégio. |
| 10. Revogação | Demonstrar a perda imediata de acesso após remoção, inclusive com sessão anterior, preservando a auditoria. |
| 11. Interface e acessibilidade | Validar navegação e seleção de workspace em pt-BR, nos dois temas e em telas móveis e desktop, com testes manuais e automatizados para WCAG 2.2 AA. |
| 12. Testes | Apresentar os resultados dos testes unitários, banco, RLS e interface e aplicar os critérios de qualidade da D12. |
| 13. CI | Verificar no GitHub Actions testes, tipagem, lint, dependências, build e migrations, sem deploy automático em produção. |
| 14. Dados e documentação | Comprovar ausência de segredos e dados reais nos artefatos de desenvolvimento e manter atualizada a documentação da Fundação. |

**Estado:** diretrizes e critérios aprovados documentalmente. A execução, a coleta de evidências e o aceite da fase permanecem futuros.

## 4. Estratégia de validação

| Área | Evidência exigida |
|---|---|
| Financeiro | Validar partidas dobradas, autorização, atomicidade, idempotência, estornos e reconstrução sob concorrência. Cobrir empates positivos e negativos, resíduo na última parcela, cronograma comprovado, aquisição de ativo ou despesa, pagamento parcial e relatórios de caixa e competência sem dupla contagem. Testar bloqueio retroativo, reabertura auditada e rastreabilidade até o razão |
| Banco/RLS | Três tipos de workspace, áreas empresariais, convites, propriedade aceita, cópia privada/independente, FKs, RPCs, Storage, views e revogação imediata |
| Importação no lançamento | OFX/CSV homologados, mapeamento, prévia, seleção, confirmação, duplicidades, permissões, rejeições, falhas e retomada sem efeitos duplicados |
| Integração bancária futura | Antes de disponibilizar: sandbox do fornecedor, consentimento/revogação, autenticidade de eventos, replay, ordem variável, timeout, checkpoints e conciliação com histórico existente |
| Processamento assíncrono | Validar futuramente reentrega após interrupção ou expiração de reserva, idempotência persistente, autorização revogada, isolamento e recuperação; distinguir falhas transitórias, permanentes e resultados externos incertos; auditoria de todo o ciclo e reconhecimento após persistência dos efeitos |
| IA | Casos pessoais/familiares/empresariais, investimentos/projeções, números determinísticos, autorização explícita, áreas permitidas e nenhuma mutação ao apenas validar dados |
| Experiência | Jornadas responsivas, teclado, contraste, estados de erro/vazio/carregamento e indicação de dados desatualizados |
| Operação | Backups restaurados, alertas exercitados, quotas, indisponibilidade de fornecedor e procedimentos de suporte |
| Privacidade | Fluxos de exportação, exclusão, revogação de consentimento e avaliação de fornecedores |

**PROPOSTA TÉCNICA:** registrar por etapa a versão avaliada, o ambiente, a carga, as medições e a aprovação humana. Comparar evidências aos critérios D12.5–D12.10 antes da passagem de fase. Permanecem a detalhar as metodologias, o tempo de sincronização e o custo por workspace.

## 5. Riscos e decisões bloqueadoras

| Risco | Ação de redução | Gate |
|---|---|---|
| Provedor não cobre PJ ou exige contrato inviável | Comparar cobertura, segurança, custos e suporte antes da integração automática | Fase 8, detalhamento futuro de D06; não bloqueia lançamento manual |
| Layout incorreto ou duplicidade gera lançamento indevido | Homologação, prévia, confirmação, revisão de ambiguidades, idempotência e validação transacional | Fase 4, D03/D06/D11 |
| Escopo PJ vira ERP | Preservar exclusões de D01 e validar detalhamento dentro do escopo aprovado | Fase 0/3, D01 aprovada |
| Razão ou cartões geram saldos incorretos | Validar modelo com exemplos PF/PJ e testes de invariantes | Fase 2/3, D03/D11 |
| Uso de service role elimina proteção esperada | Desenhar acessos comuns e operacionais separados; testar escopo, grants e contexto das funções | Fase 1, D04/D05.1 e arquitetura principal D05.2 aprovadas; parâmetros operacionais pendentes |
| IA extrapola orçamento ou inventa respostas | Quotas, avaliações, proveniência, abstenção e circuit breaker | Fase 5, D08 |
| Dados reais enviados a fornecedor sem governança | Mapear finalidade, contratos, minimização e retenção | Antes de qualquer piloto real, D09 |
| Dependência de planos gratuitos | Estimar custos de produção e recuperação antes de contratar | Fase 0/6, D06/D07/D10 |
| Equipe não comporta o lançamento | Priorizar dentro dos compromissos e renegociar escopo explicitamente | D12 |

## 6. Custos a estimar

**DECISÃO APROVADA — D05.1:** desenvolvimento local não exige contratar hospedagem; produção exige instância paga Render. **PENDÊNCIA DE DECISÃO:** plano comercial, recursos e custo final dependem dos testes de desempenho, segurança e capacidade. A aprovação da plataforma não autoriza compra, assinatura ou provisionamento nesta tarefa. Supabase Queues (pgmq), Render Background Worker e Supabase Cron estão aprovados como arquitetura principal da D05.2; planos, dimensionamento e capacidade de expansão, orçamento e contratação continuam pendentes. Nenhum valor ou recurso comercial é aprovado nesta consolidação.

Estimar hospedagem, workers, Supabase/compute/banco/Storage/egress/backups, processamento e retenção de arquivos, tokens e ferramentas de IA, cobrança, e-mail, observabilidade e suporte. Incluir homologação, picos e recuperação. Custos de Open Finance serão avaliados separadamente para a integração futura, sem contratação obrigatória no lançamento. Estabelecer orçamento global e por workspace, alertas e margem por plano; não assumir que assinatura ChatGPT cobre a OpenAI API ou que planos gratuitos atendem produção.

## 7. Próximo marco de decisão

D01–D04, D05.1 e a arquitetura principal da D05.2 permanecem aprovadas e preservadas. D06 aprova o lançamento com OFX/CSV e cadastro manual, revisando explicitamente a obrigatoriedade anterior de Open Finance no lançamento. Permanecem pendentes os parâmetros operacionais de D05/D06, a integração automática futura e condições comerciais da D07, parâmetros da D08, detalhamentos de D09–D12, além dos detalhamentos de investimentos/projeções, áreas, cópia familiar e conciliação de saldos. A escolha definitiva da região, a tecnologia de backup e os procedimentos detalhados de recuperação continuam abertos. Próximas alterações, implementação, contratação, migrations, commit, push e deploy exigem autorização própria.

### Evidências do Bloco 1B — estrutura local

Em 26/11/2026, no Ubuntu 24.04 em WSL 2, foram validados Node 24.22.3, pnpm 11.29.0, Docker 29.9.3 e Supabase CLI 3.4.0. Para reproduzir, instalar com `pnpm install --frozen-lockfile` e preparar o Chromium com `pnpm exec playwright install chromium --only-shell`. As bibliotecas Ubuntu libnspr4, libnss3 e libasound2t64 devem estar instaladas. Passaram em sequência typecheck, lint sem avisos, format:check, um teste Vitest, build, um teste Playwright sem LD_LIBRARY_PATH, instalação congelada e auditoria sem vulnerabilidades conhecidas. Vite avisou sobre o carregador de configuração de uma versão futura.

A primeira validação limitou os contêineres ao banco para poupar memória. Na repetição completa o Windows reservava as portas 54315–54414. A configuração local usa a faixa 55320–55329. Com Docker ativo, executar `supabase start` sem exclusões. PostgreSQL aceitou conexões na porta publicada 55322. Auth, REST e Storage responderam HTTP 200 pelo gateway 55321 e Studio respondeu 200 em 55323. Uma transação pgTAP criou a extensão, executou plan(1), verificou que 2+2 = 4, finalizou e fez rollback. Encerrar com `supabase stop`. Esses testes de disponibilidade não exercitam fluxos de negócio.

As seis exceções de idade mínima registradas na resolução inicial permanecem limitadas às versões indicadas. Sua finalidade no grafo é:

| Exceção | Justificativa |
|---|---|
| @types/node 24.19.4 | Tipagem direta do runtime Node 24 para ferramentas e testes. |
| @types/react 19.3.3 | Tipagem direta de componentes e JSX para React 19. |
| @vitest/coverage-v8 5.1.2 | Provedor de cobertura fixado na versão do runner. O teste básico não mede a meta de cobertura. |
| vitest 5.1.2 | Runner direto aprovado para testes unitários. |
| @vitest/mocker 5.1.2 | Dependência transitiva de substituição de módulos do Vitest aprovado. |
| @vitest/spy 5.1.2 | Dependência transitiva de observação de chamadas e mocks do Vitest aprovado. |

Reservados para uso direto posterior: shadcn CLI 4.23.0, lucide-react 1.80.0, @supabase/supabase-js 2.119.2, @supabase/ssr 0.12.7, Zod 4.6.7, react-hook-form 7.92.0 e @hookform/resolvers 7.0.9. O aceite da Fundação permanece condicionado às etapas posteriores.

**Bloco 1B concluído. Decisões aprovadas na publicação**

- **1B-D01:** usar as portas locais 55320–55329 para os serviços do Supabase.
- **1B-D02:** aceitar exclusivamente as seis exceções de idade mínima da tabela acima, restritas aos pares de pacote e versão indicados.
- **1B-D03:** aceitar temporariamente o aviso informativo do Vite sobre o carregador futuro da configuração de testes.
