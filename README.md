# backend-duolingo

Backend NestJS para a plataforma de aprendizado gamificada. A API sustenta o MVP mobile com autenticacao, usuarios, cursos, trilhas, licoes e progresso, alem de preparar a base para gamificacao real com XP, nivel, streak e eventos de conclusao de licao.

Este repositorio representa o lado servidor do produto. Ele expoe endpoints versionados em `/api/v1`, usa Prisma com MySQL, documenta contratos via Swagger e fornece uma estrutura modular para evoluir novas features sem misturar responsabilidades.

## Sumario

- [Visao do Produto](#visao-do-produto)
- [Status Atual](#status-atual)
- [Stack](#stack)
- [Funcionalidades Entregues](#funcionalidades-entregues)
- [Arquitetura](#arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Modelo de Dados](#modelo-de-dados)
- [Setup Local](#setup-local)
- [Docker](#docker)
- [Variaveis de Ambiente](#variaveis-de-ambiente)
- [Scripts](#scripts)
- [URLs](#urls)
- [Endpoints](#endpoints)
- [Contratos de Resposta](#contratos-de-resposta)
- [Fluxos Principais](#fluxos-principais)
- [Integracao com ExpoFront](#integracao-com-expofront)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)

## Visao do Produto

A plataforma tem como objetivo oferecer aprendizado de tecnologia em formato gamificado. O usuario escolhe um curso, avanca por trilhas curtas, conclui licoes progressivas e acompanha sua evolucao.

O backend precisa garantir:

- identidade do usuario;
- seguranca de sessao com JWT;
- persistencia do progresso;
- desbloqueio gradual de conteudo;
- base para XP, nivel e streak;
- contratos claros para o app mobile.

Cursos iniciais previstos:

- Expo/React Native
- AWS Cloud

## Status Atual

Concluido no backend:

- Projeto NestJS estruturado.
- Prisma configurado com MySQL.
- Docker Compose com API, MySQL e Redis.
- Validacao de ambiente com Joi.
- Prefixo global `api/v1`.
- CORS habilitado.
- Swagger em `/api/docs`.
- Auth com cadastro, login e refresh token.
- Hash de senha com bcrypt.
- Guards JWT e strategies.
- Endpoint de usuario autenticado.
- Modelo de cursos, tracks, modulos, licoes e progresso.
- Endpoints para listar cursos, iniciar curso, buscar trilha e concluir licao.
- Evento interno de licao concluida.
- Interceptor de resposta.
- Filtro global de erros HTTP.
- Health check.
- README expandido.

Pendente:

- Alinhar todos os contratos com o ExpoFront.
- Expor endpoints dedicados de XP, nivel, streak e progresso.
- Conectar app mobile aos endpoints reais.
- Validar fluxo end-to-end.
- Adicionar suite de testes.

## Stack

- NestJS 10
- TypeScript
- Prisma 5
- MySQL 8.4
- Redis 7
- JWT
- Passport
- bcrypt
- class-validator
- class-transformer
- Joi
- Swagger/OpenAPI
- Docker Compose
- EventEmitter

## Funcionalidades Entregues

### Auth

- Cadastro de usuario.
- Login com email e senha.
- Refresh token.
- Hash de senha.
- Revogacao de refresh tokens antigos.
- JWT access token.
- JWT refresh token.

### Users

- Endpoint `/users/me`.
- DTO publico para nao expor senha.
- Decorator `CurrentUser`.

### Courses

- Listagem de cursos.
- Inicio de curso por usuario.
- Consulta de trilha por usuario.
- Bloqueio/liberacao linear de licoes.
- Conclusao de licao.
- Persistencia em `LessonProgress`.
- Atualizacao de progresso de curso.
- Emissao de evento `lesson.completed`.

### Infraestrutura da API

- Prefixo versionado.
- CORS.
- Swagger.
- Health check.
- Filtro global de excecoes.
- Interceptor global de respostas.
- Validacao global de DTOs.
- Docker Compose para desenvolvimento.

## Arquitetura

O backend segue uma arquitetura modular do NestJS.

Cada dominio possui:

- `controller`: camada HTTP;
- `service`: regra de negocio;
- `repository`: acesso ao banco;
- `dto`: contrato de entrada/saida;
- `guards/strategies`: quando o dominio envolve auth;
- `events`: quando uma acao deve ser reutilizada por outros modulos.

Fluxo esperado:

```text
Controller -> Service -> Repository -> Prisma -> MySQL
```

Recursos transversais ficam em `src/common`, como decorators, filtros, interceptors, enums e utilitarios.

## Estrutura de Pastas

```text
src/
  app.module.ts
  main.ts

  common/
    decorators/
      current-user.decorator.ts
      response-message.decorator.ts
    enums/
      role.enum.ts
    filters/
      http-exception.filter.ts
    interceptors/
      response.interceptor.ts
    utils/
      duration.util.ts

  config/
    env/
      env.validation.ts
    swagger/
      swagger.config.ts

  modules/
    auth/
      controllers/
      dto/
      guards/
      interfaces/
      repositories/
      services/
      strategies/

    courses/
      controllers/
      dto/
      events/
      repositories/
      services/

    health/
      health.controller.ts
      health.module.ts

    users/
      controllers/
      dto/
      repositories/
      services/

  prisma/
    prisma.module.ts
    prisma.service.ts

prisma/
  schema.prisma
  seed.ts
  migrations/
```

## Modelo de Dados

Entidades principais:

### User

Representa o usuario da plataforma.

Campos relevantes:

- `id`
- `name`
- `email`
- `password`
- `avatarUrl`
- `xp`
- `level`
- `streak`
- `lastStudyDate`
- `role`

Relacionamentos:

- refresh tokens;
- progresso por curso;
- progresso por licao;
- trilhas liberadas.

### RefreshToken

Armazena refresh tokens de forma segura por hash.

Campos relevantes:

- `tokenHash`
- `expiresAt`
- `revokedAt`
- `userId`

### Course

Curso de aprendizado, como Expo ou AWS.

Relacionamentos:

- tracks;
- progresso de usuarios.

### Track

Trilha dentro de um curso. Uma trilha possui modulos.

### Module

Modulo dentro de uma trilha. Um modulo possui licoes ordenadas.

### Lesson

Unidade de aprendizado. Hoje possui conteudo basico e ordem. O frontend ja possui exercicios mockados; a evolucao natural e persistir exercicios no backend.

### CourseProgress

Registra que um usuario iniciou um curso e qual trilha esta atual.

### LessonProgress

Registra licoes concluidas por usuario.

### UserTrack

Controla quais trilhas foram liberadas para o usuario.

## Setup Local

Instale dependencias:

```bash
npm install
```

Crie `.env`:

```bash
copy .env.example .env
```

Se estiver usando PowerShell:

```powershell
Copy-Item .env.example .env
```

Suba dependencias com Docker:

```bash
docker compose up -d mysql redis
```

Gere Prisma Client:

```bash
npm run prisma:generate
```

Rode migracoes:

```bash
npm run prisma:migrate:dev
```

Rode seed:

```bash
npm run prisma:seed
```

Inicie a API:

```bash
npm run start:dev
```

## Docker

O `docker-compose.yml` possui tres servicos:

- `api`: aplicacao NestJS;
- `mysql`: banco MySQL 8.4;
- `redis`: Redis 7.

Subir tudo:

```bash
docker compose up -d
```

Ver logs:

```bash
docker compose logs -f api
```

Parar containers:

```bash
docker compose down
```

Remover volumes do banco:

```bash
docker compose down -v
```

Observacao: dentro do Docker, a API acessa MySQL pelo host `mysql:3306`. Fora do Docker, a porta publicada do MySQL e `3307`.

## Variaveis de Ambiente

Exemplo para rodar a API dentro do Docker Compose:

```env
DATABASE_URL=mysql://root:root@mysql:3306/gamified_db
JWT_SECRET=change_me
JWT_REFRESH_SECRET=change_me_too
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
REDIS_HOST=redis
REDIS_PORT=6379
PORT=3000
NODE_ENV=development
```

Exemplo para rodar API local fora do container, usando MySQL do Docker:

```env
DATABASE_URL=mysql://root:root@localhost:3307/gamified_db
JWT_SECRET=change_me
JWT_REFRESH_SECRET=change_me_too
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
NODE_ENV=development
```

Variaveis:

- `DATABASE_URL`: string de conexao Prisma/MySQL.
- `JWT_SECRET`: segredo do access token.
- `JWT_REFRESH_SECRET`: segredo do refresh token.
- `JWT_ACCESS_EXPIRES_IN`: duracao do access token.
- `JWT_REFRESH_EXPIRES_IN`: duracao do refresh token.
- `REDIS_HOST`: host do Redis.
- `REDIS_PORT`: porta do Redis.
- `PORT`: porta HTTP da API.
- `NODE_ENV`: ambiente atual.

## Scripts

```bash
npm run start
npm run start:dev
npm run build
npm run lint
npm run test
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:migrate:deploy
npm run prisma:studio
npm run prisma:seed
```

Descricao:

- `npm run start`: inicia Nest em modo padrao.
- `npm run start:dev`: inicia Nest com watch.
- `npm run build`: gera build da aplicacao.
- `npm run lint`: roda ESLint com autofix.
- `npm run test`: roda Jest.
- `npm run prisma:generate`: gera Prisma Client.
- `npm run prisma:migrate:dev`: cria/aplica migracoes em desenvolvimento.
- `npm run prisma:migrate:deploy`: aplica migracoes em ambiente de deploy.
- `npm run prisma:studio`: abre Prisma Studio.
- `npm run prisma:seed`: roda seed inicial.

## URLs

- API: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/api/docs`
- Health: `http://localhost:3000/api/v1/health`

## Endpoints

### Auth

#### Register

```http
POST /api/v1/auth/register
Content-Type: application/json
```

Body:

```json
{
  "name": "Tobias",
  "email": "tobias@example.com",
  "password": "123456"
}
```

Retorna usuario publico e tokens.

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json
```

Body:

```json
{
  "email": "tobias@example.com",
  "password": "123456"
}
```

#### Refresh

```http
POST /api/v1/auth/refresh
Content-Type: application/json
```

Body:

```json
{
  "refreshToken": "<refresh_token>"
}
```

### Users

#### Me

```http
GET /api/v1/users/me
Authorization: Bearer <access_token>
```

Retorna os dados publicos do usuario autenticado.

### Courses

#### Listar cursos

```http
GET /api/v1/courses
```

Retorna a lista de cursos disponiveis.

#### Iniciar curso

```http
POST /api/v1/courses/:id/start
Authorization: Bearer <access_token>
```

Cria ou retorna progresso existente do usuario no curso.

#### Buscar trilha do usuario

```http
GET /api/v1/courses/:courseId/tracks/:trackId
Authorization: Bearer <access_token>
```

Retorna trilha, modulos e licoes com estado de bloqueio/conclusao.

#### Concluir licao

```http
POST /api/v1/courses/lessons/:id/complete
Authorization: Bearer <access_token>
```

Marca licao como concluida e emite evento interno.

## Contratos de Resposta

A API usa um interceptor global para padronizar respostas. O formato exato deve ser conferido no Swagger e no interceptor atual, mas a intencao e manter um envelope consistente com:

- dados retornados;
- mensagem opcional;
- metadata quando necessario.

Erros HTTP passam pelo filtro global e retornam um formato padronizado, com status code e mensagem.

Rotas autenticadas exigem:

```http
Authorization: Bearer <access_token>
```

## Fluxos Principais

### Cadastro e login

1. Usuario envia nome, email e senha.
2. API valida DTO.
3. Service verifica email duplicado.
4. Senha e armazenada com hash bcrypt.
5. API emite access token e refresh token.
6. Refresh token e salvo como hash no banco.
7. API retorna usuario publico e tokens.

### Refresh token

1. App envia refresh token.
2. API valida assinatura e expiracao.
3. API busca ultimo token ativo do usuario.
4. API compara token recebido com hash salvo.
5. API revoga tokens antigos e cria novo refresh token.
6. API retorna novos tokens.

### Inicio de curso

1. Usuario autenticado chama `POST /courses/:id/start`.
2. API verifica se curso existe.
3. API verifica se ja ha progresso.
4. Se nao houver, cria progresso.
5. Primeira track e liberada para o usuario.

### Consulta de trilha

1. Usuario autenticado chama endpoint de track.
2. API carrega modulos e licoes.
3. API consulta progresso das licoes.
4. API calcula `completed`, `locked` e `current`.
5. API retorna estrutura pronta para o app renderizar.

### Conclusao de licao

1. Usuario autenticado conclui licao.
2. API valida se a licao existe.
3. API valida se licao anterior foi concluida.
4. API cria/atualiza `LessonProgress`.
5. API emite evento `lesson.completed`.
6. Se necessario, libera proxima track.

## Integracao com ExpoFront

O app mobile espera consumir a API em:

```text
http://localhost:3000/api/v1
```

Para Android Emulator, o app pode precisar usar:

```text
http://10.0.2.2:3000/api/v1
```

Contratos que ainda precisam ser alinhados:

- formato final de `GET /courses`;
- endpoint para detalhe de curso por ID, se necessario;
- formato final de track com modulos e licoes;
- endpoint para progresso por curso;
- endpoint para XP, nivel e streak;
- formato de exercicios reais, caso deixem de ser mockados no mobile.

Issues abertas de integracao:

- alinhar contracts de courses/tracks;
- expor dados de gamificacao e progresso;
- validar fluxo end-to-end com o app.

## Padroes de Desenvolvimento

- Controllers devem ficar finos, delegando regra para services.
- Services devem conter regra de negocio.
- Repositories devem concentrar acesso ao Prisma.
- DTOs devem documentar e validar contratos.
- Nao retornar senha ou campos sensiveis.
- Preferir eventos quando uma acao puder disparar efeitos futuros, como XP/streak.
- Manter Swagger atualizado quando contrato mudar.

## Testes

O projeto ja possui Jest configurado no package. Ainda falta ampliar a cobertura.

Sugestoes de testes prioritarios:

- `AuthService.register` com email duplicado.
- `AuthService.login` com senha invalida.
- `AuthService.refresh` com token invalido.
- `CoursesService.startCourse` com curso inexistente.
- `CoursesService.completeLesson` bloqueando licao anterior nao concluida.
- Filtro global de erros.
- Interceptor de resposta.

Rodar testes:

```bash
npm run test
```

## Troubleshooting

### Prisma nao conecta no banco

Confira se `DATABASE_URL` bate com o modo de execucao:

- API dentro do Docker: `mysql://root:root@mysql:3306/gamified_db`
- API local fora do Docker: `mysql://root:root@localhost:3307/gamified_db`

### Porta 3000 ocupada

Altere `PORT` no `.env`:

```env
PORT=3001
```

### Migracao falha

Verifique:

- banco esta rodando;
- `DATABASE_URL` correto;
- Prisma Client gerado;
- container MySQL saudavel.

Comandos uteis:

```bash
docker compose ps
docker compose logs -f mysql
npm run prisma:generate
```

### Swagger nao abre

Confira se a API iniciou sem erro e acesse:

```text
http://localhost:3000/api/docs
```

### App mobile recebe erro de CORS ou rede

Confira:

- backend rodando na porta esperada;
- `app.enableCors` ativo;
- URL do ExpoFront usando IP correto;
- celular e computador na mesma rede quando usar dispositivo fisico.

## Roadmap

Proximos passos recomendados:

1. Finalizar contratos consumidos pelo ExpoFront.
2. Criar endpoints de progresso e gamificacao.
3. Persistir exercicios no banco, se o produto deixar de usar mocks.
4. Implementar XP/streak no evento de licao concluida.
5. Adicionar testes unitarios e e2e.
6. Criar pipeline de CI.
7. Preparar ambiente de homologacao.
8. Documentar exemplos completos no Swagger.

## Status Final do MVP

O backend entrega a base principal para autenticacao, cursos e progresso. Ele esta pronto para ser integrado ao app mobile, mas ainda precisa alinhar contratos finais de progresso/gamificacao e validar a jornada completa com dados reais.
