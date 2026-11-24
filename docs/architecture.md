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

**DECISÃO APROVADA — stack:** Next.js App Router, React, TypeScript, Tailwind CSS, PostgreSQL, Supabase para infraestrutura inicial, autenticação e armazenamento, OpenAI API, GitHub e Codex. Conforme D06, o lançamento comercial utilizará importação OFX/CSV e cadastro manual de contas e movimentações. A conexão automática por Open Finance não é obrigatória no lançamento; Pluggy, Belvo ou outros provedores serão avaliados posteriormente, sem contratação nesta etapa e sem presumir gratuidade.

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

**PROPOSTA TÉCNICA — monólito modular:** uma aplicação web e módulos com contratos explícitos. Conforme D05.2, o processamento assíncrono executa em Render Background Worker separado do Next.js; a proposta modular reutiliza regras e contratos do mesmo repositório. Separar serviços adicionais quando houver evidência de necessidade operacional.

| Componente | Responsabilidade proposta | Limite |
|---|---|---|
| apps/web | Interface, sessão, Route Handlers, Server Actions e composição dos casos de uso | Autorizar cada operação; componentes de cliente recebem somente dados necessários |
| finance-core | Valores monetários, lançamentos, transferências, obrigações, conciliação e cálculos | Sem dependência de Next.js, Supabase ou OpenAI; persistência através de interfaces |
| ai-engine | Contexto autorizado, ferramentas, propostas, avaliações e limites de IA | Não possui acesso irrestrito ao banco nem poder de aprovação |
| integrations | Adaptadores Supabase, arquivos OFX/CSV, futuros provedores bancários, OpenAI, cobrança e armazenamento | Isola formatos, SDKs e contratos externos; não duplica regras financeiras nem escreve diretamente no ledger |
| shared | Tipos de contratos, validações de fronteira e erros comuns | Sem segredos, acesso a rede ou importação dos demais pacotes |
| supabase/migrations | Evolução futura de tabelas, restrições, funções e RLS | Fonte versionada do esquema, sem alterações manuais não rastreadas |
| supabase/functions | Possíveis entradas curtas para eventos, sujeitas a detalhamento | Não substitui o worker Render e o Supabase Cron aprovados em D05.2; validar identidade/origem |
| docs | Decisões, modelo, segurança, roadmap e IA | Manter mudanças correlatas consistentes |

Dependências propostas: finance-core depende apenas de shared; ai-engine depende de shared e contratos de finance-core; integrations implementa contratos desses módulos; web e funções compõem os adaptadores. Evitar ciclos e imports de adaptadores em regras de domínio. Compatibilidade entre runtime web e Edge Functions exige validação posterior; não pressupor suporte idêntico a bibliotecas Node.js.

**DECISÃO APROVADA — D04:**

- **D04.1:** pnpm workspaces para gerenciamento do monorepositório.
- **D04.2:** Supabase SDK para integração com os serviços Supabase.
- **D04.3:** funções transacionais PostgreSQL para operações financeiras críticas.
- **D04.4:** não utilizar ORM inicialmente, com possibilidade de reavaliação futura.

As operações financeiras críticas preservam no banco as garantias de D03, além das validações de domínio. O SDK não substitui autorização, isolamento por workspace ou RLS. **PROPOSTA TÉCNICA:** manter adaptadores em integrations, invocar funções restritas via RPC e gerar tipos do esquema versionado. Contratos, assinaturas, grants e mecanismos de concorrência ainda precisam de detalhamento. D04 não aprova tabelas, migrations ou implementação nesta etapa.

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
| Importação e conciliação | OFX/CSV, prévia, seleção, confirmação, deduplicação e revisão; integração automática futura | Contas e registros pessoais autorizados | Dados do workspace familiar, sem acesso implícito aos originais pessoais | Contas e registros empresariais nas áreas autorizadas |
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

**Consequência de D04.3 para os fluxos financeiros:** a unidade crítica de persistência é executada em função transacional PostgreSQL. **PROPOSTA TÉCNICA:** o backend invoca a função pelo Supabase SDK, com identidade e escopo validados; escritas separadas pelo SDK não devem fragmentar a atomicidade de D03. Funções PostgreSQL não são Edge Functions nem definem o executor assíncrono.

