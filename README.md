# Academic Pinpoint

Agregador de oportunidades acadêmicas (bolsas, editais, estágios, eventos) com
feed personalizado. Projeto Integrado 1 — UFES.

---

## Sumário

- [Diagrama de Classes](#diagrama-de-classes)
- [Ferramentas Escolhidas](#ferramentas-escolhidas)
- [Frameworks Reutilizados](#frameworks-reutilizados)
- [Geração de Documentação do Código](#geração-de-documentação-do-código)
- [Como Executar o Sistema](#como-executar-o-sistema)

---

## Diagrama de Classes


![Diagrama de Classes de Domínio](docs/domain.png)


### Resumo do Domínio

| Classe / Enum | Descrição |
|---|---|
| `apps/api` | Backend (NestJS + Prisma) |
| `apps/web` | Frontend (Next.js + Tailwind) |
| `apps/scraper` | Coletor de oportunidades (FastAPI) — planejado |
| `packages/shared` | Tipos e contratos compartilhados |

## Pré-requisitos

- Node.js 20+
- pnpm (`npm i -g pnpm`)

### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/reetzRS/Academic-Pinpoint.git
cd Academic-Pinpoint

# 2. Instalar dependências
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm db:setup   # migrations + seed
pnpm dev        # web em :3000, API em :3001
```

O arquivo `.env.example` já traz valores prontos para desenvolvimento
(`DATABASE_URL` em SQLite, `PORT=3001`, `WEB_ORIGIN` e `JWT_SECRET` de dev),
então basta copiá-lo para `.env` sem precisar editar nada para rodar
localmente.

## Portas

| Serviço | Porta |
|---|---|
| Web | 3000 |
| API | 3001 |

## Usuários do seed

Para testar a aplicação (ou fazer uma demo), o `pnpm db:setup` cria dois
usuários:

| Papel | E-mail | Senha |
|---|---|---|
| Usuário comum | `aluno@ufes.br` | `senha123` |
| Administrador | `admin@ufes.br` | `admin123` |

O usuário administrador tem acesso à área de Gestão, onde é possível
cadastrar, editar e remover oportunidades.

## Testes

```bash
pnpm test
```

Roda os testes unitários da API (Jest).
