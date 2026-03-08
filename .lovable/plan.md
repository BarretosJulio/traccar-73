

# O que falta para seguir o Knowledge a risca

## Análise completa: Knowledge vs. Estado Atual

### 1. Arquivos de Controle — Falta 1 de 5

| Arquivo | Status |
|---|---|
| `AI_MEMORY.md` | Criado |
| `ARCHITECTURE.md` | Criado |
| `DATABASE_SCHEMA.md` | Criado |
| `SECURITY_POLICY.md` | Criado |
| `AI_SYSTEM_PROMPT.md` | **NÃO EXISTE** |

O Knowledge lista explicitamente 5 arquivos de controle da IA. O `AI_SYSTEM_PROMPT.md` nunca foi criado. Ele deveria conter as regras de comportamento da IA (o próprio conteúdo do Knowledge, formatado como referência rápida para consulta).

### 2. Documentação — Completa

| Arquivo | Status |
|---|---|
| `API_DOCS.md` | Criado |
| `DEPLOY_GUIDE.md` | Criado |
| `CHANGELOG.md` | Criado |

### 3. Testes — ZERO implementados

O Knowledge exige:
- Testes unitários para toda funcionalidade
- Testes de integração

**Estado atual**: Nenhum arquivo de teste existe no projeto. Zero `.test.ts`, `.test.js`, `.spec.ts`.

### 4. Modularização — Parcialmente atendida

O Knowledge exige módulos com: `controller`, `service`, `repository`, `validator`, `tests`.

**Estado atual**: A estrutura segue padrão React (components, pages, hooks) — não segue o padrão modular descrito. O projeto é um frontend React, então a separação controller/service/repository se aplica mais ao backend (Edge Functions). As Edge Functions estão em arquivos monolíticos (1 arquivo por função).

### 5. Segurança — Lacunas identificadas

| Requisito | Estado |
|---|---|
| RLS no Supabase | Implementado |
| Isolamento multi-tenant | Implementado |
| Criptografia de dados sensíveis (CPF, CNPJ, telefone) | **NÃO implementado** |
| RBAC (Admin, Operador, Suporte, Cliente) | **NÃO implementado** — usa apenas `administrator` boolean do Traccar |
| Refresh tokens | Delegado ao Supabase Auth |
| LGPD (consentimento, direito ao esquecimento) | **NÃO implementado** |

### 6. Logs de Auditoria — Parcial

O Knowledge exige log de toda ação crítica com `user_id`, `ip`, `timestamp`, `ação`.

**Estado atual**: Existe `AuditPage` mas ela consome a API de auditoria do Traccar (`/api/audit`). Não existe sistema próprio de auditoria no Supabase para ações como alterações de permissões, pagamentos, etc.

### 7. Padrão de Resposta de API — Não seguido

O Knowledge exige:
```json
{ "success": true, "data": {}, "message": "" }
```

**Estado atual**: Algumas Edge Functions seguem esse padrão (`whatsapp-proxy`), mas `traccar-proxy` retorna o response direto do Traccar sem envelope.

---

## Resumo de Pendências (por prioridade)

1. **Criar `AI_SYSTEM_PROMPT.md`** — arquivo de controle faltante
2. **Testes** — nenhum teste existe no projeto
3. **RBAC** — sistema de roles inexistente (usa boolean do Traccar)
4. **Criptografia de dados sensíveis** — telefones e tokens armazenados em texto plano
5. **LGPD** — sem mecanismo de consentimento ou exclusão de dados
6. **Padronizar respostas das Edge Functions** — `traccar-proxy` não segue o envelope padrão
7. **Auditoria própria** — sem tabela de audit log no Supabase para ações do sistema
8. **Modularizar Edge Functions** — arquivos monolíticos

---

## Proposta de Próximo Passo

Criar o `AI_SYSTEM_PROMPT.md` — é o item mais rápido e resolve a lacuna nos arquivos de controle. Os demais itens (testes, RBAC, LGPD, criptografia) são implementações maiores que devem ser planejadas individualmente.

