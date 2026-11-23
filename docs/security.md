# FINANCE AI — Estratégia de segurança e privacidade

Data: 23/11/2026. Estado: planejamento de controles, sem configuração de serviços.

## 1. Status e fronteiras de confiança

**DECISÃO APROVADA:** isolamento por workspace, PostgreSQL RLS, controle de acesso, migrations, auditoria, segurança e consideração da LGPD desde o início. Não armazenar credenciais bancárias sensíveis indevidamente; IA não altera movimentações sem autorização.

**DECISÃO APROVADA — D01–D03:** gestão pessoal, familiar e empresarial, incluindo investimentos/projeções sem executar ordens ou pagamentos; três tipos de workspace; permissões individuais e por área empresarial; cópia independente pessoal/familiar; revogação imediata; partidas dobradas, estorno e novo lançamento, confirmação automática válida e saldos armazenados com integridade.

**PROPOSTA TÉCNICA:** mecanismos de proteção deste documento materializam os requisitos aprovados, mas ainda não foram implementados ou aprovados em detalhe. **PENDÊNCIA DE DECISÃO:** D05, D06, D08, D09 e D10 do [registro de decisões](architecture.md#8-registro-de-decisões). Documentação não equivale a controles implementados nem certificação de conformidade jurídica.

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
| Criar lançamentos, conciliar e executar correções permitidas | Sim | No escopo concedido | No escopo concedido | Não |
| Configurar categorias e orçamentos | Sim | No escopo concedido | No escopo concedido | Não |
| Convidar/remover editor e viewer | Sim | Dentro da delegação concedida | Não | Não |
| Nomear/remover admin | Sim | Não | Não | Não |
| Gerir conexão bancária | Sim | Sim, com poderes externos válidos | Não | Não |
| Gerir assinatura do SaaS | Sim | Não | Não | Não |
| Exportar todo o workspace e consultar auditoria organizacional | Sim | Somente se todas as áreas necessárias estiverem autorizadas | Não | Não |
| Transferir propriedade | Autoriza; novo owner precisa aceitar | Não | Não | Não |
| Encerrar workspace | Sim, com reautenticação proposta | Não | Não | Não |

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

**PROPOSTA TÉCNICA:** buckets privados, metadados com workspace e políticas de Storage coerentes com associação e área. Nome/prefixo do objeto não é autorização. Para cumprir revogação imediata, acesso a arquivos compartilhados deve passar por autorização atual em cada requisição; URL assinada entregue diretamente ao cliente, válida até expirar, não satisfaz sozinha esse requisito. Usar acesso mediado/revalidado e invalidar streams/sessões controladas. Dados já baixados não podem ser recolhidos retroativamente; a revogação impede novos acessos pela plataforma.

Uploads: limitar tamanho e tipos, conferir conteúdo real, usar quarentena e varredura conforme o formato, bloquear execução de conteúdo, evitar servir HTML ativo no domínio da aplicação. Downloads e exclusões também exigem autorização. Exportações devem ter prazo de expiração e auditoria.

Segredos ficam em gerenciador apropriado, separados por ambiente, com rotação e acesso restrito. Não expor chaves OpenAI, provedor bancário, webhook ou service role em variáveis públicas, bundles, logs, GitHub ou prompts do Codex. Chaves públicas do Supabase só são aceitáveis com grants e RLS corretos.

Proteger contra XSS com escaping e sanitização de conteúdo renderizado; adotar CSP compatível com a aplicação. Não renderizar HTML arbitrário gerado pela IA. Proteger endpoints de busca de URLs contra SSRF com destinos permitidos, restrições de rede e validação de redirecionamentos. Cache, logs, exportações e respostas de erro não devem revelar outro workspace.

## 6. Open Finance e cobrança

**PROPOSTA TÉCNICA:** autenticação bancária na jornada oficial da instituição/provedor. FINANCE AI não solicita nem persiste senha bancária, OTP, CVV ou credenciais de internet banking. Armazenar identificadores externos e referências a segredos; tokens operacionais indispensáveis ficam protegidos no servidor, com ciclo de vida e escopo mínimos.

Consentimento bancário deve registrar escopos, estado, concessão, validade fornecida pelo provedor e revogação. Não presumir prazo universal. Validar titularidade e poderes de representação em PJ conforme fluxo do fornecedor. Seleção depende de avaliação contratual, regulatória, de segurança e custo; não declarar FINANCE AI participante autorizado apenas por contratar uma API.

Webhooks: verificar autenticidade conforme protocolo do fornecedor, assinatura sobre conteúdo original, proteção contra replay quando suportada e deduplicação por evento. Persistir evento válido antes de confirmar recebimento; processar em job. Não confiar em ordem de chegada; reconciliar estado com o provedor. Resolver workspace por conexão/assinatura previamente cadastrada, não por campo livre do payload.

Cobrança deve usar checkout/tokenização do provedor, sem armazenar dados completos de cartão. Permissões e plano são definidos pelo processamento confiável; retorno de sucesso no navegador não comprova pagamento.

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

**PENDÊNCIA DE DECISÃO — D05/D10:** infraestrutura, processamento assíncrono, hospedagem, contratação de backups e estratégia de recuperação continuam abertas. D04 não seleciona executor, plano de infraestrutura ou serviço de backup. Atomicidade de uma função financeira não protege, por si só, contra perda de dados ou indisponibilidade.

**PROPOSTA TÉCNICA:** auditoria append-only para papéis comuns, com ator, ação, entidade, campos alterados minimizados, instante e correlação. Registrar mudanças financeiras, autorizações IA, convites, papéis, exportações, conexões e eventos administrativos. Append-only não torna o banco inviolável para administradores; avaliar cópia externa protegida e retenção conforme risco.

Logs operacionais sem payloads financeiros completos; acesso segregado e rastreado. Alertar para picos de negações, falhas de assinatura, exportações atípicas, custos excessivos e atraso de sincronização. Administração de suporte exige motivo, escopo, prazo e auditoria.

Backups, recuperação ponto a ponto quando contratada, teste de restauração e recuperação de Storage/secrets devem formar um plano conjunto. Não presumir que backup do PostgreSQL inclui objetos do Storage. RPO, RTO, região e periodicidade de teste dependem de D10 e do plano contratado.

Resposta a incidente: detectar e classificar → conter acesso/integração → preservar evidências mínimas → avaliar impacto → recuperar e validar → cumprir comunicações aplicáveis com responsáveis jurídicos → corrigir causas. Não fixar prazos legais sem validar a regra vigente no momento.

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

Fontes consultadas em 23/11/2026; validar regras jurídicas e contratos antes de operar com dados reais.
