# 👑 DEU BRICK — Classificados da Quebrada RS (V3.1)

> **Rede metropolitana de classificados blindada contra golpes** para a Região Metropolitana de Porto Alegre: **Canoas, Sapucaia do Sul, Esteio, Porto Alegre, Cachoeirinha, Gravataí e São Leopoldo**.

O **Deu Brick** opera estritamente como um **portal de entrada (triagem e verificação com Tríade de Identidade)**, **QG de moderação** e **Central de Suporte e Denúncias**, canalizando compradores e vendedores verificados com segurança diretamente para seus grupos locais de WhatsApp através de **Cloaking Frontend** avançado.

---

## 🎯 Pilares e Diretrizes Inegociáveis

1. **Anti-Share Absoluto (Zero Compartilhamento)**:
   - Não existe nenhuma opção, botão ou ícone de compartilhamento de URLs de grupos (`chat.whatsapp.com`) no aplicativo.
   - O app atua exclusivamente como portal de entrada e QG, impedindo o espalhamento indiscriminado de links para proteger os grupos contra bots e golpistas.

2. **Tríade de Identidade & Device Fingerprint**:
   - Captura silenciosa e automatizada dos metadados de hardware e navegador no carregamento inicial (`useEffect`).
   - O Quiz de Triagem exige obrigatoriamente: **Cidade**, **Objetivo**, **Item de Interesse**, **Nome Completo (Nome Real)** e **WhatsApp com DDD**.
   - Os registros são persistidos estruturados e vinculados ao hash do Fingerprint para controle de fraudes e auditoria por IA.

3. **Funil de 4 Telas com Cloaking Frontend**:
   - **Tela 1: Boas-vindas** — Canal de radar antifraude, selo anti-golpe e contador dinâmico de moradores.
   - **Tela 2: Quiz de Triagem** — Tríade de Identidade obrigatória.
   - **Tela 3: Transição Antifraude (2.8s)** — Radar tático, scanline animado e checagem criptográfica.
   - **Tela 4: Liberação VIP** — Passe digital verificado com redirecionamento programático via `window.location.replace` (zero links em atributos `href` do DOM).

4. **QG Interno e Botão Inteligente de Retorno**:
   - Central de Denúncias anônima (`/denunciar`) com upload de comprovantes fotográficos.
   - Regras da Quebrada (`/regras`) com código comunitário e pontos de encontro seguros (estações de trem e praças).
   - Botão Inteligente de Retorno em loop fechado em todas as páginas internas.

5. **Integração WhatsApp APIs (Baileys / Evolution API)**:
   - Motor tático de processamento de comandos recebidos diretamente pelo WhatsApp (`!status`, `!ban`, `!desban`, `!denuncia`, `!link`, `!regras`, `!ajuda`).
   - Script autônomo Node.js Baileys pronto para rodar no Windows do moderador (`public/agent/deubrick-baileys-agent.js`).

---

## 🛠️ Stack Tecnológica

* **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion, Lucide React, Recharts (gráficos de ameaças), Canvas-Confetti, QrCode.react (geração de QR Code vetorizado de alta performance).
* **Storage Layer**: Padrão *Dual-Driver Storage Adapter* (`LocalStorageAdapter` padrão offline-first gratuito + `ApiStorageAdapter` pronto para backend externo via `VITE_API_URL`).
* **WhatsApp Gateway**: Suporte para Baileys local e Evolution API v2 (Docker).

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
* Node.js v18+ instalado
* NPM ou Bun instalado

### 2. Instalação e Execução
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (porta 3000)
npm run dev

# Compilar para produção
npm run build

# Validação de tipos TypeScript
npm run lint
```

Acesse no navegador: `http://localhost:3000`

---

## 🔐 Acesso ao Painel Administrativo

* Rota direta: `http://localhost:3000/#admin` (ou clique no link discreto no rodapé)
* Senhas de acesso de desenvolvimento: `deubrick2025` ou `admin123`

### Módulos do Painel:
* **Fábrica de Links & QR**: Criação de campanhas de guerrilha com thumbnails, contadores de cliques/scans e download de QR Codes em alta resolução (1024px).
* **Tríade & Antifraude**: Tabela cruzando Fingerprint, Nome Real, WhatsApp, Risco e Status, com busca dinâmica e exportação JSON para agentes externos de IA.
* **WhatsApp APIs & Baileys**: Simulador interativo de comandos do WhatsApp, configuração de endpoints, histórico de auditoria e lista de números autorizados.
* **Central de Denúncias**: Gestão de relatos com imagens de comprovantes e botão de banimento imediato.
* **Blacklist & Terminais Bloqueados**: Lista de aparelhos impedidos de entrar na rede e dashboard de telemetria em tempo real com Recharts.
* **Central de Backup Geral (Etapa 1A)**: Download seguro com schema v1.0 e conferência de integridade em memória das 8 chaves reais de armazenamento.

---

## 📂 Estrutura de Diretórios

```
├── .env.example                     # Variáveis de ambiente documentadas
├── AI_CONTEXT.md                    # Guia completo para IAs auxiliares e LLMs
├── ARCHITECTURE.md                  # Especificação arquitetural do sistema
├── API_CONTRACTS.md                 # Contratos REST / JSON da API
├── public/
│   ├── agent/                       # Agente local Baileys para Windows
│   │   └── deubrick-baileys-agent.js
│   ├── images/                      # Assets gráficos e flyers
│   ├── icon.svg                     # Ícone PWA
│   └── manifest.json                # Manifesto PWA
├── src/
│   ├── components/
│   │   ├── AccessScreen.tsx         # Tela 4: Liberação VIP e cloaking
│   │   ├── AdminPanel.tsx           # Painel de moderação e guerrilha
│   │   ├── BannedScreen.tsx         # Tela de bloqueio para terminais na blacklist
│   │   ├── Header.tsx               # Barra superior com logo e indicadores
│   │   ├── QuizScreen.tsx           # Tela 2: Triagem e Tríade de Identidade
│   │   ├── RealTimeThreatDashboard.tsx # Telemetria com Recharts
│   │   ├── ReportScreen.tsx         # Central de denúncias (/denunciar)
│   │   ├── RulesScreen.tsx          # Regras da quebrada (/regras)
│   │   ├── SecurityTransitionScreen.tsx # Tela 3: Transição animada (2.8s)
│   │   ├── WelcomeScreen.tsx        # Tela 1: Boas-vindas com radar
│   │   └── WhatsAppApiPanel.tsx     # Módulo de controle WhatsApp APIs
│   ├── services/
│   │   ├── cloaking.ts              # Redirecionamento programático e ofuscação
│   │   ├── storage.ts               # CRUD local e gerador de backup seguro
│   │   ├── storageAdapter.ts        # Padrão Dual-Driver (Local vs API)
│   │   └── whatsappApi.ts           # Motor de comandos e webhook parser
│   ├── types/
│   │   ├── index.ts                 # Tipos centrais do domínio
│   │   └── whatsappIntegration.ts   # Tipos e contratos de WhatsApp
│   ├── App.tsx                      # Orquestrador de telas e rotas
│   ├── main.tsx                     # Ponto de entrada React
│   └── index.css                    # Estilos Tailwind e tipografia stencil
```
