# FINANCE AI — Estratégia de inteligência artificial

Data: 23/11/2026. Estado: proposta técnica; sem integração ou execução de modelos.

## 1. Regras e status

**DECISÃO APROVADA:** OpenAI API, IA avançada conectada a dados financeiros reais, cálculos determinísticos, isolamento por workspace e proibição de alterar movimentações sem autorização.

**DECISÃO APROVADA — D01–D03:** IA apoia gestão pessoal, familiar e empresarial, investimentos, planejamento, relatórios e projeções. Acessa somente dados do workspace e das áreas autorizadas; alterações exigem autorização explícita. O núcleo confirma automaticamente lançamentos válidos após validações, mas não autoriza ações da IA por esse motivo. Partidas dobradas, estorno e novo lançamento, saldos armazenados atômicos/conciliáveis e vedação de transferência direta entre workspaces se aplicam também às ferramentas da IA.

**DECISÕES APROVADAS — D08**

| ID | Decisão |
|---|---|
| D08.1 | Conversação financeira, análise de receitas e despesas, planejamento, projeções, categorização inteligente, criação de registros autorizados e análise de investimentos integram o lançamento. Conciliação assistida por IA, detecção avançada de anomalias, leitura de fotos/comprovantes e voz ficam para evolução posterior. |
| D08.2 | Selecionar modelos dinamicamente conforme complexidade, custo e qualidade, usando a Responses API por adaptador no servidor. |
| D08.3 | Aplicar quotas por usuário e workspace, orçamento global, reserva atômica de consumo, reconciliação do consumo real, limites de contexto e interrupção automática por orçamento. |
| D08.4 | Manter memória persistente, privada ao autor, controlável por ele e isolada por workspace. Usar consultas financeiras estruturadas, sem banco vetorial inicialmente. |
| D08.5 | Vincular a autorização explícita à proposta imutável e revalidar permissões, validade, hash e versões antes da execução. |
| D08.6 | Restringir ferramentas e validar suas chamadas no servidor. O modelo não tem acesso direto a SQL ou credenciais. |
| D08.7 | Fundamentar respostas em cálculos determinísticos e referências verificáveis, indicando período, moeda e atualização. |
| D08.8 | Proteger contra prompt injection, vazamentos e manipulação de ferramentas. |
| D08.9 | Minimizar os dados enviados ao fornecedor. Não usar dados de clientes para fine-tuning inicialmente. |
| D08.10 | Combinar testes automatizados e avaliações humanas. |
| D08.11 | Falhas de isolamento ou alterações não autorizadas bloqueiam o lançamento. |
| D08.12 | Auditar operações, consumo, modelos e versões de prompts. |
| D08.13 | Manter o núcleo financeiro disponível independentemente da IA. |
| D08.14 | Condicionar mudanças de modelos e prompts a testes de regressão. |

**DECISÃO APROVADA — D09:** no contexto de investimentos, a IA apoia análise, acompanhamento, planejamento e simulação de caráter informativo, conforme D09.7. A execução de operações internas pela IA continua sujeita à autorização explícita da D08, dentro do escopo e das permissões estabelecidas. É proibido treinar modelos com dados dos clientes no lançamento, comercializar dados financeiros ou usá-los para publicidade. Desenvolvimento e testes usam dados sintéticos. Quando aplicável, oferecer transparência, revisão e contestação de decisões automatizadas, preservando a privacidade do autor e o isolamento por workspace. O uso futuro por menores depende das validações e revisões previstas em D09.3.

**PENDÊNCIA DE DECISÃO:** Modelos específicos, tarifas, orçamento numérico, quotas numéricas, retenção, métodos de projeção, metodologias detalhadas de avaliação e parâmetros operacionais permanecem pendentes.

**PROPOSTA TÉCNICA:** os contratos de ferramentas, estados de execução e mecanismos de controle abaixo detalham essas decisões. Esta documentação não autoriza execução de modelos ou envio de dados reais.

