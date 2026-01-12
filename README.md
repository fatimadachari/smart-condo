# 🏢 SmartCondo

> **Sistema SaaS para Gestão Inteligente de Condomínios**

O **SmartCondo** é uma plataforma *full-stack* desenvolvida sob arquitetura **Monorepo**, projetada para oferecer escalabilidade, segurança e uma experiência de usuário fluida. O projeto unifica a gestão administrativa (unidades, moradores) com a operacional (reservas, avisos) em um ecossistema tipado de ponta a ponta.

---

## 🚀 Funcionalidades Principais

O sistema já conta com os seguintes módulos operacionais:

### 🔐 Controle de Acesso & Segurança

* **Autenticação JWT:** Login seguro com persistência de sessão.
* **Proteção de Rotas:** Middlewares e Guards (NestJS/Next.js) garantindo acesso restrito.

### 🏢 Gestão Administrativa

* **Multi-Condomínio:** Arquitetura preparada para SaaS (múltiplos condomínios).
* **Gestão de Unidades:** Cadastro de apartamentos/casas e blocos.
* **Base de Usuários:** Cadastro de moradores, síndicos e funcionários.

### 📅 Operacional & Reservas

* **Áreas Comuns:** Cadastro parametrizado de espaços (Salão de Festas, Academia, etc.) com controle de capacidade e status (Manutenção/Ativo).
* **Agendamento Inteligente:** Sistema de reservas com **detecção automática de conflitos de horário**.
* **Validação de Regras:** Bloqueio de datas retroativas e datas de fim inválidas.

### 📢 Comunicação (Mural Digital)

* **Avisos e Ocorrências:** Mural digital para comunicação oficial.
* **Níveis de Prioridade:** Classificação visual entre avisos "Gerais" e "Urgentes".

---

## 🏗️ Arquitetura do Monorepo

O projeto utiliza **TurboRepo** para orquestrar o build e compartilhar configurações.

### Estrutura de Pastas

```bash
.
├── apps
│   ├── api          # Backend (NestJS + Swagger + Class Validator)
│   └── web          # Frontend (Next.js 15 + Tailwind + Lucide React)
├── packages
│   ├── database     # Schema do Prisma, Migrations e Cliente tipado
│   ├── config       # Configurações compartilhadas (ESLint, TSConfig)
│   └── types        # Tipos compartilhados entre Front e Back (DTOs)

```
---

## 🛠️ Tech Stack

### Backend (`apps/api`)

* **Framework:** NestJS (Modular Monolith)
* **Database:** PostgreSQL (Hospedado na Neon Tech)
* **ORM:** Prisma
* **Validation:** `class-validator` & `class-transformer`
* **Docs:** Swagger (OpenAPI)

### Frontend (`apps/web`)

* **Framework:** Next.js 15 (App Router)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Forms:** React Hook Form
* **Http Client:** Axios (com interceptors para Auth)

---

## ⚡ Como Rodar o Projeto

### Pré-requisitos

* Node.js (v18+)
* Gerenciador de pacotes (`npm` ou `pnpm`)

### 1. Configuração de Ambiente

Crie os arquivos `.env` na raiz de `apps/api`, `apps/web` e `packages/database` com as credenciais do banco e segredos JWT.

### 2. Instalação e Banco de Dados

```bash
# Instalar dependências na raiz
npm install

# Gerar o cliente do Prisma (dentro de packages/database)
npx prisma generate

# Sincronizar o schema com o banco (PostgreSQL)
npx prisma db push

```

### 3. Executando (Modo Desenvolvimento)

```bash
# Na raiz do projeto, roda tanto o Front quanto a API simultaneamente
npm run dev

```

* **Frontend:** http://localhost:3001
* **API:** http://localhost:3000

---

## 🔮 Roadmap (Próximos Passos)

* [ ] **Módulo Financeiro:** Geração de boletos, controle de inadimplência e prestação de contas.
* [ ] **Portaria:** Controle de entrada/saída de visitantes e encomendas.
* [ ] **App Mobile:** Versão React Native para moradores.
* [ ] **Dashboard Analytics:** Gráficos avançados de ocupação e financeiro.
