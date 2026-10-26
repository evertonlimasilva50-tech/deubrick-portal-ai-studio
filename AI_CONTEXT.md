# 🤖 AI_CONTEXT.MD — Guia de Orientação e Contexto para IAs e Desenvolvedores

> **Atenção:** Se você é um modelo de linguagem (LLM) ou agente de IA (Claude, GPT, Gemini, Cursor, Lovable Agent, Replit Agent, Copilot, etc.) lendo este repositório para continuar o desenvolvimento do **Deu Brick**, leia este documento **antes de alterar qualquer código**.

---

## 1. Missão e Natureza do Sistema

O **"Deu Brick"** é uma Single Page Application (SPA) em **React 19 + TypeScript + Vite + Tailwind CSS** desenhada como portal metropolitano de classificados e QG de moderação para o Rio Grande do Sul (**Canoas, Sapucaia do Sul, Esteio, Porto Alegre, Cachoeirinha, Gravataí e São Leopoldo**).

A aplicação **NÃO é um marketplace com banco de anúncios público**, nem uma rede social. Ela atua estritamente como:
1. **Portal de Entrada com Triagem Antifraude**: coleta a **Tríade de Identidade** e filtra golpistas antes de liberar o acesso aos grupos oficiais de WhatsApp.
2. **QG de Moderação e Segurança**: painel administrativo restrito para controle de lista negra, campanhas de guerrilha com QR Code vetorizado e telemetria de ameaças.
3. **Ponto de Apoio Comunitário**: canais de denúncia anônima (`/denunciar`) e código de regras (`/regras`).

---

## 2. Regras Invioláveis de Arquitetura (NUNCA VIOLE)

### 🚨 Regra 1: Anti-Share Absoluto (Zero Compartilhamento)
* **Nunca** adicione botões, links ou ícones de compartilhamento de link de grupo de WhatsApp (`chat.whatsapp.com/...`).
* O app é uma barreira de segurança. Se links soltos forem compartilhados, golpistas entram no grupo sem passar pela triagem. O app nunca espalha URLs de grupos.

### 🛡️ Regra 2: Cloaking Frontend no Acesso VIP
* Links brutos do WhatsApp (`https://chat.whatsapp.com/...`) **nunca devem aparecer no atributo `href` do HTML**.
* Em `src/components/AccessScreen.tsx`, o redirecionamento é disparado **estritamente via função programática `redirectClick`** que executa `window.location.replace` após decodificar o destino em escopo privado de execução. Isso blinda os grupos contra bots de raspagem, cliques acidentais e inspeção de DOM.

### 👤 Regra 3: Tríade de Identidade Obrigatória no Quiz
No componente `src/components/QuizScreen.tsx` (Passo 3), além da cidade e item, é **obrigatório** exigir:
* **Nome Completo (Nome Real)** com nome e sobrenome (mínimo 5 caracteres).
* **Número de WhatsApp com DDD** (mínimo 10-11 dígitos).
* Os dados devem ser salvos vinculados ao **Device Fingerprint Hash** na chave `deubrick_triad_profiles_v1`.

### ⚡ Regra 4: Portabilidade Total (Lovable, Replit, AI Studio)
* Não instale pacotes que dependam de compiladores nativos C++ ou bindings exclusivos de um único ambiente de hospedagem.
* Mantenha contratos padrão REST, JSON puro e tipos TypeScript estritos.

---

## 3. Máquina de Estados de Telas (`src/App.tsx`)

O estado da tela é controlado por `currentScreen`:

| Estado | Tela Renderizada | Descrição |
|---|---|---|
| `'welcome'` | `<WelcomeScreen />` | Tela 1: Radar de comprovantes Pix, selo anti-golpe, contador de moradores. |
| `'quiz'` | `<QuizScreen />` | Tela 2: Quiz de triagem em 3 passos com a Tríade de Identidade. |
| `'security_check'` | `<SecurityTransitionScreen />` | Tela 3: Transição animada de 2.8s com scanline, radar e checagem criptográfica. |
| `'access'` | `<AccessScreen />` | Tela 4: Emissão do passe VIP com cloaking e botão `redirectClick`. |
| `'banned'` | `<BannedScreen />` | Exibida automaticamente se o Fingerprint do aparelho estiver na Blacklist. |
| `'denunciar'` | `<ReportScreen />` | Central anônima de denúncias com upload de fotos e botão inteligente de retorno. |
| `'regras'` | `<RulesScreen />` | Diretrizes comunitárias, adesivos e pontos seguros de encontro. |

