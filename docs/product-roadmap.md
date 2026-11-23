# FINANCE AI — Roadmap de desenvolvimento

Data: 23/11/2026. Estado: planejamento; não constitui autorização para implementar ou contratar serviços.

## 1. Compromissos e status

**DECISÃO APROVADA:** SaaS por assinatura, Brasil, pt-BR, BRL, web responsiva, prioridade para PF e suporte a PF/PJ desde o lançamento; espaços isolados; stack e estrutura descritas em [architecture.md](architecture.md); IA integrada a dados reais e Open Finance por provedores.

| Decisão | Status | Requisitos para as futuras fases |
|---|---|---|
| D01 | DECISÃO APROVADA | Gestão pessoal, familiar e empresarial para PF, famílias, MEIs, autônomos e pequenas empresas; investimentos, planejamento, relatórios, projeções e IA; exclusões explícitas da primeira versão |
| D02 | DECISÃO APROVADA | Pessoal privado; familiar compartilhado; empresarial com permissões por área; cópia independente; convites aceitos; revogação imediata; transferência de propriedade autorizada e aceita; assinatura exclusiva do owner; sem dupla aprovação geral |
| D03 | DECISÃO APROVADA | Partidas dobradas, estorno e novo lançamento, confirmação automática válida, transferências internas, saldos armazenados atômicos, idempotência, conciliação e reconstrução pelo razão |
| D04 | DECISÃO APROVADA | D04.1 pnpm workspaces; D04.2 Supabase SDK; D04.3 funções transacionais PostgreSQL nas operações financeiras críticas; D04.4 sem ORM inicial, com possível reavaliação futura |

**DECISÃO APROVADA — D05.1:** Render para hospedagem inicial da aplicação Next.js; desenvolvimento local sem contratação obrigatória de hospedagem; produção em instância paga dimensionada por testes de desempenho, segurança e capacidade. O banco permanece no Supabase PostgreSQL. Isolamento, autenticação, autorização e proteção dos dados devem ser preservados; arquitetura preparada para evolução/migração, evitando dependências desnecessárias. Nenhum plano comercial específico está aprovado.

**PROPOSTA TÉCNICA:** decomposição de cada fase, critérios de aceite e ordem abaixo, subordinados a D01–D04 e D05.1 já aprovadas. **PENDÊNCIA DE DECISÃO:** D05.2 (processamento assíncrono, filas, agendamentos e workers), demais detalhes não decididos da D05, D06–D12, equipe, orçamento, datas e metas numéricas. Não há cronograma em semanas porque capacidade e contratos ainda não foram definidos. Beta interno e piloto não equivalem ao lançamento público. Esta atualização consolida somente a aprovação documental de D05.1, sem iniciar implementação ou decidir etapas posteriores.

## 2. Escopo aprovado e decomposição proposta

Compartilhado: cadastro e autenticação, seleção clara de workspace, contas, categorias, entradas/saídas/transferências, orçamentos, recorrências básicas, cartões/faturas/parcelas, importação e conciliação, relatórios, Open Finance, assinatura, auditoria e privacidade.

**DECISÃO APROVADA:** gestão pessoal, familiar e empresarial, incluindo investimentos, planejamento, relatórios e projeções. **PROPOSTA TÉCNICA:** pessoal com metas/hábitos; familiar com metas compartilhadas, convites e cópia independente; empresarial para MEIs, autônomos e pequenas empresas com áreas autorizadas, clientes/fornecedores, centros de custo e obrigações com liquidação parcial. Os três contextos devem ser validados antes do lançamento; a experiência PF mantém prioridade de usabilidade.

**PROPOSTA TÉCNICA — IA no lançamento:** consultas fundamentadas, categorização sugerida, explicações e ajustes autorizados, incluindo interpretação de investimentos/projeções dentro da cobertura a detalhar. Extração complexa e ampliação de métodos podem evoluir depois, sem retirar investimentos ou projeções aprovados do lançamento. IA avançada é medida por utilidade, confiabilidade e integração; toda alteração exige autorização explícita.

**DECISÃO APROVADA — exclusões D01:** movimentação de dinheiro, iniciação de pagamentos, emissão de notas fiscais, folha, escrituração contábil oficial, ERP completo e ordens de investimento na primeira versão. BRL e web responsiva continuam a base aprovada. Outras exclusões anteriormente sugeridas não são convertidas em decisões aprovadas; novas capacidades dependem de análise própria.