### Importação bancária e integração futura — D06

**DECISÃO APROVADA — D06:** o lançamento comercial terá importação OFX/CSV, cadastro manual de contas financeiras e movimentações e arquitetura preparada para integrações bancárias futuras. Open Finance automático não é obrigatório no lançamento. Pluggy, Belvo ou outros fornecedores serão avaliados posteriormente; não há contratação ou implementação de provedores autorizada nesta etapa.

**Revisão explícita de escopo:** esta decisão substitui o compromisso anterior de exigir Open Finance no lançamento comercial. Permanecem preservados os contextos pessoal, familiar e empresarial, investimentos, planejamento, relatórios, projeções, IA e exclusões de D01. A mudança se limita ao canal de aquisição bancária e ao momento de disponibilização da conexão automática.

**DECISÃO APROVADA — separação de responsabilidades:** aquisição → normalização → conciliação → registro financeiro. Parsers e adaptadores produzem dados normalizados; nenhum deles escreve diretamente no ledger. Cadastro manual e importações respeitam o mesmo núcleo financeiro e as funções transacionais PostgreSQL de D04.

O fluxo de importação deve oferecer upload privado e validado, processamento determinístico, prévia das movimentações, seleção dos itens, identificação de duplicidades, revisão das ambiguidades e confirmação do usuário para o conjunto selecionado. Antes do registro, revalidar permissões, workspace, área autorizada e condições financeiras. Preservar rastreabilidade entre arquivo, observação importada e lançamento.

**DECISÃO APROVADA — formatos:** suportar variantes OFX SGML/XML explicitamente validadas, formato CSV padrão, mapeamento flexível de colunas e modelos reutilizáveis por workspace. Datas, valores e formatos ambíguos exigem confirmação. Exibir erros e registros rejeitados. Não depender de IA para interpretar valores financeiros nem prometer compatibilidade universal com extratos bancários.

**DECISÃO APROVADA — integridade:** lotes têm processamento parcial recuperável, com atomicidade por operação financeira e idempotência persistente. Ledger, saldos e auditoria financeira são atualizados na mesma transação. Falhas e reprocessamentos não duplicam lançamentos; o lote inteiro não precisa constituir uma transação financeira indivisível. Correções de confirmados ocorrem exclusivamente por estorno e novo lançamento.

**DECISÕES APROVADAS — D11: políticas financeiras**

| ID | Política |
|---|---|
| D11.1 | Usar decimais com duas casas para valores monetários em BRL e precisão ampliada nos cálculos intermediários. Excluir ponto flutuante binário para dinheiro. |
| D11.2 | Arredondar por Half Up, com empates para longe de zero. |
| D11.3 | Distinguir ocorrência, competência, vencimento, liquidação, registro e confirmação. Instantes técnicos usam UTC e cada workspace tem fuso configurável. |
| D11.4 | Oferecer caixa e competência sobre os mesmos lançamentos. Usar caixa por padrão no pessoal e familiar, e competência no empresarial. |
| D11.5 | Em contas a pagar e receber, distinguir previsão, reconhecimento e liquidação. Suportar liquidações parciais, antecipações, juros, multas e descontos. |
| D11.6 | Calcular parcelas deterministicamente e ajustar o resíduo na última. Prevalece o cronograma real comprovado. |
| D11.7 | Quando constituídas a aquisição e a obrigação, reconhecer integralmente ambas. Classificar a aquisição como despesa ou ativo conforme sua natureza. As parcelas representam o cronograma de pagamento. |
| D11.8 | Tratar cartões como passivos. Controlar limites, compras, parcelas, faturas e pagamentos. A liquidação reduz o passivo sem repetir despesas. |
| D11.9 | Recorrências geram compromissos ou rascunhos. Uma ocorrência prevista não implica liquidação. |
| D11.10 | Transferências internas não constituem receita ou despesa. Registrar tarifas separadamente como despesa. |
| D11.11 | Permitir fechamento mensal opcional. Bloquear alterações retroativas em período fechado e exigir autorização e auditoria para reabri-lo. |
| D11.12 | Vincular estornos, devoluções e reembolsos aos eventos de origem, preservando os lançamentos originais. |
| D11.13 | Conciliar movimentações e saldos com divergências e correções rastreáveis, sem ajustes silenciosos. |
| D11.14 | Orçamentos, metas e reservas virtuais são instrumentos de planejamento sem movimentação de dinheiro. |
| D11.15 | Registrar saldos iniciais como abertura patrimonial, sem classificação automática como receita. |
| D11.16 | Distinguir capital investido, aportes, resgates, rendimentos, taxas, tributos e valorização patrimonial. Aplicar os limites de D09.7. |
| D11.17 | Gerar projeções determinísticas com premissas explícitas, sem garantia de retorno. |
| D11.18 | Produzir relatórios consistentes e rastreáveis, identificando período, regime, moeda, metodologia e atualização. |

