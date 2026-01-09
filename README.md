# 🏢 SmartCondo

Sistema de gestão de condomínios (SaaS) desenvolvido com arquitetura **Monorepo**, focado em escalabilidade, manutenibilidade e *type safety* de ponta a ponta.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=flat&logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma)
![TurboRepo](https://img.shields.io/badge/TurboRepo-Monorepo-EF4444?style=flat&logo=turborepo)

---

## 📋 Sobre o Projeto

O **SmartCondo** é uma plataforma completa para administração de condomínios, integrando controle de moradores, gestão de unidades e financeiro.

O sistema utiliza uma estratégia de **Monorepo** para compartilhar tipos, configurações e esquemas de banco de dados entre o Frontend e o Backend, garantindo **Type Safety end-to-end** e reduzindo inconsistências entre camadas.

---

## 🏗️ Arquitetura

### Estrutura do Monorepo

```
┌─────────────────────────────────────────────────────┐
│                   TurboRepo Host                    │
│           (Orquestração de Build e Tasks)           │
├──────────────┬──────────────────────┬───────────────┤
│   APPS       │      PACKAGES        │    CONFIG     │
├──────────────┼──────────────────────┼───────────────┤
│              │                      │               │
│  ┌───────┐   │   ┌──────────────┐   │   ┌───────┐   │
│  │  WEB  │   │   │   DATABASE   │   │   │ TS &  │   │
│  │(Next) │   │   │   (Prisma)   │   │   │ESLint │   │
│  └───┬───┘   │   └──────▲───────┘   │   └───▲───┘   │
│      │       │          │           │       │       │
│      └───────┼──────────┼───────────┼───────┘       │
│              │          │           │               │
│  ┌───────┐   │          │           │               │
│  │  API  │───┘          │           │               │
│  │(Nest) │              │           │               │
│  └───┬───┘              │           │               │
│      └──────────────────┘           │               │
└─────────────────────────────────────┴───────────────┘
```

### Fluxo de Dados

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Next.js │ ─▶ │  NestJS  │─▶ │  Prisma  │─▶ │  SQLite  │
│ Frontend │    │ API REST │    │   ORM    │    │ Database │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

---

## ✨ Funcionalidades

### Backend (API)
- Arquitetura modular
- NestJS com Injeção de Dependência
- Prisma ORM com migrações
- DTOs com class-validator
- API RESTful

### Frontend (Web)
- Next.js 15 (App Router)
- React Server Components
- Server Side Rendering
- Tailwind CSS
- Tipos compartilhados