Referências internas: [arquitetura](architecture.md), [modelo de dados](database.md), [segurança](security.md) e [roadmap](product-roadmap.md).
**Aplicação de F1.07/F1.08 à IA:** ferramentas usam a identidade validada no servidor e as permissões atuais do workspace selecionado. A troca de workspace ou a remoção de um participante exige nova verificação de escopo. Aplicar restrição por área e operação, RLS e privilégios mínimos, preservando a autorização explícita de D08. Na Fundação, os testes de isolamento usam dados sintéticos e não exigem chamadas ao modelo.

## 2. Capacidades e evolução

| Capacidade e etapa | Aplicação proposta | Fonte e limite |
|---|---|---|
| Perguntas financeiras | Consultar saldo, despesas e evolução | Ferramentas determinísticas com período e workspace explícitos |
| Explicações | Explicar variações e composição de categorias | Citar lançamentos/agregados e informar cobertura dos dados |
| Categorização | Sugerir categoria e motivo | Sugestão não modifica lançamento por si só |
| Conciliação assistida por IA (posterior) | Sugerir correspondências | Ambiguidades requerem revisão; sem apagar duplicatas por inferência |
| Detecção avançada de anomalias (posterior) | Sinalizar padrões atípicos | Alertas não são constatação de fraude |
| Fotos e comprovantes (posterior) | Extrair campos de comprovantes/faturas | Dados não confiáveis; alteração financeira pela IA exige autorização explícita antes da confirmação automática válida |
| Investimentos | Explicar posição e resultados calculados | Dados autorizados, data/fonte e distinção entre saldo e valorização; sem ordens |
| Projeções | Explicar cenários calculados | Parte do escopo D01; métodos e cobertura ainda pendentes, com premissas explícitas e avaliação |

**DECISÃO APROVADA — D06:** a importação OFX/CSV interpreta datas e valores por processamento determinístico, sem depender de IA. Formatos ambíguos exigem confirmação do usuário. As propostas de extração documental e conciliação assistida não autorizam substituir parsers determinísticos nem atribuir ao modelo a decisão final sobre duplicidades ou classificação financeira ambígua.

O lançamento pode operar com dados reais cadastrados manualmente ou importados, sem conexão automática Open Finance. A ausência de conexão não reduz os requisitos de proveniência, integridade, isolamento e autorização da IA.

**DECISÃO APROVADA — D01:** primeira versão sem movimentação de dinheiro, iniciação de pagamentos, emissão de notas fiscais, folha, escrituração contábil oficial, ERP completo ou ordens de investimento. Gestão de investimentos está incluída; extensão das análises, métodos de projeção e eventual orientação personalizada permanecem sem definição, não são autorizadas por inferência. Recorrências aprovadas são automação determinística; IA não pode alterar suas regras por conta própria.

## 3. Arquitetura de execução

**DECISÃO APROVADA — D05.1:** aplicação Next.js inicialmente na Render; desenvolvimento local permitido sem contratar hospedagem; produção em instância paga dimensionada por testes de desempenho, segurança e capacidade, sem plano específico aprovado. O banco continua no Supabase PostgreSQL, com isolamento, autenticação, autorização e proteção financeira preservados. A arquitetura mantém possibilidade de evolução/migração de hospedagem.

**PROPOSTA TÉCNICA — consequência para IA:** chamadas ao provedor partem do backend autorizado, com segredos protegidos no servidor e contratos desacoplados da Render. Persistir propostas, autorizações e resultados conforme o modelo Supabase, sem depender da memória do processo web. Testar timeouts, concorrência, limites de custo e retomadas idempotentes antes de produção.

**DECISÃO APROVADA — D05.2: arquitetura principal:** Supabase Queues (pgmq) para persistência e entrega das tarefas, Render Background Worker separado do Next.js para execução e Supabase Cron para disparos periódicos. Entrega pelo menos uma vez exige idempotência persistente. Enfileirar uma tarefa não autoriza ações financeiras da IA; antes da execução delegada, revalidar permissões atuais e escopo do workspace, sem preservar autorização revogada.