Cada efeito confirmado mantém as partidas dobradas e a atualização atômica do razão, dos saldos e da auditoria pelas funções transacionais de D03/D04. Ambiguidades exigem resolução autorizada.

**DECISÃO APROVADA — integração futura:** camada independente de fornecedor, contrato normalizado e versionado, identificadores internos estáveis e referências externas separadas. Sincronização controlada e recuperável, com gestão de consentimentos e revogações quando aplicável, preservando o histórico financeiro confirmado.

**PROPOSTA TÉCNICA — contrato conceitual:** representar origem, conta, observação de transação, identificadores externos, saldo observado, consentimento, execução de sincronização e vínculos de conciliação. Manter workspace e proveniência verificáveis; distinguir estado externo de confirmação no ledger, datas de ocorrência/contabilização/coleta e saldo observado de saldo interno. Campos ausentes não devem ser inventados. Importação manual não cria consentimento Open Finance fictício. Campos, cardinalidades e capacidades de cada adaptador permanecem sujeitos a detalhamento.

**PROPOSTA TÉCNICA — execução:** Next.js autoriza e coordena upload, prévia e confirmação; pgmq entrega tarefas ao Render Background Worker, que processa arquivos e solicita operações financeiras às funções PostgreSQL. Tarefas curtas podem terminar em uma execução; importações maiores usam etapas recuperáveis e progresso persistido. Supabase Cron dispara rotinas periódicas quando definidas. Mensagens contêm referências mínimas; reconhecer processamento após persistência dos efeitos. A confirmação do conjunto deve ser vinculada à versão revisada; alterações materiais exigem nova confirmação.

**DECISÃO APROVADA — limites e falhas:** limites configuráveis de upload, registros, armazenamento, concorrência e processamento; recuperação controlada de falhas transitórias; rejeição de arquivos inválidos sem tentativas infinitas.

**PENDÊNCIA DE DECISÃO:** valores numéricos dos limites, versões OFX e layouts homologados, detalhes do CSV padrão, classificação e contrapartidas, duração das reservas, concorrência, retries, retenção/descarte e procedimentos de recuperação. Permanecem pendentes políticas de sincronização e critérios comerciais e técnicos dos futuros provedores, além das dependências de condições comerciais da D07, parâmetros da D08, detalhamentos de D09–D12.

**PROPOSTA TÉCNICA — conexão automática futura:** jornada oficial de consentimento/autenticação → retorno verificado → referências externas e segredos protegidos → sincronização por jobs → normalização → deduplicação/conciliação → registro pelas funções financeiras. Conexões e consentimentos pertencem a um workspace; cobertura PF/PJ será avaliada por fornecedor. Revogação interrompe novas coletas; retenção dos dados existentes depende da política aplicável. Esse fluxo não está implementado nem contratado.

### Assinaturas

**DECISÕES APROVADAS — D07: cobrança, planos e assinaturas**

