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

**PROPOSTA TÉCNICA:** decomposição, critérios de aceite e ordem das fases abaixo, subordinados a D01–D04, D05.1, à arquitetura principal da D05.2 e às decisões arquiteturais da D06. **PENDÊNCIA DE DECISÃO:** parâmetros operacionais de D05/D06, D07–D12, equipe, orçamento, datas e metas numéricas. Não há cronograma em semanas porque capacidade e contratos ainda não foram definidos. Beta interno e piloto não equivalem ao lançamento público. A documentação não autoriza implementação ou contratação.

**DECISÃO APROVADA — D05.2: arquitetura principal:** Supabase Queues (pgmq) para persistência e entrega das tarefas, Render Background Worker para execução separado do Next.js e Supabase Cron para disparos periódicos. Princípios aprovados: entrega pelo menos uma vez, idempotência persistente, revalidação de permissões, isolamento por workspace, mensagens mínimas, proteção das credenciais privilegiadas, auditoria operacional distinta da financeira e recuperação de falhas. Ledger, saldos e auditoria financeira permanecem atômicos em funções PostgreSQL; confirmação do processamento respeita os efeitos persistidos. Enfileiramento não autoriza alterações da IA.

**PENDÊNCIA DE DECISÃO — D05.2:** frequência, fuso e execuções perdidas; tentativas e backoff; duração/renovação de reservas; concorrência global, por workspace e por provedor; dimensionamento, instâncias e capacidade; planos, contratação e orçamento máximo; metas de disponibilidade/recuperação; retenção de logs/histórico; limiares de alertas e responsáveis; organização definitiva do código do worker; procedimentos de backup, restauração e retomada após desastres. A lista é coerente com [architecture.md, seção 6](architecture.md#6-assíncrono-falhas-e-escalabilidade); detalhamentos pendentes da D06 e D07–D12 permanecem pendentes.

**DECISÃO APROVADA — D06:** lançamento comercial com importação OFX/CSV, cadastro manual de contas e movimentações e preparação para integrações futuras. Prévia, seleção e confirmação, deduplicação/revisão, permissões específicas, processamento parcial recuperável, atomicidade por operação e idempotência persistente são requisitos. Arquivos privados, parsing determinístico, modelos CSV por workspace, auditoria e retenção limitada também são requisitos, sem limites numéricos ou prazos definidos.

**Revisão explícita do compromisso anterior:** Open Finance automático deixa de ser condição para o lançamento comercial. A conexão por Pluggy, Belvo ou outro provedor passa para evolução posterior, sujeita a avaliação técnica/comercial e autorização própria. Essa revisão não adia os demais requisitos de D01 nem altera D02–D05.2.

## 2. Escopo aprovado e decomposição proposta

Compartilhado no lançamento: cadastro e autenticação, seleção clara de workspace, cadastro manual de contas e movimentações, categorias, entradas/saídas/transferências, orçamentos, recorrências básicas, cartões/faturas/parcelas, importação OFX/CSV e conciliação, relatórios, assinatura, auditoria e privacidade. A arquitetura prepara integração bancária futura; conexão automática Open Finance não é requisito do lançamento.

**DECISÃO APROVADA:** gestão pessoal, familiar e empresarial, incluindo investimentos, planejamento, relatórios e projeções. **PROPOSTA TÉCNICA:** pessoal com metas/hábitos; familiar com metas compartilhadas, convites e cópia independente; empresarial para MEIs, autônomos e pequenas empresas com áreas autorizadas, clientes/fornecedores, centros de custo e obrigações com liquidação parcial. Os três contextos devem ser validados antes do lançamento; a experiência PF mantém prioridade de usabilidade.

**PROPOSTA TÉCNICA — IA no lançamento:** consultas fundamentadas, categorização sugerida, explicações e ajustes autorizados, incluindo interpretação de investimentos/projeções dentro da cobertura a detalhar. Extração complexa e ampliação de métodos podem evoluir depois, sem retirar investimentos ou projeções aprovados do lançamento. IA avançada é medida por utilidade, confiabilidade e integração; toda alteração exige autorização explícita.

**DECISÃO APROVADA — exclusões D01:** movimentação de dinheiro, iniciação de pagamentos, emissão de notas fiscais, folha, escrituração contábil oficial, ERP completo e ordens de investimento na primeira versão. BRL e web responsiva continuam a base aprovada. Outras exclusões anteriormente sugeridas não são convertidas em decisões aprovadas; novas capacidades dependem de análise própria.

## 3. Fases e critérios de passagem

| Fase | Entregas futuras propostas | Dependências | Critério de aceite |
|---|---|---|---|
| 0 — Decisões e viabilidade | Registrar decisões aprovadas até D06 e resolver detalhes necessários às próximas etapas | Parâmetros de D05/D06 e D07–D12 pendentes | Aprovações preservadas; desenvolvimento local sem contratação obrigatória; lançamento manual não depende de contrato Open Finance |
| 1 — Fundação | Monorepo pnpm workspaces, Supabase SDK sem ORM inicial, desenvolvimento local, ambientes, Auth, três workspaces, papéis/áreas, convites, propriedade, migrations, RLS e CI | D02/D04/D05.1 e arquitetura principal D05.2 aprovadas; parâmetros operacionais e D09 pendentes conforme a etapa | Integração conforme D04; possibilidade de implantação futura na Render sem acoplamento desnecessário; pessoal sem convidados; aceite/expiração/uso único; remoção imediata; propriedade autorizada e aceita; nenhum vazamento ou acesso por área indevido |
| 2 — Núcleo financeiro | Razão, contas, funções transacionais PostgreSQL para operações críticas, lançamentos, confirmação automática, saldos armazenados, estornos, conciliação e reconstrução | Fase 1; D03/D04 aprovadas; D11 pendente | Funções preservam autorização e atomicidade; falha parcial não confirma efeitos; débitos/créditos equilibrados, precisão decimal, retries sem duplicação, pendências sem saldo, estorno/novo lançamento auditados; nenhuma transferência direta entre espaços |
| 3 — Jornadas pessoal, familiar e empresarial | Planejamento, investimentos/projeções, metas, cópia independente, cartões, centros de custo, obrigações e importação | Fase 2; D01/D02 aprovadas; detalhes de cobertura e D11 pendentes | Três jornadas responsivas; cópia sem acesso à origem/sincronização; áreas protegidas; investimento sem ordens; projeções determinísticas com premissas |
| 4 — Importação e conciliação | OFX SGML/XML validado, CSV padrão e mapeável, modelos por workspace, prévia, seleção, confirmação, deduplicação, histórico e recuperação | Fases 1–3; D06 aprovada; parâmetros aplicáveis de D05.2/D06 e dependências D09–D11 definidos antes da operação | Arquivos privados; ambiguidades/rejeições visíveis; permissões revalidadas; lote parcial recuperável; ausência de efeitos duplicados; atomicidade por operação |
| 5 — IA integrada | Consultas com fontes, sugestões, autorização vinculada e avaliações | Fases 2/3; dados manuais/importados com proveniência; D08; integração com fase 4 antes do piloto | Qualidade medida, nenhuma mutação sem autorização nos testes, nenhuma fuga de workspace, limites de custo e fallback; parsing financeiro independente de IA |
| 6 — Cobrança e piloto | Planos, checkout, quotas e piloto pessoal/familiar/empresarial com cadastro manual e importações | D07/D09/D10; fases 3–5 integradas e parâmetros operacionais aplicáveis definidos | Somente owner administra assinatura; importação/recuperação testadas; inadimplência, direitos e restauração comprovados; sem dependência de conexão automática |
| 7 — Lançamento | Revisão operacional, segurança, privacidade e qualidade; implantação autorizada na Render paga com PostgreSQL no Supabase; OFX/CSV e cadastro manual | Critérios anteriores aplicáveis ao lançamento; plano/dimensionamento após testes e aprovação comercial específica | Três contextos habilitados; integridade, isolamento, importação e capacidade validados; responsáveis definidos; Open Finance automático não é bloqueador |
| 8 — Evolução posterior | Avaliar integração automática por Pluggy, Belvo ou outros provedores; ampliar métodos de projeção/investimentos, extração documental e otimizações | Evidência de uso/custo; avaliação técnica/comercial de Open Finance; políticas de sincronização, consentimento, segurança e autorização própria | Adaptador preserva IDs internos, conciliação e histórico confirmado; cobertura PF/PJ e falhas validadas antes de disponibilizar integração; demais evoluções não adiam requisitos aprovados do lançamento |

O compromisso anterior exigia Open Finance no lançamento e tratava a importação manual apenas como alternativa operacional. D06 revisa expressamente esse compromisso: o lançamento comercial utiliza OFX/CSV e cadastro manual, e a conexão automática passa para evolução posterior. Não há obrigação de contratar ou selecionar provedor na fase 0. Cobrança e IA podem avançar com dados sintéticos após contratos internos estáveis; todas as frentes preservam os critérios de segurança e domínio. Nenhum outro requisito aprovado de D01 é adiado por essa revisão.

## 4. Estratégia de validação

| Área | Evidência exigida |
|---|---|
| Financeiro | Partidas balanceadas, confirmação automática válida, pendências sem efeito, saldo atômico, retry, estorno/novo lançamento, conciliação/reconstrução sob concorrência, parcelas e precisão |
| Banco/RLS | Três tipos de workspace, áreas empresariais, convites, propriedade aceita, cópia privada/independente, FKs, RPCs, Storage, views e revogação imediata |
| Importação no lançamento | OFX/CSV homologados, mapeamento, prévia, seleção, confirmação, duplicidades, permissões, rejeições, falhas e retomada sem efeitos duplicados |
| Integração bancária futura | Antes de disponibilizar: sandbox do fornecedor, consentimento/revogação, autenticidade de eventos, replay, ordem variável, timeout, checkpoints e conciliação com histórico existente |
| Processamento assíncrono | Validar futuramente reentrega após interrupção ou expiração de reserva, idempotência persistente, autorização revogada, isolamento e recuperação; distinguir falhas transitórias, permanentes e resultados externos incertos; auditoria de todo o ciclo e reconhecimento após persistência dos efeitos |
| IA | Casos pessoais/familiares/empresariais, investimentos/projeções, números determinísticos, autorização explícita, áreas permitidas e nenhuma mutação ao apenas validar dados |
| Experiência | Jornadas responsivas, teclado, contraste, estados de erro/vazio/carregamento e indicação de dados desatualizados |
| Operação | Backups restaurados, alertas exercitados, quotas, indisponibilidade de fornecedor e procedimentos de suporte |
| Privacidade | Fluxos de exportação, exclusão, revogação de consentimento e avaliação de fornecedores |

**PROPOSTA TÉCNICA:** WCAG 2.2 AA como alvo de acessibilidade (aprovação e plano de avaliação em D12). Definir metas numéricas de disponibilidade, p95 de resposta, tempo de sincronização, custo por workspace, RPO/RTO e qualidade da IA antes do piloto; não inventar SLOs sem orçamento ou carga prevista.

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

**DECISÃO APROVADA — D05.1:** desenvolvimento local não exige contratar hospedagem; produção exige instância paga Render. **PENDÊNCIA DE DECISÃO:** plano comercial, recursos e custo final dependem dos testes de desempenho, segurança e capacidade. A aprovação da plataforma não autoriza compra, assinatura ou provisionamento nesta tarefa. Supabase Queues (pgmq), Render Background Worker e Supabase Cron estão aprovados como arquitetura principal da D05.2; planos, dimensionamento, instâncias, capacidade, orçamento e contratação continuam pendentes. Nenhum valor ou recurso comercial é aprovado nesta consolidação.

Estimar hospedagem, workers, Supabase/compute/banco/Storage/egress/backups, processamento e retenção de arquivos, tokens e ferramentas de IA, cobrança, e-mail, observabilidade e suporte. Incluir homologação, picos e recuperação. Custos de Open Finance serão avaliados separadamente para a integração futura, sem contratação obrigatória no lançamento. Estabelecer orçamento global e por workspace, alertas e margem por plano; não assumir que assinatura ChatGPT cobre a OpenAI API ou que planos gratuitos atendem produção.

## 7. Próximo marco de decisão

D01–D04, D05.1 e a arquitetura principal da D05.2 permanecem aprovadas e preservadas. D06 aprova o lançamento com OFX/CSV e cadastro manual, revisando explicitamente a obrigatoriedade anterior de Open Finance no lançamento. Permanecem pendentes os parâmetros operacionais de D05/D06, a integração automática futura e D07–D12, além dos detalhamentos de investimentos/projeções, áreas, cópia familiar e conciliação de saldos. Região, backups, recuperação e RPO/RTO continuam dependentes de D10. Próximas alterações, implementação, contratação, migrations, commit, push e deploy exigem autorização própria.
