# FINANCE AI — Estratégia de segurança e privacidade

Data: 23/11/2026. Estado: planejamento de controles, sem configuração de serviços.

## 1. Status e fronteiras de confiança

**DECISÃO APROVADA:** isolamento por workspace, PostgreSQL RLS, controle de acesso, migrations, auditoria, segurança e consideração da LGPD desde o início. Não armazenar credenciais bancárias sensíveis indevidamente; IA não altera movimentações sem autorização.

**DECISÃO APROVADA — D01–D03:** gestão pessoal, familiar e empresarial, incluindo investimentos/projeções sem executar ordens ou pagamentos; três tipos de workspace; permissões individuais e por área empresarial; cópia independente pessoal/familiar; revogação imediata; partidas dobradas, estorno e novo lançamento, confirmação automática válida e saldos armazenados com integridade.

**PROPOSTA TÉCNICA:** mecanismos de proteção deste documento materializam os requisitos aprovados, mas ainda não foram implementados ou aprovados em detalhe. **PENDÊNCIA DE DECISÃO:** parâmetros operacionais da D05.2, demais detalhes não decididos da D05 e detalhamentos pendentes da D06 e condições comerciais da D07, parâmetros da D08, detalhamentos de D09–D12 do [registro de decisões](architecture.md#8-registro-de-decisões). D05.1 e a arquitetura principal da D05.2 estão aprovadas; documentação não equivale a controles implementados nem certificação de conformidade jurídica.

**DECISÃO APROVADA — D06:** importação OFX/CSV e cadastro manual no lançamento, com permissões específicas, arquivos privados, validação segura, processamento determinístico, confirmação do conjunto selecionado, auditoria e retenção limitada dos originais. Prazo de retenção, limites numéricos e mecanismos concretos permanecem pendentes. Open Finance automático será avaliado posteriormente.

Fronteiras: navegador não confiável; backend autenticado e autorizado; banco com RLS e grants; processadores operacionais privilegiados; provedores externos; modelo de IA e documentos tratados como fontes não confiáveis para instruções. Cada passagem precisa de validação independente.

## 2. Autenticação e sessão

**PROPOSTA TÉCNICA:** Supabase Auth; verificação de identidade no servidor conforme SDK; cookies seguros, HttpOnly quando aplicável ao fluxo escolhido, SameSite adequado, proteção contra CSRF e validação de origem nas operações mutáveis. Não confiar apenas em dados de sessão lidos do cliente. Validar expiração, emissor e destinatário dos tokens aplicáveis.

**F1.04 aprovada:** e-mail e senha ou Google, confirmação de e-mail, recuperação de senha, MFA TOTP opcional para usuários, sessões seguras e proteção contra abuso. Manter o controle de MFA administrativo operacional e exigir reautenticação em operações sensíveis. Verificar a identidade antes de aceitar convites e preservar o mínimo de 18 anos completos em todos os workspaces. O método de verificação etária, os parâmetros de sessão e os detalhes do OAuth permanecem pendentes.

Aplicar limitação de tentativas em login, convites, exportações, IA e endpoints de integração. Não registrar senhas, cookies, JWTs, tokens de recuperação ou códigos MFA. Revogar associação deve bloquear novas operações mesmo com JWT ainda válido; consultar associação ativa, sem depender exclusivamente de claims antigos.

## 3. Autorização e colaboração

**DECISÃO APROVADA — D02:** pessoal privado, individual e sem convidados; familiar compartilhado com owner/admin/editor/viewer; empresarial compartilhado com permissões personalizáveis por área. Owner controla integralmente o workspace; admin administra operações/participantes dentro das permissões concedidas; editor cria/edita registros autorizados; viewer tem somente leitura. Somente owner administra assinatura. Nenhum papel autoriza violar integridade de D03 ou executar funções fora do escopo D01.

**PROPOSTA TÉCNICA — matriz operacional:** a tabela detalha uma proposta de distribuição de ações, não amplia os direitos aprovados. No empresarial, toda ação depende também da área e permissão efetiva; associação ao workspace ou nome do papel não basta. O catálogo de áreas, delegação e precedência entre permissões ainda precisa ser definido.

| Ação | Owner | Admin | Editor | Viewer |
|---|---|---|---|---|
| Consultar dados financeiros | Sim | No escopo concedido | No escopo concedido | No escopo de leitura concedido |
| Confirmar e registrar movimentações e executar correções permitidas | Sim | No escopo concedido | No escopo concedido | Não |
| Preparar importações | Sim | Mediante permissão específica no escopo concedido | Mediante permissão específica no escopo concedido | Não |
| Conciliar e resolver duplicidades | Sim | Mediante permissão específica no escopo concedido | Mediante permissão específica no escopo concedido | Não |
| Acessar extratos originais completos | No próprio workspace | Somente com permissão específica e cobertura de todo o conteúdo | Somente com permissão específica e cobertura de todo o conteúdo | Somente com permissão específica de leitura e cobertura de todo o conteúdo |
| Configurar categorias e orçamentos | Sim | No escopo concedido | No escopo concedido | Não |
| Convidar/remover editor e viewer | Sim | Dentro da delegação concedida | Não | Não |
| Nomear/remover admin | Sim | Não | Não | Não |
| Gerir conexão bancária | Sim | Sim, com poderes externos válidos | Não | Não |
| Gerir assinatura do SaaS | Sim | Não | Não | Não |
| Exportar todo o workspace e consultar auditoria organizacional | Sim | Somente se todas as áreas necessárias estiverem autorizadas | Não | Não |
| Transferir propriedade | Autoriza; novo owner precisa aceitar | Não | Não | Não |
| Encerrar workspace | Sim, com reautenticação proposta | Não | Não | Não |

**DECISÃO APROVADA — D06:** distinguir consulta financeira, preparação de importações, confirmação/registro de movimentações, conciliação/resolução de duplicidades e acesso aos extratos originais completos. Aplicar workspace, área autorizada, RLS e revogações em todos os caminhos. Preparar ou visualizar uma importação não concede automaticamente permissão para registrar movimentações ou obter o arquivo completo.

**PROPOSTA TÉCNICA:** a matriz acima detalha concessões sujeitas a revisão. A prévia deve limitar-se às áreas autorizadas; quando um extrato completo incluir dados fora do escopo do usuário, negar seu acesso integral. A confirmação exige autorização sobre todos os itens selecionados. Revalidar antes da efetivação, inclusive após permanência na fila. O próprio usuário pode preparar e confirmar se possuir ambas as permissões; não se cria exigência geral de dupla aprovação.

Papéis não dão poderes bancários externos. Participação familiar ou empresarial não concede visibilidade do espaço pessoal dos membros. Suporte não recebe acesso financeiro por padrão. Controle integral do owner se limita ao próprio workspace; não permite acessar originais pessoais apenas porque uma cópia foi compartilhada.

**F1.07–F1.09 aprovadas:** negar por padrão operações empresariais sem permissão efetiva na área. Revalidar no servidor a associação, o destinatário e os privilégios na efetivação. Convites individuais valem por 7 dias, têm uso único e revogação imediata. O reenvio invalida o token anterior. Transferências de propriedade valem por 24 horas e exigem reautenticação, autorização do owner atual e aceite do novo. Proteger os tokens de ambos os fluxos e efetivar a troca atomicamente, preservando um único owner. A remoção revoga imediatamente o acesso e preserva os registros de auditoria.

**DECISÃO APROVADA — cópia familiar:** original pessoal privado, cópia independente, sem sincronização automática. **PROPOSTA TÉCNICA:** validar leitura na origem e criação no destino; selecionar conteúdo explicitamente; novos IDs e relações do destino; nenhuma URL, FK navegável ou referência de auditoria compartilhada que revele o original. Cópia de anexo, se futuramente autorizada, deve ser independente e submetida às políticas do destino. Não copiar segredos ou consentimentos. Mudança ou remoção de acesso ao original não sincroniza a cópia; direitos de exclusão seguem política própria.

**DECISÃO APROVADA:** operações financeiras obedecem às permissões individuais, sem exigência geral de dupla aprovação; IA só altera com autorização explícita. **PROPOSTA TÉCNICA:** IA herda permissões por workspace e área; viewer pode consultar no escopo, mas não aprovar alterações. Somente o solicitante autorizado confirma sua proposta. Gestão de papéis, encerramento e pagamentos bancários permanecem fora das ferramentas propostas. Confirmação do próprio usuário não é aprovação por duas pessoas. Transferência de propriedade tem aceitação específica do novo owner, sem criar regra geral de dupla aprovação financeira.

## 4. RLS e banco

**DECISÃO APROVADA — D04:** pnpm workspaces, Supabase SDK, funções transacionais PostgreSQL nas operações financeiras críticas e ausência inicial de ORM, com possível reavaliação futura. A decisão não concede privilégios adicionais nem altera D01–D03.

**PROPOSTA TÉCNICA — aplicação de D04:** expor somente RPCs necessárias, restringir EXECUTE e revalidar identidade, associação e permissões por área. O parâmetro workspace não prova autorização. Preservar idempotência, balanceamento, saldos e auditoria na transação. Preferir contexto do invocador quando adequado; revisar qualquer função privilegiada, sem presumir proteção por RLS em contexto que a contorne. A escolha por funções não exige privilégios elevados. Ausência de ORM não dispensa restrições e validação de entradas; SDK não autoriza escrita direta em saldos e itens.

**F1.08 aprovada:** exigir RLS em toda tabela exposta, autorização no servidor, privilégios mínimos, funções restritas e testes de isolamento. **Proposta técnica para as políticas detalhadas:** verificar associação ativa e escopo na leitura e validar o registro atual e o novo nas alterações. Bloquear exclusão de lançamentos confirmados e elevação de papel pelo próprio usuário. Conversas privadas exigem também autoria.

Usar FKs compostas para proteger relações e RLS para proteger acesso. Políticas de associação devem evitar recursão; helpers precisam de revisão e testes. Views devem respeitar o contexto de autorização, com invocação do usuário quando suportada. Funções privilegiadas exigem grants mínimos, nomes de esquema explícitos, search_path restrito e validação completa do usuário/workspace.

Credenciais secretas/service role podem contornar RLS e não devem ser usadas em consultas comuns de usuários. A [documentação Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) descreve essas exceções e o comportamento de views. Processadores administrativos devem possuir escopo mínimo e validar o workspace associado ao job, não presumir que RLS os protege.

**DECISÃO APROVADA — D03:** confirmação automática somente após validações; inválidos/incompletos/suspeitos de duplicidade não afetam saldo. Preservar confirmados e corrigir por estorno e novo lançamento com autoria/justificativa. Saldo armazenado e movimentação devem mudar atomicamente, com idempotência, conciliação periódica e reconstrução pelo razão. Transferências são internas ao workspace, sem receita/despesa; nenhuma transferência direta entre espaços.

**PROPOSTA TÉCNICA:** transação única para lançamento balanceado, deltas de saldo e auditoria; chave idempotente com restrição única e detecção de payload divergente; controle de concorrência impede dupla execução e perda de atualização. Negar escrita direta em itens/saldos e edição de confirmados. Conciliação compara um corte consistente e registra divergências; reconstrução autorizada/auditada não reescreve histórico. Se houver conexão direta com PostgreSQL, papel e contexto transacional precisam preservar autorização; nunca usar conexão de proprietário para requisições comuns. Filas, importadores e IA passam pelas mesmas invariantes.

**DECISÃO APROVADA — D11.11–D11.13:** validar o período na operação transacional, inclusive para importações, workers e ações autorizadas da IA. Bloquear efeitos retroativos em período fechado. Reabrir somente com autorização e auditoria no workspace. Preservar os originais em estornos, devoluções e reembolsos e registrar a resolução de divergências de conciliação.

Permissões por área devem alcançar consultas, agregados, exportações, RPCs, arquivos e ferramentas IA. Não basta esconder menus. **PROPOSTA TÉCNICA:** revalidar associação e permissões no acesso e antes de efetivar escrita/resposta de tarefa delegada, invalidar caches de autorização e encerrar canais ativos na remoção; jobs não podem executar em nome de membro removido. Definir ordenação entre remoção e commit concorrente para impedir que revogação efetivada seja ignorada por trabalho pendente.

## 5. Arquivos, segredos e aplicação web

**DECISÃO APROVADA — D05.1:** Render hospeda inicialmente a aplicação Next.js, com instância paga em produção dimensionada por testes de desempenho, segurança e capacidade; desenvolvimento pode ser local sem contratação de hospedagem. PostgreSQL permanece no Supabase, nenhum plano comercial específico está aprovado e a arquitetura deve permitir evolução/migração. A hospedagem preserva isolamento por workspace, autenticação, autorização e proteção dos dados financeiros.

**PROPOSTA TÉCNICA — controles de implantação:** validar comunicação cifrada entre navegador, aplicação e Supabase; proteger credenciais de implantação e segredos por ambiente; restringir acesso administrativo e evitar dados financeiros em logs de build/execução. Verificar sessão, callbacks de autenticação, autorização por área, RLS, cache e acesso a arquivos no ambiente hospedado. Reinícios e novas instâncias não podem misturar espaços ou depender de sessão/autorização mantida apenas em memória. Manter configuração de hospedagem separada do domínio para facilitar migração. Esses controles são requisitos de validação futura, não configurações realizadas nesta tarefa.

**PROPOSTA TÉCNICA:** buckets privados, metadados com workspace e políticas de Storage coerentes com associação e área. Nome/prefixo do objeto não é autorização. Para cumprir revogação imediata, acesso a arquivos compartilhados deve passar por autorização atual em cada requisição; URL assinada entregue diretamente ao cliente, válida até expirar, não satisfaz sozinha esse requisito. Usar acesso mediado/revalidado e invalidar streams/sessões controladas. Dados já baixados não podem ser recolhidos retroativamente; a revogação impede novos acessos pela plataforma.

Uploads: limitar tamanho e tipos, conferir conteúdo real, usar quarentena e varredura conforme o formato, bloquear execução de conteúdo, evitar servir HTML ativo no domínio da aplicação. Downloads e exclusões também exigem autorização. Exportações devem ter prazo de expiração e auditoria.

**DECISÃO APROVADA — D06:** arquivos OFX/CSV ficam em armazenamento privado, com validação de uploads e proteção contra conteúdo malicioso. Aplicar limites configuráveis de upload, registros, armazenamento, concorrência e processamento. Valores numéricos serão definidos por testes; arquivos inválidos são rejeitados sem tentativas infinitas.

**PROPOSTA TÉCNICA:** validar conteúdo e estrutura além de extensão/MIME; usar nomes internos gerados, quarentena e limites de recursos do parser. Em OFX/XML, desabilitar resolução externa e mecanismos que permitam acesso indevido a rede ou arquivos. Em CSV, tratar células como dados, sem executar fórmulas; escapar conteúdo na interface e proteger futuras exportações para planilhas. Erros e rejeições devem ser apresentados sem expor dados de outros espaços.

**DECISÃO APROVADA — retenção:** manter histórico de importações e evidências de auditoria, com retenção limitada dos arquivos originais. Minimizar dados financeiros em logs e interações com IA. Prazo exato e descarte permanecem pendentes.

**PROPOSTA TÉCNICA:** separar retenção do original, observações normalizadas, evidências de confirmação/idempotência e auditoria. Registrar descarte sem manter cópias integrais ocultas em logs. A política deve abranger backups e reprocessamento; excluir o original não autoriza apagar o histórico financeiro confirmado.

Segredos ficam em gerenciador apropriado, separados por ambiente, com rotação e acesso restrito. Não expor chaves OpenAI, provedor bancário, webhook ou service role em variáveis públicas, bundles, logs, GitHub ou prompts do Codex. Chaves públicas do Supabase só são aceitáveis com grants e RLS corretos.

Proteger contra XSS com escaping e sanitização de conteúdo renderizado; adotar CSP compatível com a aplicação. Não renderizar HTML arbitrário gerado pela IA. Proteger endpoints de busca de URLs contra SSRF com destinos permitidos, restrições de rede e validação de redirecionamentos. Cache, logs, exportações e respostas de erro não devem revelar outro workspace.

## 6. Open Finance e cobrança

**DECISÃO APROVADA — D06:** Open Finance automático não é obrigatório no lançamento. Os controles bancários abaixo se aplicam à futura integração, sem contratação ou implementação nesta etapa. Upload e confirmação de arquivo não constituem consentimento bancário nem autorizam coletas futuras.

**PROPOSTA TÉCNICA:** autenticação bancária na jornada oficial da instituição/provedor. FINANCE AI não solicita nem persiste senha bancária, OTP, CVV ou credenciais de internet banking. Armazenar identificadores externos e referências a segredos; tokens operacionais indispensáveis ficam protegidos no servidor, com ciclo de vida e escopo mínimos.

Consentimento bancário deve registrar escopos, estado, concessão, validade fornecida pelo provedor e revogação. Não presumir prazo universal. Validar titularidade e poderes de representação em PJ conforme fluxo do fornecedor. Seleção depende de avaliação contratual, regulatória, de segurança e custo; não declarar FINANCE AI participante autorizado apenas por contratar uma API.

Webhooks: verificar autenticidade conforme protocolo do fornecedor, assinatura sobre conteúdo original, proteção contra replay quando suportada e deduplicação por evento. Persistir evento válido antes de confirmar recebimento; processar em job. Não confiar em ordem de chegada; reconciliar estado com o provedor. Resolver workspace por conexão/assinatura previamente cadastrada, não por campo livre do payload.

**DECISÃO APROVADA — D07:** somente o owner administra a assinatura do workspace. O teste gratuito de 7 dias dispensa cartão e exige prevenção de abuso. Cobranças automáticas exigem autorização. Usar checkout seguro sem armazenar número completo de cartão ou CVV. Validar planos e quotas no servidor. A inadimplência permite restrições progressivas, preservando consulta, exportação e dados conforme as permissões existentes.

**DECISÃO APROVADA — eventos de cobrança:** autenticar webhooks, tratar reentregas com idempotência e conciliar com o provedor. Auditar assinaturas, planos e pagamentos. **PROPOSTA TÉCNICA:** resolver o workspace pela associação interna à assinatura, registrar ator, evento e resultado sem dados de cartão e confirmar pagamentos por evidência do provedor. O retorno do navegador não comprova pagamento. Os controles específicos contra abuso e a política comercial de inadimplência permanecem pendentes.

## 7. Privacidade e LGPD

**DECISÃO APROVADA:** manter inventário de tratamentos e realizar a revisão prevista em D09.14. A [LGPD, texto compilado](https://planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm), é a referência para princípios, bases legais, direitos e segurança. Base legal deve ser definida por finalidade; consentimento de Open Finance não autoriza automaticamente todo tratamento posterior ou envio a um fornecedor de IA.

| Grupo | Finalidade proposta | Tratamento a definir |
|---|---|---|
| Cadastro e associações | Identificar usuário e autorizar acesso | Necessidade de campos, base legal, direitos e retenção |
| Dados financeiros | Gestão e relatórios contratados | Limites de uso, exclusão, exportação e obrigações aplicáveis |
| Documentos/importações | Extração e conciliação | Retenção de bruto versus normalizado, remoção e acesso |
| IA | Responder e propor ações | Minimização, transparência, fornecedores e retenção de conversas |
| Auditoria e segurança | Integridade e investigação | Retenção justificada, acesso restrito e redução de identificadores |
| Cobrança | Administrar assinatura | Responsabilidades com provedor e retenção obrigatória aplicável |

**DECISÕES APROVADAS — D09**

| ID | Requisito |
|---|---|
| D09.1 | Identificar em cada tratamento quem atua como controlador e quem atua como operador, conforme suas responsabilidades. |
| D09.2 | Manter inventário de tratamentos e vincular cada finalidade à respectiva base legal, sujeita a validação definitiva. |
| D09.3 | No lançamento, todos os usuários devem ter 18 anos completos ou mais, inclusive convidados de workspaces familiares. A educação financeira supervisionada para menores depende de validações jurídicas e técnicas e da revisão de D02 e D08. |
| D09.4 | Disponibilizar mecanismos para receber, verificar, atender e acompanhar solicitações de exercício dos direitos dos titulares. |
| D09.5 | Definir retenção e exclusão por categoria de dados. Os prazos serão definidos posteriormente. |
| D09.6 | Submeter fornecedores e transferências internacionais à validação jurídica, contratual e de segurança. |
| D09.7 | No contexto de investimentos, o FINANCE AI oferecerá análise, acompanhamento, planejamento e simulação de caráter informativo, sem prestar consultoria regulamentada, recomendar individualmente a compra, venda ou alocação de valores mobiliários, executar ordens ou garantir rentabilidade. Essa restrição não limita as demais funcionalidades aprovadas em D01–D08, incluindo gestão financeira, importação de extratos, conciliação, categorização, criação de registros e execução de operações internas pela IA mediante autorização explícita, respeitando o escopo e as permissões estabelecidas. |
| D09.8 | Versionar a documentação jurídica e as políticas antes do lançamento comercial. |
| D09.9 | Respeitar os direitos do consumidor. O teste gratuito de sete dias previsto na D07 é uma condição comercial distinta do direito de arrependimento aplicável à contratação. |
| D09.10 | Manter resposta a incidentes. Quando a comunicação for obrigatória, adotar meta interna de até três dias úteis, respeitando os prazos legais aplicáveis, inclusive prazo menor. |
| D09.11 | Disponibilizar canal de privacidade, identificar o responsável pelo tratamento e designar encarregado quando exigido. |
| D09.12 | Proibir a comercialização de dados financeiros e a publicidade baseada nesses dados. No lançamento, proibir o treinamento de modelos com dados dos clientes. |
| D09.13 | Usar dados sintéticos no desenvolvimento e nos testes. Avaliar impactos dos tratamentos e elaborar relatório quando necessário. |
| D09.14 | Concluir revisão jurídica, regulatória, fiscal, contratual e de segurança antes da operação comercial com dados reais. |
| D09.15 | Assegurar transparência e mecanismos de revisão e contestação das decisões automatizadas, quando aplicáveis. |

**PENDÊNCIAS DA D09:** prazos de retenção por categoria, estrutura jurídica e tributária, validação definitiva das bases legais, contratos e subprocessadores, transferências internacionais e respectivos mecanismos, documentos jurídicos definitivos e requisitos para eventual acesso de menores.

Dados financeiros exigem proteção forte; não classificar automaticamente todo dado financeiro como dado pessoal sensível no sentido legal.

Exportação e exclusão precisam verificar identidade e escopo. Excluir conta de um membro não apaga automaticamente registros legítimos de uma empresa. Desvincular identidade, anonimizar ou reter registros depende da finalidade e obrigação aplicável. Backups têm ciclo de expiração e procedimento para reaplicar exclusões após restauração. Revogar Open Finance interrompe coleta; não substitui pedido de exclusão nem dispensa avaliar retenção.

## 8. Auditoria, continuidade e resposta

**DECISÃO APROVADA — D05.2: arquitetura principal:** Supabase Queues (pgmq) persiste e entrega tarefas; Render Background Worker executa separadamente do Next.js; Supabase Cron dispara tarefas periódicas. Entrega pelo menos uma vez não garante execução exatamente uma vez. Controles persistentes e transacionais devem impedir duplicação de efeitos, inclusive após interrupção ou expiração de reservas.

**Controles aprovados de D05.2:** verificar escopo de cada tarefa e revalidar permissões atuais antes de executar trabalho delegado por usuário; revogação não é anulada pelo enfileiramento. Minimizar mensagens, evitando exposição de dados financeiros, pessoais e credenciais. Proteger credenciais privilegiadas do worker, com privilégios mínimos e autorização explícita nas operações críticas; não presumir que RLS protege contextos que a contornam. A fila não autoriza ações financeiras da IA. Worker preserva partidas dobradas e atualização atômica de ledger, saldos e auditoria financeira pelas funções PostgreSQL; reconhecimento do processamento respeita persistência e idempotência.

Rastrear criação, processamento, tentativas, falhas, conclusão e reprocessamento, distinguindo auditoria operacional e financeira. Recuperar tarefas interrompidas e identificar casos que exigem intervenção. **PROPOSTA TÉCNICA:** tratar falhas transitórias com retentativas controladas, permanentes com encaminhamento específico e resultados externos incertos com reconciliação antes de repetir efeitos; mecanismos concretos ainda serão definidos.

**DECISÃO APROVADA — D10:** separar ambientes e usar dados sintéticos fora de produção. Manter monitoramento, métricas e alertas desde o lançamento, com responsáveis pela gestão de incidentes e análise das causas. Em recuperação, confirmar o isolamento por workspace, revogações de acesso, exclusões, auditoria e integridade financeira. Reconciliar efeitos externos incertos antes de reativar o processamento. Segurança, integridade e recuperação exigem comprovação antes do lançamento comercial. Limiares adicionais aos da D12, responsáveis específicos e parâmetros operacionais permanecem abertos conforme [architecture.md, seção 6](architecture.md#6-assíncrono-falhas-e-escalabilidade).

**CRITÉRIOS APROVADOS — D12.9/D12.13/D12.14:** exigir zero vulnerabilidades altas ou críticas não mitigadas e aprovação integral dos testes de isolamento e autorização. Beta interno individual usa dados sintéticos. No beta fechado e no piloto, dados reais dependem das validações aplicáveis e de ambiente apropriado, preservada a exigência de dados sintéticos fora de produção. O lançamento comercial depende também de validações jurídicas e fiscais e de responsáveis operacionais definidos.

**PROPOSTA TÉCNICA:** auditoria append-only para papéis comuns, com ator, ação, entidade, campos alterados minimizados, instante e correlação. Registrar mudanças financeiras, autorizações IA, convites, papéis, exportações, conexões e eventos administrativos. Append-only não torna o banco inviolável para administradores; avaliar cópia externa protegida e retenção conforme risco.

Logs operacionais sem payloads financeiros completos; acesso segregado e rastreado. Alertar para picos de negações, falhas de assinatura, exportações atípicas, custos excessivos e atraso de sincronização. Administração de suporte exige motivo, escopo, prazo e auditoria.

Proteger com criptografia os backups independentes de banco, arquivos e configurações essenciais. Testar a restauração mensalmente e antes do lançamento, incluindo objetos de Storage e acesso controlado às configurações. Avaliar a região das cópias conforme D10.1 e D09. As metas de recuperação são RPO de 1 hora e RTO de 4 horas. A tecnologia, a região definitiva e a retenção continuam pendentes.

Resposta a incidente: detectar e classificar → conter acesso/integração → preservar evidências mínimas → avaliar impacto → recuperar e validar → cumprir comunicações aplicáveis com responsáveis jurídicos → corrigir causas. Não fixar prazos legais sem validar a regra vigente no momento.

**DECISÃO APROVADA — D08:** tratar conteúdo financeiro externo como dados e proteger a memória privada do autor por workspace. Prevenir prompt injection, vazamentos e manipulação das ferramentas por validação no servidor, com escopo e privilégios restritos e sem acesso direto do modelo a SQL ou credenciais. Revalidar permissões, validade, hash e versões da proposta imutável antes de executar a ação explicitamente autorizada. Minimizar dados enviados ao fornecedor e excluir inicialmente fine-tuning com dados de clientes. Falhas de isolamento ou alterações não autorizadas bloqueiam o lançamento.

## 9. Critérios de aceite de segurança

- Dois usuários e dois espaços não conseguem acessar dados cruzados por API, IDs adivinhados, RPC, arquivos, cache, jobs ou IA.
- Usuário removido perde imediatamente novos acessos, inclusive arquivos, cache, canais e tarefas delegadas; viewer não escreve; admin não se promove a owner; somente owner administra assinatura.
- Pessoal não aceita convidados; familiar não acessa originais pessoais; cópia independente não se sincroniza nem expõe links privados; empresarial respeita permissões por área em todos os caminhos.
- Convite expirado/reutilizado/não aceito não autoriza; transferência de propriedade sem autorização atual e aceitação nova não efetiva.
- Confirmação automática válida mantém partidas equilibradas e saldo atômico; pendência/rejeição não muda saldo; retry não duplica; correção preserva original, autoria e justificativa.
- Conciliação e reconstrução de saldos funcionam sob concorrência; nenhuma transferência direta entre workspaces é permitida.
- Credencial privilegiada nunca aparece no bundle, logs ou repositório; tarefas privilegiadas têm escopo e auditoria verificáveis.
- Webhook inválido/repetido/fora de ordem não duplica efeitos nem eleva plano indevidamente.
- Proposta da IA alterada, expirada, já executada ou com permissão revogada não executa.
- Restauração recupera banco e arquivos e preserva isolamento; exclusões são reaplicadas conforme política.
- Migrations e novos endpoints não entram em produção sem verificações de autorização e dados sintéticos.
- Preparação, confirmação, conciliação e acesso a extratos completos respeitam permissões distintas; prévias não revelam áreas não autorizadas.
- Arquivos inválidos ou maliciosos são rejeitados com consumo limitado de recursos; datas/valores ambíguos não geram registro definitivo sem resolução.
- Lote interrompido retoma sem duplicar efeitos; cada operação mantém ledger, saldos e auditoria atômicos; descarte do original respeita a política sem apagar lançamentos confirmados.

Fontes consultadas em 23/11/2026; validar regras jurídicas e contratos antes de operar com dados reais.