| ID | Decisão aprovada |
|---|---|
| D07.1 | Cada workspace tem assinatura independente, administrada exclusivamente pelo owner, conforme D02. |
| D07.2 | Teste gratuito de 7 dias, sem cartão obrigatório, com prevenção de abuso. O fim do teste não autoriza cobrança automática. |
| D07.3 | Comparar fornecedores antes da contratação. |
| D07.4 | Aplicar restrições progressivas por inadimplência, preservando dados, consulta e exportação no escopo autorizado. |
| D07.5 | Definir preços e quotas após análise de custos. |
| D07.6 | Manter planos, recursos, preços e limites configuráveis e versionados. |
| D07.7 | Isolar a integração de cobrança em adaptador independente do fornecedor. |
| D07.8 | Usar checkout seguro. O FINANCE AI não armazena números completos de cartões nem CVV. |
| D07.9 | Autenticar webhooks, processar eventos com idempotência e conciliar o estado com o provedor. |
| D07.10 | Aplicar planos e quotas no servidor, respeitando workspace e permissões. |
| D07.11 | Manter cobrança do SaaS separada do núcleo financeiro dos clientes. Eventos de pagamento não geram lançamentos no razão do cliente. |
| D07.12 | Usar pgmq, Render Background Worker e Supabase Cron conforme as responsabilidades de D05.2. |
| D07.13 | Prever cancelamento, renovação, upgrade, downgrade, estorno e contestação. |
| D07.14 | Auditar assinaturas, planos e pagamentos. |

**PENDÊNCIA DE DECISÃO:** fornecedor definitivo, ofertas pessoais, familiares e empresariais, bundles, preços, quotas numéricas, periodicidade de cobrança, tolerância e etapas de inadimplência e demais condições comerciais, inclusive vigência de mudanças de plano e regras de estorno.

## 6. Assíncrono, falhas e escalabilidade

**DECISÃO APROVADA — D05.1: hospedagem:** Render será a plataforma inicial da aplicação Next.js. O desenvolvimento pode ocorrer localmente, sem contratação obrigatória de hospedagem. Produção usará uma instância paga da Render, dimensionada conforme testes de desempenho, segurança e capacidade; nenhum plano comercial específico está aprovado. O banco continua no Supabase PostgreSQL. A hospedagem deve preservar isolamento por workspace, autenticação, autorização e proteção dos dados financeiros. A arquitetura deve permitir evolução e eventual migração de hospedagem, evitando dependências desnecessárias.

**PROPOSTA TÉCNICA — aplicação de D05.1:** manter a aplicação Next.js e seus adaptadores portáveis, com configuração de ambiente separada do domínio e sem persistir registros financeiros no disco local da aplicação. O backend hospedado na Render integra os serviços Supabase pelo SDK e invoca as funções PostgreSQL de D04; a mudança de hospedagem não desloca o razão ou as transações para a Render. Validar conectividade, latência, limites de conexão, comportamento em reinício e isolamento de cache/sessão antes de produção. Formato de implantação e parâmetros operacionais permanecem a detalhar.

**DECISÃO APROVADA — D05.2: arquitetura principal de processamento assíncrono:** Supabase Queues (pgmq) para persistência e entrega das tarefas; Render Background Worker para execução em segundo plano, separado da aplicação Next.js; Supabase Cron para disparo de tarefas periódicas. A aprovação é documental e não autoriza provisionamento, contratação ou implementação.

**Princípios aprovados de D05.2:** entrega pelo menos uma vez, com possível reentrega após falhas, interrupções ou expiração de reservas; idempotência persistente e transacional para não duplicar lançamentos, saldos, importações ou outros efeitos. Não presumir execução exatamente uma vez. Antes de executar tarefa delegada por usuário, revalidar permissões atuais e escopo do workspace; enfileiramento não preserva autorização revogada nem constitui autorização explícita para ações financeiras da IA.

Cada tarefa deve possuir escopo verificável e mensagens com identificadores e dados mínimos, sem exposição desnecessária de dados financeiros, pessoais ou credenciais. Proteger credenciais privilegiadas do worker, aplicar privilégios mínimos e validar explicitamente autorização nas operações críticas. Rastrear criação, processamento, tentativas, falhas, conclusão e reprocessamento, distinguindo auditoria operacional de financeira. Recuperar tarefas interrompidas e identificar falhas que exigem intervenção; distinguir conceitualmente falhas transitórias, permanentes e resultados externos incertos.

O worker não contorna D03/D04: ledger de partidas dobradas, saldos armazenados e auditoria financeira continuam atualizados atomicamente por funções transacionais PostgreSQL. Confirmar processamento respeitando a persistência dos efeitos e a idempotência, inclusive se a resposta se perder após commit.

