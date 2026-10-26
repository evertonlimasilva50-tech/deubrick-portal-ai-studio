# 📡 CONTRATOS DE API & ESPECIFICAÇÃO DE ENDPOINTS — DEU BRICK

Este documento define os contratos REST e schemas de Webhook para a integração entre o frontend do **Deu Brick**, a camada `ApiStorageAdapter`, o agente local Baileys no Windows e quaisquer backends futuros (Express, Supabase, Cloud Functions, NestJS, etc.).

---

## 1. Visão Geral dos Endpoints

| Método | Rota | Descrição | Nível de Acesso |
|---|---|---|---|
| `GET` | `/api/v1/health` | Healthcheck do serviço | Público |
| `POST` | `/api/v1/triad` | Registro da Tríade de Identidade | Público |
| `GET` | `/api/v1/blacklist/check` | Consulta se telefone/hash está banido | Público |
| `POST` | `/api/v1/reports` | Envio anônimo de denúncia | Público |
| `POST` | `/api/v1/webhook/whatsapp` | Webhook de mensagens recebidas (Evolution/Baileys) | Token / Segredo |
| `POST` | `/api/v1/commands/execute` | Execução direta de comandos administrativos | Moderador / Token |
| `GET` | `/api/v1/backup/export` | Exportação de backup consolidado (v1.0) | Administrador QG |

---

## 2. Detalhamento dos Endpoints

### 2.1 `POST /api/v1/triad`
Registra a Tríade de Identidade coletada no passo 3 do Quiz.

**Request Body:**
```json
{
  "fullName": "Everton Lima Silva",
  "whatsapp": "51999999999",
  "fingerprintHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "selectedCity": "Canoas",
  "category": "Eletrônicos e Celulares",
  "objective": "comprar"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "profileId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "status": "APPROVED",
  "message": "Tríade registrada com sucesso."
}
```

**Response (403 Forbidden - Dispositivo ou Telefone Banido):**
```json
{
  "success": false,
  "status": "BANNED",
  "reason": "Tentativa de golpe Pix relatada em Esteio",
  "message": "Acesso revogado pela moderação metropolitana."
}
```

---

### 2.2 `GET /api/v1/blacklist/check`
Verifica se um telefone ou fingerprint hash possui restrição ativa.

**Query Parameters:**
* `phone` (opcional): Número de telefone formatado ou numérico.
* `hash` (opcional): Fingerprint SHA-like do navegador.

**Response (200 OK - Liberado):**
```json
{
  "isBanned": false,
  "details": null
}
```

**Response (200 OK - Bloqueado):**
```json
{
  "isBanned": true,
  "details": {
    "phoneOrIdentifier": "51999999999",
    "reason": "Perfil falso identificado ofertando celulares",
    "bannedAt": "2026-03-29T18:30:00Z",
    "city": "Canoas",
    "severity": "CRITICA"
  }
}
```

---

### 2.3 `POST /api/v1/reports`
Registra uma nova denúncia anônima com provas fotográficas.

**Request Body:**
```json
{
  "targetPhone": "51988888888",
  "suspectName": "Golpista do Pix",
  "city": "Sapucaia do Sul",
  "category": "Golpe Pix / Comprovante Falso",
  "description": "Enviou comprovante agendado e exigiu a entrega da moto.",
  "evidenceImages": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ],
  "reporterFingerprint": "c7a8b9..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "protocol": "DEN-2026-8491",
  "message": "Denúncia protocolada. Nossa equipe de moderadores irá apurar os fatos."
}
```

---

### 2.4 `POST /api/v1/webhook/whatsapp`
Recebe eventos de novas mensagens do Evolution API, Z-API ou do Agente Baileys local.

**Request Headers:**
* `x-api-key`: Chave de autenticação configurada em `VITE_WHATSAPP_API_KEY`.

**Payload Padrão Normalizado:**
```json
{
  "event": "messages.upsert",
  "instance": "deubrick-central",
  "data": {
    "key": {
      "remoteJid": "120363024829183921@g.us",
      "fromMe": false,
      "id": "3EB0ABC123456789"
    },
    "pushName": "Everton Silva",
    "message": {
      "conversation": "!ban 51988888888 Suspeita de fraude"
    },
    "messageTimestamp": 1774880000
  }
}
```

**Comportamento do Motor:**
1. Valida se a mensagem começa com prefixo de comando (`!`).
2. Verifica se o remetente consta na lista de moderadores autorizados (`authorizedModerators`).
3. Se autorizado, executa o comando e grava o log no storage.
4. Responde com status HTTP 200 e payload da mensagem de resposta formatada.

**Response (200 OK):**
```json
{
  "handled": true,
  "command": "!ban",
  "responseMessage": "🚨 *DEU BRICK MODERAÇÃO*\n\n🚫 *USUÁRIO BANIDO*\n• Número: 51988888888\n• Motivo: Suspeita de fraude\n• Executado por: Everton Silva",
  "status": "sucesso"
}
```

---

### 2.5 `GET /api/v1/backup/export`
Gera o pacote consolidado de backup para auditoria e preservação de dados.

**Headers:**
* `Authorization`: `Bearer <ADMIN_SECRET_TOKEN>`

**Response (200 OK):**
Retorna o JSON do Schema v1.0 com cabeçalho `Content-Disposition: attachment; filename="deubrick_backup_YYYY-MM-DD.json"`.