## 3. Fases e critérios de passagem

| Fase | Entregas futuras propostas | Dependências | Critério de aceite |
|---|---|---|---|
| 0 — Decisões e viabilidade | Registrar D01–D04 e D05.1 aprovadas; posteriormente resolver detalhes, assinatura, fornecedores e orçamento sob autorização própria | D05.2, detalhes restantes da D05 e D06–D12 pendentes | Aprovações preservadas; desenvolvimento local não depende de contratar hospedagem; viabilidade e responsáveis definidos antes das etapas correspondentes |
| 1 — Fundação | Monorepo pnpm workspaces, Supabase SDK sem ORM inicial, desenvolvimento local, ambientes, Auth, três workspaces, papéis/áreas, convites, propriedade, migrations, RLS e CI | D02/D04/D05.1 aprovadas; D05.2, detalhes operacionais e D09 pendentes conforme a etapa | Integração conforme D04; possibilidade de implantação futura na Render sem acoplamento desnecessário; pessoal sem convidados; aceite/expiração/uso único; remoção imediata; propriedade autorizada e aceita; nenhum vazamento ou acesso por área indevido |
| 2 — Núcleo financeiro | Razão, contas, funções transacionais PostgreSQL para operações críticas, lançamentos, confirmação automática, saldos armazenados, estornos, conciliação e reconstrução | Fase 1; D03/D04 aprovadas; D11 pendente | Funções preservam autorização e atomicidade; falha parcial não confirma efeitos; débitos/créditos equilibrados, precisão decimal, retries sem duplicação, pendências sem saldo, estorno/novo lançamento auditados; nenhuma transferência direta entre espaços |
| 3 — Jornadas pessoal, familiar e empresarial | Planejamento, investimentos/projeções, metas, cópia independente, cartões, centros de custo, obrigações e importação | Fase 2; D01/D02 aprovadas; detalhes de cobertura e D11 pendentes | Três jornadas responsivas; cópia sem acesso à origem/sincronização; áreas protegidas; investimento sem ordens; projeções determinísticas com premissas |
| 4 — Open Finance | Provedor, consentimento PF/PJ, webhooks, jobs, normalização e conciliação | Contrato D06; fase 2 e processamento D05.2 | Conexão PF/PJ, renovação/revogação, duplicação, atraso e falhas testados; custo e limites conhecidos |
| 5 — IA integrada | Consultas com fontes, sugestões, autorização vinculada e avaliações | Fases 2/3; dados com proveniência; D08 | Qualidade medida, nenhuma mutação sem autorização nos testes, nenhuma fuga de workspace, limites de custo e fallback |
| 6 — Cobrança e piloto | Planos, checkout, quotas e piloto pessoal/familiar/empresarial | D07/D09/D10; fases 3–5 integradas | Somente owner administra assinatura; inadimplência testada; direitos e restauração comprovados |
| 7 — Lançamento | Revisão operacional, segurança, privacidade e qualidade; implantação autorizada na Render em instância paga, com PostgreSQL no Supabase | Todos os critérios anteriores; plano/dimensionamento definidos após testes e aprovação comercial específica | Desempenho, segurança, capacidade e isolamento validados no ambiente de produção; três contextos habilitados; responsáveis de operação, suporte e incidentes; riscos bloqueadores resolvidos |
| 8 — Evolução | Ampliação de métodos de projeção/investimentos, extração documental e otimizações | Evidência de uso/custo e novas aprovações | Ganho demonstrável sem adiar requisitos já aprovados nem regredir integridade |

Avaliação comercial de Open Finance começa na fase 0, mesmo que integração técnica esteja na fase 4. Cobrança e IA podem avançar com dados sintéticos após contratos internos estáveis; nenhuma dessas frentes dispensa os gates de segurança e domínio. Importação manual é alternativa operacional, não substituição silenciosa do compromisso com Open Finance no lançamento.

## 4. Estratégia de validação