**PROPOSTA TÉCNICA — detalhamento:** consumidores em lotes pequenos; registro operacional de jobs com workspace, tipo, referência de payload, tentativas, reserva, próxima execução, estado e chave de deduplicação, sem substituir pgmq por fila própria. Quando necessário, registrar tarefa e alteração de negócio na mesma transação; manter outbox transacional como proposta para publicação de eventos externos. Cron dispara trabalho limitado; o worker executa o processamento. Falhas transitórias podem ter retentativa; permanentes exigem tratamento específico; resultados externos incertos devem ser reconciliados antes de repetir efeitos. Mecanismos concretos permanecem sujeitos a detalhamento.

**DECISÕES APROVADAS — D10: infraestrutura e continuidade**

| ID | Decisão operacional |
|---|---|
| D10.1 | Priorizar região brasileira quando disponível e adequada, avaliando latência, segurança, custo e requisitos de privacidade da D09. |
| D10.2 | Adotar 99,5% de disponibilidade inicial como objetivo operacional, sem garantia contratual. |
| D10.3 | Buscar RPO de 1 hora (janela de perda de dados) e RTO de 4 horas (tempo para retomar a operação segura). Verificar ambos em exercícios de recuperação. |
| D10.4 | Manter backups independentes, criptografados e testados do banco, dos arquivos e das configurações essenciais. Usar recuperação pontual (PITR) se necessária para o RPO. Testar a restauração antes do lançamento e mensalmente. |
| D10.5 | Controlar a retomada. Validar integridade financeira, permissões, exclusões e auditoria e reconciliar efeitos externos antes de reabrir a operação. |
| D10.6 | Durante falhas, manter as funções que possam operar com segurança. O núcleo financeiro permanece independente da IA. |
| D10.7 | Operar filas e agendamentos em UTC. Recuperar tarefas com idempotência persistente, reservas renováveis, retentativas configuráveis e limites de concorrência. Reconciliar efeitos externos incertos antes de repetir uma ação. |
| D10.8 | Ter monitoramento, métricas e alertas desde o lançamento. |
| D10.9 | Iniciar produção com uma instância web paga e um worker pago na Render, dimensionados por testes. Ampliar capacidade progressivamente conforme demanda e métricas. |
| D10.10 | Priorizar infraestrutura econômica. Definir orçamento definitivo após os testes. |
| D10.11 | Separar desenvolvimento, homologação e produção. Usar dados sintéticos fora de produção. |
| D10.12 | Controlar CI/CD com testes obrigatórios, migrations compatíveis e procedimentos de recuperação de versões. |
| D10.13 | Preservar portabilidade com exportação e procedimentos de migração testados. |
| D10.14 | Atribuir responsabilidades operacionais, gerir incidentes e analisar as causas das falhas. |
| D10.15 | Bloquear o lançamento comercial até comprovar segurança, integridade e capacidade de recuperação. |

**PENDÊNCIAS D05.2/D10:** região definitiva, planos comerciais, contratação, orçamento, tecnologia de backup, retenção de cópias e logs, procedimentos detalhados de recuperação, frequência de agendamentos e tratamento de execuções perdidas. Testes orientarão capacidade, expansão, máximo de tentativas e backoff, duração e renovação das reservas, concorrência global, por workspace e por provedor, além dos limiares de alertas operacionais além dos percentuais orçamentários da D12.11. Responsáveis específicos e organização do código do worker continuam em aberto.

Manter aplicação web sem estado local persistente; usar pool de conexões; paginar resultados; indexar por workspace e período; limitar concorrência por cliente e provedor. Cache financeiro precisa incorporar workspace e autorização, com invalidação após alterações. Agregados podem ser reconstruídos; não substituir a fonte de verdade por cache ou saída de IA.

Escalar mediante métricas: latência de consultas, atraso da fila, taxa de erros, saturação de conexões e custo por workspace. Particionamento, réplicas e serviços separados dependem de medições.

## 7. Operação e qualidade

**DECISÃO APROVADA — D10.11/D10.12:** separar desenvolvimento, homologação e produção, usar dados sintéticos fora de produção e controlar CI/CD com testes obrigatórios, migrations compatíveis e recuperação de versões. **PROPOSTA TÉCNICA:** secrets isolados; CI com tipos, lint, testes de domínio, integração RLS, migrations e jornadas críticas. Implantação futura por pipeline revisado, com migrations compatíveis e estratégia de correção progressiva.