Mensagens devem conter identificadores e dados mínimos; credenciais privilegiadas do worker são protegidas com privilégios mínimos e validação explícita nas operações críticas. Rastrear criação, processamento, tentativas, falhas, conclusão e reprocessamento, distinguindo auditoria operacional e financeira. Recuperar interrupções sem duplicar efeitos; ledger, saldos e auditoria financeira permanecem atômicos nas funções PostgreSQL de D04. Reconhecer processamento respeitando efeitos persistidos e idempotência. **PROPOSTA TÉCNICA:** classificar falhas transitórias, permanentes e resultados externos incertos; reconciliar resultados antes de repetir efeitos incertos. Chamadas ao modelo permanecem fora da transação financeira.

**DECISÃO APROVADA — D04:** pnpm workspaces, Supabase SDK, funções transacionais PostgreSQL nas operações financeiras críticas e nenhum ORM inicialmente, com possibilidade de reavaliação futura. A decisão organiza integração e persistência; não amplia ferramentas, autonomia ou permissões da IA e preserva D01–D03.

**PROPOSTA TÉCNICA — aplicação de D04:** pacotes permanecem no monorepositório pnpm; o adaptador Supabase usa o SDK sem ORM inicial. Depois de autorização explícita e validações, a aplicação invoca uma função transacional PostgreSQL para efetivar a operação financeira crítica. O modelo não escolhe RPCs arbitrárias, não fornece SQL e não recebe o cliente Supabase. Contratos de ferramentas continuam separados dos contratos de persistência; grants, RLS e verificações de workspace/área permanecem obrigatórios.

**DECISÃO APROVADA — D08.2:** usar Responses API através de adaptador no servidor, com seleção de modelo por capacidade, custo e qualidade. Versão e modelo exatos serão avaliados antes da implementação, sem fixação especulativa neste plano.

Fluxo: usuário autenticado → autorização do workspace → classificação do pedido → ferramentas permitidas → consulta/cálculo em finance-core → resultados mínimos ao modelo → resposta estruturada validada → apresentação com fontes ou proposta de ação.

O pacote ai-engine define a orquestração e os contratos; integrations implementa o cliente OpenAI; finance-core calcula e aplica regras; web e processadores compõem os serviços. Segredos e SDKs ficam no servidor. O modelo não possui conexão SQL, service role, token bancário, acesso arbitrário à rede ou liberdade para executar código.