| Área | Evidência exigida |
|---|---|
| Financeiro | Partidas balanceadas, confirmação automática válida, pendências sem efeito, saldo atômico, retry, estorno/novo lançamento, conciliação/reconstrução sob concorrência, parcelas e precisão |
| Banco/RLS | Três tipos de workspace, áreas empresariais, convites, propriedade aceita, cópia privada/independente, FKs, RPCs, Storage, views e revogação imediata |
| Integrações | Sandbox do fornecedor, assinatura, replay, ordem variável, timeout, checkpoint e reprocessamento |
| IA | Casos pessoais/familiares/empresariais, investimentos/projeções, números determinísticos, autorização explícita, áreas permitidas e nenhuma mutação ao apenas validar dados |
| Experiência | Jornadas responsivas, teclado, contraste, estados de erro/vazio/carregamento e indicação de dados desatualizados |
| Operação | Backups restaurados, alertas exercitados, quotas, indisponibilidade de fornecedor e procedimentos de suporte |
| Privacidade | Fluxos de exportação, exclusão, revogação de consentimento e avaliação de fornecedores |

**PROPOSTA TÉCNICA:** WCAG 2.2 AA como alvo de acessibilidade (aprovação e plano de avaliação em D12). Definir metas numéricas de disponibilidade, p95 de resposta, tempo de sincronização, custo por workspace, RPO/RTO e qualidade da IA antes do piloto; não inventar SLOs sem orçamento ou carga prevista.

## 5. Riscos e decisões bloqueadoras

| Risco | Ação de redução | Gate |
|---|---|---|
| Provedor não cobre PJ ou exige contrato inviável | Comparar cobertura, custos por conexão/chamada, suporte e exigências de produção | Fase 0/4, D06 |
| Escopo PJ vira ERP | Preservar exclusões de D01 e validar detalhamento dentro do escopo aprovado | Fase 0/3, D01 aprovada |
| Razão ou cartões geram saldos incorretos | Validar modelo com exemplos PF/PJ e testes de invariantes | Fase 2/3, D03/D11 |
| Uso de service role elimina proteção esperada | Desenhar acessos comuns e operacionais separados; testar escopo, grants e contexto das funções | Fase 1, D04/D05.1 aprovadas; D05.2 e detalhes operacionais pendentes |
| IA extrapola orçamento ou inventa respostas | Quotas, avaliações, proveniência, abstenção e circuit breaker | Fase 5, D08 |
| Dados reais enviados a fornecedor sem governança | Mapear finalidade, contratos, minimização e retenção | Antes de qualquer piloto real, D09 |
| Dependência de planos gratuitos | Estimar custos de produção e recuperação antes de contratar | Fase 0/6, D06/D07/D10 |
| Equipe não comporta o lançamento | Priorizar dentro dos compromissos e renegociar escopo explicitamente | D12 |

## 6. Custos a estimar

**DECISÃO APROVADA — D05.1:** desenvolvimento local não exige contratar hospedagem; produção exige instância paga Render. **PENDÊNCIA DE DECISÃO:** plano comercial, recursos e custo final dependem dos testes de desempenho, segurança e capacidade. A aprovação da plataforma não autoriza compra, assinatura ou provisionamento nesta tarefa. Workers, filas e agendamentos têm custos e escolha próprios ainda pendentes em D05.2.

Estimar mensalidade de hospedagem, Supabase/compute/banco/Storage/egress/backups, provedor Open Finance, tokens e ferramentas de IA, cobrança, e-mail, observabilidade e suporte. Incluir ambientes de homologação, picos e recuperação. Estabelecer orçamento global e por workspace, alertas e margem por plano; não assumir que assinatura ChatGPT cobre a OpenAI API ou que planos gratuitos atendem produção.

## 7. Próximo marco de decisão

D01–D04 permanecem formalmente aprovadas e preservadas. D05.1 está aprovada; D05 é parcialmente decidida. Permanecem pendentes D05.2, os demais parâmetros não decididos da D05 e D06–D12, além dos detalhes de investimentos/projeções, áreas, cópia familiar e conciliação de saldos. Backups, recuperação de dados, região e RPO/RTO (D10) não foram definidos pela escolha da Render. O próximo marco exige nova autorização; esta tarefa termina com atualização documental e relatório, sem contratar serviços, configurar Render/Supabase, implementar, criar/executar migrations, fazer commit, push ou deploy.