Observar erros, latência, atraso de sincronização, idade dos dados, custo de IA, falhas de autorização e restauração. Definir responsáveis por incidentes e rotinas de revisão de dependências. GitHub e Codex não devem receber segredos ou extratos reais em prompts, logs ou fixtures.

## 8. Registro de decisões

Os identificadores abaixo são usados nos demais documentos. D01–D04, D05.1, a arquitetura principal da D05.2 e as decisões de D06, D07, D08, D09, D10, D11 e D12 são **DECISÃO APROVADA**. D05 e D06 ainda possuem parâmetros e detalhamentos pendentes. Seus requisitos não aprovam automaticamente estruturas de banco, contratos comerciais ou detalhes de implementação.

**DECISÃO APROVADA — D12:** a entrega é incremental, com responsabilidade e aprovação humanas por etapa. A sequência, os critérios de passagem e as metas de referência constam de [product-roadmap.md](product-roadmap.md). O aceite depende de evidências de testes. Implementação e publicação exigem autorização explícita.

| ID | Status | Conteúdo aprovado |
|---|---|---|
| D01 | DECISÃO APROVADA | Gestão pessoal, familiar e empresarial para PF, famílias, MEIs, autônomos e pequenas empresas; investimentos, planejamento, relatórios, projeções e IA; exclusões da primeira versão descritas na seção 4 |
| D02 | DECISÃO APROVADA | Três tipos de workspace; papéis e granularidade empresarial; cópia pessoal/familiar independente; convites, revogação imediata, propriedade aceita e assinatura exclusiva do owner; sem dupla aprovação geral |
| D03 | DECISÃO APROVADA | Partidas dobradas, estorno e novo lançamento, confirmação automática válida, transferências internas, saldos armazenados atômicos e conciliáveis, precisão decimal e autorização IA |
| D04 | DECISÃO APROVADA | D04.1 pnpm workspaces; D04.2 Supabase SDK; D04.3 funções transacionais PostgreSQL para operações financeiras críticas; D04.4 sem ORM inicialmente, com possível reavaliação futura |

**DECISÃO APROVADA — D05.1:** Render para Next.js; desenvolvimento local permitido sem contratação de hospedagem; produção em instância paga dimensionada por testes; PostgreSQL no Supabase; segurança e possibilidade de migração preservadas; nenhum plano comercial específico aprovado.

**DECISÃO APROVADA — D05.2:** Supabase Queues (pgmq), Render Background Worker separado do Next.js e Supabase Cron; entrega pelo menos uma vez, idempotência persistente, revalidação de permissões, isolamento, minimização, auditoria, recuperação e integridade financeira, conforme seção 6. Enfileirar não autoriza ações financeiras da IA.

**DECISÃO APROVADA — D06:** lançamento comercial com OFX/CSV e cadastro manual; prévia, seleção e confirmação; deduplicação e revisão de ambiguidades; processamento parcial recuperável e atomicidade por operação; permissões específicas; arquivos privados e retenção limitada; integração futura independente de fornecedor. Open Finance automático deixa de ser requisito do lançamento. Regras e limites de aprovação estão descritos na seção 5.

**DECISÃO APROVADA — D08:** Conversação financeira, análise de receitas e despesas, planejamento, projeções, categorização inteligente, criação de registros autorizados e análise de investimentos integram o lançamento. Conciliação assistida por IA, detecção avançada de anomalias, leitura de fotos/comprovantes e voz ficam para evolução posterior. A Responses API opera por adaptador no servidor. Ferramentas autorizadas consultam o núcleo determinístico, que permanece independente da IA. As decisões D08.1–D08.14 constam de [ai-strategy.md](ai-strategy.md).

**DECISÃO APROVADA — D09:** acesso no lançamento a partir de 18 anos completos em todos os workspaces. O acesso futuro de menores para educação financeira supervisionada depende de validações jurídicas e técnicas e da revisão de D02/D08. Em investimentos, análise, acompanhamento, planejamento e simulação têm caráter informativo conforme D09.7. As demais funcionalidades de D01–D08 mantêm seu escopo e suas regras de autorização. Os requisitos por tratamento, fornecedor e etapa comercial constam de [security.md](security.md).

