# FINANCE AI — Estratégia de segurança e privacidade

Data: 23/11/2026. Estado: planejamento de controles, sem configuração de serviços.

## 1. Status e fronteiras de confiança

**DECISÃO APROVADA:** isolamento por workspace, PostgreSQL RLS, controle de acesso, migrations, auditoria, segurança e consideração da LGPD desde o início. Não armazenar credenciais bancárias sensíveis indevidamente; IA não altera movimentações sem autorização.

**DECISÃO APROVADA — D01–D03:** gestão pessoal, familiar e empresarial, incluindo investimentos/projeções sem executar ordens ou pagamentos; três tipos de workspace; permissões individuais e por área empresarial; cópia independente pessoal/familiar; revogação imediata; partidas dobradas, estorno e novo lançamento, confirmação automática válida e saldos armazenados com integridade.

**PROPOSTA TÉCNICA:** mecanismos de proteção deste documento materializam os requisitos aprovados, mas ainda não foram implementados ou aprovados em detalhe. **PENDÊNCIA DE DECISÃO:** parâmetros operacionais da D05.2, demais detalhes não decididos da D05 e detalhamentos pendentes da D06 e condições comerciais da D07, parâmetros da D08 e decisões D09–D12 do [registro de decisões](architecture.md#8-registro-de-decisões). D05.1 e a arquitetura principal da D05.2 estão aprovadas; documentação não equivale a controles implementados nem certificação de conformidade jurídica.

**DECISÃO APROVADA — D06:** importação OFX/CSV e cadastro manual no lançamento, com permissões específicas, arquivos privados, validação segura, processamento determinístico, confirmação do conjunto selecionado, auditoria e retenção limitada dos originais. Prazo de retenção, limites numéricos e mecanismos concretos permanecem pendentes. Open Finance automático será avaliado posteriormente.

Fronteiras: navegador não confiável; backend autenticado e autorizado; banco com RLS e grants; processadores operacionais privilegiados; provedores externos; modelo de IA e documentos tratados como fontes não confiáveis para instruções. Cada passagem precisa de validação independente.

## 2. Autenticação e sessão

**PROPOSTA TÉCNICA:** Supabase Auth; verificação de identidade no servidor conforme SDK; cookies seguros, HttpOnly quando aplicável ao fluxo escolhido, SameSite adequado, proteção contra CSRF e validação de origem nas operações mutáveis. Não confiar apenas em dados de sessão lidos do cliente. Validar expiração, emissor e destinatário dos tokens aplicáveis.

Exigir verificação de e-mail antes de aceitar convites. Adotar MFA para administradores operacionais e propor MFA para proprietários/admins de espaços compartilhados. Recuperação de conta, troca de e-mail, transferência de propriedade e encerramento de espaço exigem reautenticação conforme risco. Tempos de sessão e mecanismo de revogação permanecem detalhes técnicos; a revogação imediata do acesso após remoção já é decisão aprovada em D02.

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

**DECISÃO APROVADA:** convites individuais por e-mail, validade, uso único e aceitação obrigatória; remoção revoga imediatamente acesso e mantém registros/auditoria; transferência de propriedade exige autorização do atual e aceitação do novo owner. **PROPOSTA TÉCNICA:** validar essas condições no servidor e revalidar no momento da efetivação, sem permitir autoelevação de papel. Desativar acesso sem excluir autoria histórica.

**DECISÃO APROVADA — cópia familiar:** original pessoal privado, cópia independente, sem sincronização automática. **PROPOSTA TÉCNICA:** validar leitura na origem e criação no destino; selecionar conteúdo explicitamente; novos IDs e relações do destino; nenhuma URL, FK navegável ou referência de auditoria compartilhada que revele o original. Cópia de anexo, se futuramente autorizada, deve ser independente e submetida às políticas do destino. Não copiar segredos ou consentimentos. Mudança ou remoção de acesso ao original não sincroniza a cópia; direitos de exclusão seguem política própria.

**DECISÃO APROVADA:** operações financeiras obedecem às permissões individuais, sem exigência geral de dupla aprovação; IA só altera com autorização explícita. **PROPOSTA TÉCNICA:** IA herda permissões por workspace e área; viewer pode consultar no escopo, mas não aprovar alterações. Somente o solicitante autorizado confirma sua proposta. Gestão de papéis, encerramento e pagamentos bancários permanecem fora das ferramentas propostas. Confirmação do próprio usuário não é aprovação por duas pessoas. Transferência de propriedade tem aceitação específica do novo owner, sem criar regra geral de dupla aprovação financeira.

## 4. RLS e banco

**DECISÃO APROVADA — D04:** pnpm workspaces, Supabase SDK, funções transacionais PostgreSQL nas operações financeiras críticas e ausência inicial de ORM, com possível reavaliação futura. A decisão não concede privilégios adicionais nem altera D01–D03.

**PROPOSTA TÉCNICA — aplicação de D04:** expor somente RPCs necessárias, restringir EXECUTE e revalidar identidade, associação e permissões por área. O parâmetro workspace não prova autorização. Preservar idempotência, balanceamento, saldos e auditoria na transação. Preferir contexto do invocador quando adequado; revisar qualquer função privilegiada, sem presumir proteção por RLS em contexto que a contorne. A escolha por funções não exige privilégios elevados. Ausência de ORM não dispensa restrições e validação de entradas; SDK não autoriza escrita direta em saldos e itens.

**PROPOSTA TÉCNICA:** habilitar RLS antes de expor cada tabela e negar por padrão. SELECT exige associação ativa e condições adicionais quando necessárias; INSERT usa verificação do novo registro; UPDATE verifica registro atual e novo; DELETE é negado para dados financeiros confirmados. Conversas privadas verificam também autoria. Evitar que usuários alterem o próprio papel, assinatura, proprietário ou workspace de um registro.

Usar FKs compostas para proteger relações e RLS para proteger acesso. Políticas de associação devem evitar recursão; helpers precisam de revisão e testes. Views devem respeitar o contexto de autorização, com invocação do usuário quando suportada. Funções privilegiadas exigem grants mínimos, nomes de esquema explícitos, search_path restrito e validação completa do usuário/workspace.

Credenciais secretas/service role podem contornar RLS e não devem ser usadas em consultas comuns de usuários. A [documentação Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) descreve essas exceções e o comportamento de views. Processadores administrativos devem possuir escopo mínimo e validar o workspace associado ao job, não presumir que RLS os protege.

**DECISÃO APROVADA — D03:** confirmação automática somente após validações; inválidos/incompletos/suspeitos de duplicidade não afetam saldo. Preservar confirmados e corrigir por estorno e novo lançamento com autoria/justificativa. Saldo armazenado e movimentação devem mudar atomicamente, com idempotência, conciliação periódica e reconstrução pelo razão. Transferências são internas ao workspace, sem receita/despesa; nenhuma transferência direta entre espaços.

**PROPOSTA TÉCNICA:** transação única para lançamento balanceado, deltas de saldo e auditoria; chave idempotente com restrição única e detecção de payload divergente; controle de concorrência impede dupla execução e perda de atualização. Negar escrita direta em itens/saldos e edição de confirmados. Conciliação compara um corte consistente e registra divergências; reconstrução autorizada/auditada não reescreve histórico. Se houver conexão direta com PostgreSQL, papel e contexto transacional precisam preservar autorização; nunca usar conexão de proprietário para requisições comuns. Filas, importadores e IA passam pelas mesmas invariantes.

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

**DECISÃO APROVADA:** considerar LGPD. **PROPOSTA TÉCNICA:** inventário de tratamentos e revisão jurídica antes da produção. A [LGPD, texto compilado](https://planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm), é a referência para princípios, bases legais, direitos e segurança. Base legal deve ser definida por finalidade; consentimento de Open Finance não autoriza automaticamente todo tratamento posterior ou envio a um fornecedor de IA.

| Grupo | Finalidade proposta | Tratamento a definir |
|---|---|---|
| Cadastro e associações | Identificar usuário e autorizar acesso | Necessidade de campos, base legal, direitos e retenção |
| Dados financeiros | Gestão e relatórios contratados | Limites de uso, exclusão, exportação e obrigações aplicáveis |
| Documentos/importações | Extração e conciliação | Retenção de bruto versus normalizado, remoção e acesso |
| IA | Responder e propor ações | Minimização, transparência, fornecedores e retenção de conversas |
| Auditoria e segurança | Integridade e investigação | Retenção justificada, acesso restrito e redução de identificadores |
| Cobrança | Administrar assinatura | Responsabilidades com provedor e retenção obrigatória aplicável |

PENDÊNCIA DE DECISÃO D09: definir controlador/operador por tratamento, contratos, subprocessadores, mecanismo de transferência internacional quando aplicável, canal de direitos, política de retenção, público etário e necessidade de relatório de impacto. Dados financeiros exigem proteção forte; não classificar automaticamente todo dado financeiro como dado pessoal sensível no sentido legal.

Exportação e exclusão precisam verificar identidade e escopo. Excluir conta de um membro não apaga automaticamente registros legítimos de uma empresa. Desvincular identidade, anonimizar ou reter registros depende da finalidade e obrigação aplicável. Backups têm ciclo de expiração e procedimento para reaplicar exclusões após restauração. Revogar Open Finance interrompe coleta; não substitui pedido de exclusão nem dispensa avaliar retenção.

## 8. Auditoria, continuidade e resposta

**DECISÃO APROVADA — D05.2: arquitetura principal:** Supabase Queues (pgmq) persiste e entrega tarefas; Render Background Worker executa separadamente do Next.js; Supabase Cron dispara tarefas periódicas. Entrega pelo menos uma vez não garante execução exatamente uma vez. Controles persistentes e transacionais devem impedir duplicação de efeitos, inclusive após interrupção ou expiração de reservas.

**Controles aprovados de D05.2:** verificar escopo de cada tarefa e revalidar permissões atuais antes de executar trabalho delegado por usuário; revogação não é anulada pelo enfileiramento. Minimizar mensagens, evitando exposição de dados financeiros, pessoais e credenciais. Proteger credenciais privilegiadas do worker, com privilégios mínimos e autorização explícita nas operações críticas; não presumir que RLS protege contextos que a contornam. A fila não autoriza ações financeiras da IA. Worker preserva partidas dobradas e atualização atômica de ledger, saldos e auditoria financeira pelas funções PostgreSQL; reconhecimento do processamento respeita persistência e idempotência.

Rastrear criação, processamento, tentativas, falhas, conclusão e reprocessamento, distinguindo auditoria operacional e financeira. Recuperar tarefas interrompidas e identificar casos que exigem intervenção. **PROPOSTA TÉCNICA:** tratar falhas transitórias com retentativas controladas, permanentes com encaminhamento específico e resultados externos incertos com reconciliação antes de repetir efeitos; mecanismos concretos ainda serão definidos.

**PENDÊNCIA DE DECISÃO — D05.2/D10:** parâmetros operacionais completos em [architecture.md, seção 6](architecture.md#6-assíncrono-falhas-e-escalabilidade): frequência/fuso/execuções perdidas, tentativas/backoff, reservas/renovação, concorrência, dimensionamento/instâncias/capacidade, planos/orçamento, metas de disponibilidade/recuperação, retenção de logs/histórico, alertas/responsáveis e organização do worker. Backups, procedimentos de restauração/retomada após desastres, região e RPO/RTO continuam pendentes em D10. D05.1/D05.2 não garantem disponibilidade ou recuperação por si só; atomicidade financeira e fila persistente não substituem backups. **PROPOSTA TÉCNICA:** reconciliar efeitos externos antes de retomar tarefas restauradas.

**PROPOSTA TÉCNICA:** auditoria append-only para papéis comuns, com ator, ação, entidade, campos alterados minimizados, instante e correlação. Registrar mudanças financeiras, autorizações IA, convites, papéis, exportações, conexões e eventos administrativos. Append-only não torna o banco inviolável para administradores; avaliar cópia externa protegida e retenção conforme risco.

Logs operacionais sem payloads financeiros completos; acesso segregado e rastreado. Alertar para picos de negações, falhas de assinatura, exportações atípicas, custos excessivos e atraso de sincronização. Administração de suporte exige motivo, escopo, prazo e auditoria.

Backups, recuperação ponto a ponto quando contratada, teste de restauração e recuperação de Storage/secrets devem formar um plano conjunto. Não presumir que backup do PostgreSQL inclui objetos do Storage. RPO, RTO, região e periodicidade de teste dependem de D10 e do plano contratado.

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