Function calling permite solicitar ferramentas; a aplicação valida e decide sua execução. Saídas estruturadas ajudam a respeitar um esquema, mas não comprovam verdade, autorização ou correção financeira. Recusas, respostas incompletas e falhas de esquema devem ter tratamento explícito. Referências oficiais: [function calling](https://developers.openai.com/api/docs/guides/function-calling) e [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).

## 4. Contratos de ferramentas propostos

| Ferramenta conceitual | Entrada permitida | Resultado |
|---|---|---|
| Consultar resumo | Período, contas e categorias autorizadas | Totais calculados, moeda, período, referências e data de atualização |
| Listar movimentações | Filtros validados e paginação limitada | Registros minimizados do workspace ativo |
| Consultar obrigações | Período, regime e estado | Previsão, reconhecimento, liquidações e saldo em aberto discriminados pelo núcleo financeiro |
| Comparar períodos | Duas janelas válidas | Variações determinísticas e limitações de cobertura |
| Projetar cenário | Premissas validadas e horizonte limitado | Série calculada, versão do método e premissas |
| Propor categoria/correção | IDs autorizados e justificativa | Proposta imutável para revisão, sem execução |

Contexto de usuário, workspace e permissões efetivas por área é injetado pelo servidor, não escolhido pelo modelo. IDs retornados pelo modelo devem ser novamente autorizados. Aplicar limite de itens, período, chamadas, duração e tokens; não aceitar SQL livre ou consultas sem limite. Se o usuário solicitar outro espaço, exigir troca explícita e nova autorização, sem consolidar silenciosamente pessoal, familiar e empresarial. Owner controla seu workspace; admin/editor operam no escopo concedido; viewer somente consulta dados autorizados. Remoção de membro interrompe imediatamente novos acessos e invalida execução pendente em seu nome.

No espaço familiar, a IA vê somente a cópia independente compartilhada e outros dados autorizados do destino, sem recuperar o original pessoal nem sincronizar alterações com ele. Compartilhamento pessoal → familiar não é transferência financeira. Uma futura ferramenta de cópia teria de verificar os dois escopos, obter autorização explícita e usar o fluxo próprio de cópia; sua disponibilização não está aprovada por esta documentação.

## 5. Cálculos e proveniência

Valores saem de consultas e funções determinísticas. Saldos consultados são armazenados e atualizados atomicamente a cada movimentação confirmada, com conciliação periódica e reconstrução pelo razão. O modelo pode explicar um total, mas não recalculá-lo como fonte de verdade nem reparar saldo diretamente. Divergências identificadas devem ser informadas e encaminhadas ao fluxo autorizado de conciliação. Projeções usam método versionado com premissas; o texto não transforma previsão em garantia.

Respostas financeiras devem informar período, moeda, data de atualização e referências verificáveis. Distinguir realizado, previsto e estimado; alertar para contas desconectadas, importações incompletas e dados antigos. Quando não há dados suficientes, pedir informação ou abster-se. As referências precisam ser autorizadas também ao abrir a tela de detalhe.

**Consequência de D06:** distinguir dados cadastrados manualmente, observações importadas, lançamentos confirmados e futuros dados sincronizados. Uma prévia não é saldo realizado. Informar cobertura do período, rejeições e importações parciais quando relevantes à resposta. A referência ao lote ou arquivo não concede acesso ao extrato original completo; esse acesso exige permissão específica.

**PROPOSTA TÉCNICA:** fornecer ao modelo somente dados normalizados e minimizados necessários à finalidade, com referências internas autorizadas. Não enviar automaticamente o arquivo original nem tratar instruções contidas em descrições ou extratos como comandos.

Conversas pertencem a um workspace e inicialmente são privadas ao autor. Ao mudar de espaço, abrir ou recuperar conversa desse espaço sem carregar histórico do anterior. Cache e resultados temporários devem considerar workspace, usuário/permissões, versão dos dados e política de expiração.

**DECISÃO APROVADA — D08.4:** não usar banco vetorial no início para responder cálculos. Consulta estruturada atende valores e períodos. Busca semântica em documentos pode ser adicionada quando houver necessidade comprovada; se adotada, filtros de workspace, autoria e finalidade precisam ser aplicados antes e depois da recuperação, inclusive em embeddings e citações.

## 6. Autorização de alterações

**PROPOSTA TÉCNICA — estados:** draft → pending_approval → approved → executing → succeeded; alternativas rejected, expired, cancelled ou failed. Falhas recuperáveis podem ser reprocessadas com a mesma idempotência; conteúdo alterado exige nova proposta.

1. A IA propõe uma ação permitida, com payload canônico, workspace, usuário solicitante, IDs, versões esperadas e validade.
2. O servidor valida regra e permissão e grava proposta imutável com hash do conteúdo. A IA não cria aprovação.
3. A interface apresenta exatamente quais registros serão afetados, antes/depois, valores e impacto. Confirmação ocorre em controle explícito da aplicação, autenticado e vinculado ao ID/hash da proposta; um texto ambíguo no chat não basta.
4. O servidor grava aprovação do solicitante autorizado. Consentimento de Open Finance não substitui essa aprovação.
5. Na execução, revalidar associação, papel, permissões por área, expiração, hash e versões. Aprovação antiga não vale para registros alterados; apresentar nova proposta quando necessário. Remoção/revogação efetivada impede executar trabalho pendente.
6. Após autorização e validações, confirmar automaticamente o lançamento válido; efetivar partidas balanceadas, atualização de saldos armazenados, auditoria e estado de execução na mesma transação, usando chave única por proposta. Chamadas repetidas retornam o efeito existente, sem novo lançamento nem repetição de delta de saldo. Inválidos/incompletos/suspeitos de duplicidade ficam pendentes ou são rejeitados sem afetar saldos confirmados.
7. Exibir resultado e referências. Correção posterior respeita estorno e políticas do núcleo financeiro, sem apagar histórico.

Concorrência: bloquear/reivindicar execução de forma atômica; depois de interrupção, reconciliar resultado persistido antes de repetir. Uma aprovação não autoriza lote aberto ou futuras ações indefinidas. Para lote finito, apresentar quantidade, escopo e itens; não acrescentar itens após confirmar.

**DECISÃO APROVADA — D06:** a confirmação de importação corresponde ao conjunto selecionado pelo usuário, sujeito à revalidação de permissões e condições financeiras. Ela não amplia a autonomia da IA. Sugestões de IA que produzam alterações financeiras continuam sujeitas à autorização explícita aplicável; upload, prévia ou enfileiramento não constituem essa autorização.

O processamento parcial recuperável não autoriza novos itens nem repetição de efeitos. Correções de lançamentos confirmados continuam exigindo estorno e novo lançamento pelas funções financeiras transacionais.

**DECISÃO APROVADA:** não há exigência geral de dupla aprovação; o usuário individualmente autorizado pode autorizar sua alteração pela IA. Isso não permite à IA se autoaprovar. Alterações de confirmados exigem estorno e novo lançamento com autoria, justificativa e histórico. Proposta de alterar categoria não pode contornar imutabilidade ou reescrever itens do razão diretamente. Transferências somente entre contas do mesmo workspace, sem receita/despesa; não oferecer ferramenta de transferência direta entre espaços.

## 7. Segurança contra instruções maliciosas

Descrições de transações, documentos, mensagens importadas e resultados externos são dados, não instruções com autoridade. Conteúdo dizendo para ignorar regras, revelar segredos ou consultar outra empresa não pode mudar ferramentas ou contexto de autorização.

Mitigações propostas: esquemas fechados, allowlist de ferramentas, separação clara de instruções e dados, minimização do contexto, validação de referências, limites de execução e ausência de credenciais no prompt. Sanitizar conteúdo exibido; não seguir URLs de documentos automaticamente; bloquear exfiltração por chamadas externas. Filtros de texto não substituem autorização no servidor.

Testes devem incluir prompt injection em extrato, documento e resultado de ferramenta, identificação forjada de workspace, tentativa de autoaprovação e coleta de dados pessoais de outro membro.

## 8. Dados, retenção e fornecedores

Enviar apenas os campos necessários: agregados quando suficientes, identificadores internos e descrições reduzidas. Remover CPF/CNPJ, nomes de terceiros, números completos de conta e documentos integrais quando não forem necessários à finalidade. Não usar dados reais para desenvolver prompts ou avaliações sem processo aprovado.

Antes da produção, verificar retenção por endpoint, logs de abuso, estado persistido, arquivos enviados, elegibilidade de controles adicionais, região e contratos. Não prometer retenção zero; desabilitar armazenamento de estado quando suportado e adequado não elimina automaticamente todas as retenções do fornecedor. A política deve abranger também histórico local, documentos e backups. Fonte: [controles de dados da OpenAI](https://developers.openai.com/api/docs/guides/your-data).

A seleção do modelo deve considerar tratamento de dados além de desempenho. Fine-tuning com dados de clientes está excluído da estratégia inicial aprovada (D08.9). Base legal e transparência do uso de IA devem ser avaliadas separadamente do consentimento bancário, conforme [security.md](security.md).

## 9. Avaliação, custo e operação

**PROPOSTA TÉCNICA:** conjunto versionado de casos sintéticos pessoais, familiares e empresariais cobrindo valores em BRL, datas brasileiras, transferências internas, parcelas, investimentos, projeções, ausência de dados, importações incompletas, ambiguidade e ataques. Incluir cópia sem vazamento da origem, áreas empresariais negadas, membro removido, ausência de autorização explícita, repetição de execução sem delta duplicado e confirmação inválida sem impacto em saldo. Comparar com respostas esperadas e cálculos do núcleo, sem usar apenas julgamento de outro modelo.

| Dimensão | Evidência proposta |
|---|---|
| Exatidão | Totais e percentuais correspondem ao cálculo determinístico, na precisão definida |
| Relatórios e projeções (D11) | Conferir período, regime, moeda, metodologia, atualização e vínculo aos eventos. Separar aportes e resgates de rendimentos, taxas, tributos e valorização. Reproduzir projeções pelo núcleo determinístico com premissas explícitas, sem garantia de retorno e dentro de D09.7 |
| Fundamentação | Referências existem, pertencem ao espaço e sustentam as afirmações |
| Autorização | Nenhuma mutação sem confirmação e nenhuma leitura cruzada nos testes |
| Robustez | Recusa segura em falha, prompt injection e dados incompletos |
| Utilidade | Avaliação humana de respostas PF/PJ e correções de categorização |
| Operação | Latência, tokens, custo por tarefa/workspace e taxa de falhas |

**DECISÃO APROVADA — D12.5/D12.7/D12.10:** avaliar pelo menos 200 cenários, com cálculos corretos em 100% dos casos testados, respostas factualmente corretas ≥95%, categorização correta ≥90% e avaliações humanas satisfatórias ≥90%. Qualquer vazamento ou alteração não autorizada bloqueia o lançamento. Medir p95 de até 5 s para início da resposta e acompanhar a disponibilidade da IA separadamente da disponibilidade do núcleo financeiro. Os valores são critérios de aceite. Composição da amostra, metodologia e responsáveis específicos continuam pendentes.

Registrar modelo, versão de prompt/esquema, referências de dados, ferramenta, latência, consumo e correlação. Evitar logs com raciocínio interno, segredos ou payload completo; justificativa exibida deve ser breve e verificável.

**DECISÃO APROVADA — D07:** o servidor verifica a versão do plano, os recursos disponíveis e as quotas do workspace antes de autorizar consumo de IA. O modelo não altera a assinatura nem concede recursos. Restrições comerciais preservam os dados e os caminhos de consulta e exportação autorizadas, independentemente da disponibilidade da IA. Quotas numéricas e preços dependem da análise de custos. Orçamentos de modelos e critérios de qualidade seguem em D08.

Quotas por usuário/workspace, orçamento global, limites de contexto e circuit breaker evitam gasto descontrolado. Reservar capacidade/custo de forma atômica para requisições concorrentes e reconciliar consumo real. Retentativas têm limite e backoff; nunca repetir escrita sem idempotência. Mudança de modelo/prompt exige avaliação de regressão e liberação controlada.

Se o provedor falhar ou o orçamento acabar, manter lançamentos e relatórios determinísticos disponíveis e informar indisponibilidade da IA. Não fabricar resposta financeira para disfarçar timeout. Tarefas longas seguem a estratégia de jobs da arquitetura, respeitando limites do executor escolhido.

**DECISÃO APROVADA — D10.6/D10.7:** em falha da IA, preservar as operações seguras do núcleo financeiro. Processar tarefas recuperáveis em UTC com reservas renováveis, idempotência persistente, retentativas configuráveis e limites de concorrência. Reconciliar chamadas de resultado incerto e consumo antes de repetir. A retomada de uma ação financeira continua sujeita à proposta autorizada, à validade e às permissões da D08.

**PENDÊNCIAS:** os parâmetros operacionais restantes constam de [architecture.md, seção 6](architecture.md#6-assíncrono-falhas-e-escalabilidade). Permanecem abertos os detalhamentos da D06, as condições comerciais da D07, os parâmetros da D08, os detalhamentos de D09–D12, incluindo modelos, custos e retenção de IA em D08/D09. A documentação não autoriza execução de modelos ou contratação.

Fontes oficiais consultadas em 23/11/2026; validar APIs, contratos, modelos e preços antes da implementação.