**PENDÊNCIA DE DECISÃO:** parâmetros operacionais da D05.2, demais detalhes não decididos da D05 e detalhamentos pendentes da D06 e condições comerciais da D07, parâmetros da D08, detalhamentos de D09–D12 permanecem abertos. As sugestões abaixo são preservadas como **PROPOSTA TÉCNICA**, sem aprovação implícita nem autorização para implementação ou contratação.

| ID | Decisão | Proposta ou critério |
|---|---|---|
| D05.2 — parâmetros operacionais | Detalhamento da arquitetura principal aprovada | Pendências completas na seção 6; componentes e princípios aprovados não fixam limites, capacidade, planos ou procedimentos |
| D05 — detalhes restantes | Parâmetros operacionais da hospedagem | Plano comercial, dimensionamento por testes e formato de implantação a definir; plataforma web Render já aprovada em D05.1 |
| D06 — detalhamento e integração futura | Parâmetros da importação e futura seleção de provedor | Limites, retenção, homologação de formatos, contrapartidas, recuperação, políticas de sincronização e critérios técnicos/comerciais; decisões arquiteturais da seção 5 já aprovadas |
| D07 — detalhamento comercial | Cobrança e planos | D07.1–D07.14 aprovadas na seção 5. Fornecedor, preços, quotas numéricas, periodicidade, tolerância à inadimplência e demais condições pendentes. |
| D08 — detalhamento | IA | Modelos específicos, tarifas, orçamento numérico, quotas numéricas, retenção, métodos de projeção, metodologias detalhadas de avaliação e parâmetros operacionais permanecem pendentes. |
| D09 — detalhamento | Privacidade e requisitos jurídicos | Prazos de retenção, estrutura jurídica e tributária, bases legais definitivas, contratos, transferências internacionais, documentos jurídicos definitivos e requisitos de acesso futuro de menores |
| D10 — detalhamento | Continuidade | Região definitiva, planos, orçamento, tecnologia de backup, retenção, capacidade, concorrência, retentativas, limiares de alertas operacionais além dos percentuais orçamentários da D12.11 e responsáveis específicos |
| D11 — detalhamento | Políticas financeiras | Precisão física, métodos avançados de rentabilidade, instrumentos, cotações, fórmulas detalhadas, métodos definitivos de projeção e desenho físico do banco |
| D12 — detalhamento | Entrega e aceite | Disponibilidade diária, datas efetivas, orçamento numérico, fornecedores ainda a selecionar, responsáveis específicos e metodologias detalhadas de testes |

**PENDÊNCIA DE DECISÃO — detalhamento sem reabrir D01–D03:** cobertura de instrumentos e fontes de investimento; métodos de projeção; catálogo de áreas empresariais; seleção de campos/anexos na cópia familiar e seu tratamento nos relatórios; titularidade de conexões compartilhadas; frequência e procedimento de reparo da conciliação de saldos. Nenhuma dessas lacunas autoriza implementação nesta tarefa.

## 9. Riscos técnicos principais

| Risco | Mitigação proposta | Dependência |
|---|---|---|
| Vazamento entre espaços | RLS, FKs compostas, testes adversariais, cache e arquivos segregados | D02 |
| Saldos incorretos | Razão balanceado, precisão decimal, transações, reconciliação e estornos | D03/D11 |
| Open Finance indisponível ou caro | Preservar importação manual e adaptadores substituíveis; avaliar cobertura, segurança e custo antes de contratar | D06: integração automática futura, sem bloquear o lançamento manual |
| IA incorreta ou onerosa | Ferramentas restritas, avaliações, quotas e confirmação vinculada à proposta | D08 |
| Dependência de fornecedor | Domínio desacoplado, portabilidade da hospedagem, exportação e restauração testadas | D04/D05.1 e arquitetura principal D05.2 aprovadas; parâmetros operacionais, detalhamentos restantes da D05 e da D10 pendentes |
| Jobs duplicados ou interrompidos | Idempotência persistente, reservas recuperáveis, retentativas e tratamento de falhas | Arquitetura principal D05.2 aprovada; mecanismos concretos e parâmetros operacionais pendentes |
| Escopo empresarial excessivo | Critérios explícitos de lançamento e fases com aceite | D01/D12 |

Fontes técnicas consultadas em 23/11/2026. Custos, versões, limites e contratos devem ser revalidados no momento da implementação.