O **Painel Administrativo** é aberto independentemente através de `isAdminOpen` (acessível via `#admin` ou link do rodapé).

---

## 4. Mapeamento de Chaves de Armazenamento (`localStorage`)

Centralizadas em `STORAGE_KEYS` no arquivo `src/services/storage.ts`:

```typescript
export const STORAGE_KEYS = {
  CITIES: 'deubrick_cities_v1',                  // Configurações das 7 cidades metropolitanas
  BLACKLIST: 'deubrick_blacklist_v1',            // Telefones e hashes banidos
  REPORTS: 'deubrick_reports_v1',                // Denúncias registradas com fotos
  CAMPAIGNS: 'deubrick_campaigns_v1',            // Campanhas de guerrilha com contadores
  CURRENT_FINGERPRINT: 'deubrick_current_device_fp', // Hash do terminal atual
  VISITOR_LOGS: 'deubrick_visitor_logs_v1',      // Telemetria de acessos recentes
  TRIAD_PROFILES: 'deubrick_triad_profiles_v1',  // Registros da Tríade (Nome, WhatsApp, FP)
  USER_SELECTED_CITY: 'deubrick_user_selected_city', // Cidade gravada para retorno inteligente
  WHATSAPP_CONFIG: 'deubrick_whatsapp_config_v1', // Configurações da Evolution API / Baileys
  WHATSAPP_COMMAND_LOGS: 'deubrick_whatsapp_command_logs_v1', // Histórico de comandos via WhatsApp
} as const;
```

---

## 5. Padrão Storage Adapter (`src/services/storageAdapter.ts`)

A camada de dados foi desacoplada através do **Storage Adapter Pattern**:
* **`LocalStorageAdapter`**: implementação padrão offline-first, rápida e sem custo.
* **`ApiStorageAdapter`**: implementação pronta para se comunicar com APIs externas (ex: Supabase, Express, Render, Replit) via `fetch`, com fallback automático para o `localStorage` caso a rede oscile.
* **`getActiveStorageAdapter()`**: factory que seleciona `ApiStorageAdapter` se `VITE_API_URL` estiver presente no ambiente, ou `LocalStorageAdapter` por padrão.

---

## 6. Integração WhatsApp APIs (Baileys / Evolution API)

* **Contratos**: `src/types/whatsappIntegration.ts`
* **Motor de Comandos**: `src/services/whatsappApi.ts`
  * `!status <telefone>`: consulta na Tríade e na Blacklist.
  * `!ban <telefone> <motivo>`: restrito a moderadores autorizados; inclui na Blacklist e altera perfil na Tríade.
  * `!desban <telefone>`: restrito a moderadores; remove o bloqueio.
  * `!denuncia <telefone> <motivo>`: abre protocolo de denúncia formal no sistema.
  * `!link <cidade>`: gera link do portal oficial da cidade com triagem.
  * `!regras`: envia as regras da quebrada no chat.
  * `!ajuda`: exibe o menu de comandos.
* **Painel Admin**: aba `whatsapp_api` com simulador interativo de balões estilo WhatsApp, gestão de números autorizados e histórico de comandos auditáveis.
* **Agente Local para Windows**: `public/agent/deubrick-baileys-agent.js` (Baileys v3.1 com deduplicação de mensagens e rate limiting de 2.5s).

---

## 7. Como Alterar Código com Segurança (Checklist Anti-Regressão)

Antes de concluir qualquer turno de alteração:
1. **Verificação de Build**: execute `npm run build` ou a ferramenta de compilação.
2. **Verificação de Tipos**: execute `npm run lint` (`tsc --noEmit`) para garantir zero erros de tipagem.
3. **Preservação de Dados**: nunca apague ou altere a estrutura dos dados no `localStorage` sem fornecer migração ou fallback seguro.
4. **Sem Chaves Expostas**: nunca faça commit de senhas reais, tokens de WhatsApp ou chaves privadas no código frontend.
