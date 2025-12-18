# Reader Backend API

REST API sistema projektų, užduočių ir komentarų valdymui. Sukurta su NestJS, TypeScript ir PostgreSQL.

## 📋 Projekto aprašymas

Šis projektas yra REST API sąsaja, leidžianti valdyti:
- **Projects** (Projektus) - pagrindiniai projektai
- **Tasks** (Užduotis) - užduotys, priklausančios projektams
- **Comments** (Komentarus) - komentarai, priklausantys užduotims

## 🚀 Greitas paleidimas

### Būtinos sąlygos

- Node.js (v18 arba naujesnė)
- npm arba yarn
- Docker ir Docker Compose (PostgreSQL duomenų bazei)

### 1. Įdiegti priklausomybes

```bash
npm install
```

### 2. Sukonfigūruoti aplinkos kintamuosius

Sukurkite `.env` failą iš `env.example`:

```bash
copy env.example .env
```

Arba sukurkite `.env` failą su šiuo turiniu:

```env
# App
PORT=3000
NODE_ENV=dev

# Database
POSTGRES_HOST=localhost
POSTGRES_USER=admin
POSTGRES_PASSWORD=root
POSTGRES_DB=reader-backend
POSTGRES_PORT=5432

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Paleisti PostgreSQL duomenų bazę

```bash
docker-compose up -d
```

Tai paleis PostgreSQL konteinerį su konfigūracija iš `.env` failo.

### 4. Paleisti aplikaciją

**Development režimas (su auto-reload):**
```bash
npm run start:dev
```

**Production režimas:**
```bash
npm run build
npm run start:prod
```

Aplikacija bus prieinama adresu: `http://localhost:3000`

### 5. Patikrinti, ar viskas veikia

- API dokumentacija (Swagger): http://localhost:3000/api
- Health check: http://localhost:3000

## 📚 API Endpointai

### Projects (Projektai)

| Metodas | Endpoint | Aprašymas | Status kodai |
|---------|----------|-----------|--------------|
| POST | `/projects` | Sukurti naują projektą | 201, 400, 422 |
| GET | `/projects` | Gauti projektų sąrašą (pagination) | 200 |
| GET | `/projects/:id` | Gauti projektą pagal ID | 200, 404 |
| PATCH | `/projects/:id` | Atnaujinti projektą | 200, 404, 400, 422 |
| DELETE | `/projects/:id` | Ištrinti projektą | 204, 404 |

### Tasks (Užduotys)

| Metodas | Endpoint | Aprašymas | Status kodai |
|---------|----------|-----------|--------------|
| POST | `/tasks` | Sukurti naują užduotį | 201, 400, 422, 404 |
| GET | `/tasks` | Gauti užduočių sąrašą (pagination, optional projectId filter) | 200 |
| GET | `/tasks/:id` | Gauti užduotį pagal ID | 200, 404 |
| PATCH | `/tasks/:id/status` | Atnaujinti užduoties statusą | 200, 404, 400, 422 |
| PATCH | `/tasks/:id` | Atnaujinti užduotį (title/status/projectId) | 200, 404, 400, 422 |
| DELETE | `/tasks/:id` | Ištrinti užduotį | 204, 404 |

### Comments (Komentarai)

| Metodas | Endpoint | Aprašymas | Status kodai |
|---------|----------|-----------|--------------|
| POST | `/comments` | Sukurti naują komentarą | 201, 400, 422, 404 |
| GET | `/comments` | Gauti komentarų sąrašą (pagination, optional taskId filter) | 200 |
| GET | `/comments/:id` | Gauti komentarą pagal ID | 200, 404 |
| PATCH | `/comments/:id` | Atnaujinti komentarą | 200, 404, 400, 422 |
| DELETE | `/comments/:id` | Ištrinti komentarą | 204, 404 |

**Iš viso: 16 API metodų**

### Users (Naudotojai)

| Metodas | Endpoint | Aprašymas | Reikalinga rolė | Status kodai |
|---------|----------|-----------|-----------------|--------------|
| GET | `/users` | Gauti visų naudotojų sąrašą | ADMIN | 200, 403 |
| GET | `/users/me` | Gauti savo naudotojo profilį | GUEST, MEMBER, ADMIN | 200, 401 |
| PATCH | `/users/:id/role` | Pakeisti naudotojo rolę | ADMIN | 200, 404, 403 |

**Pastaba:** Rolės keitimas prieinamas tik ADMIN naudotojams.

### Auth (Autentifikacija)

| Metodas | Endpoint | Aprašymas | Status kodai |
|---------|----------|-----------|--------------|
| POST | `/auth/register` | Registruoti naują naudotoją | 201, 400, 409 |
| POST | `/auth/login` | Prisijungti | 200, 401 |
| POST | `/auth/refresh` | Atnaujinti access token | 200, 401 |

**Pastaba:** Visi kiti endpointai reikalauja JWT autentifikacijos (Bearer token).

## 🔐 Autentifikacija ir Autorizacija

Projektas naudoja **JWT (JSON Web Tokens)** autentifikaciją su refresh token strategija.

### Rolės

Sistema turi 3 rolių lygius:

- **GUEST** - Gali tik peržiūrėti duomenis (GET metodai)
- **MEMBER** - Gali kurti ir redaguoti (GET, POST, PATCH metodai)
- **ADMIN** - Pilnas prieiga (visi metodai, įskaitant DELETE)

### Kaip naudotis JWT

#### 1. Registracija

```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "John Doe",
  "password": "password123"
}
```

**Atsakas:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "John Doe",
    "role": "GUEST"
  }
}
```

#### 2. Prisijungimas

```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Atsakas:** (tas pats kaip registracijoje)

#### 3. Naudojimas su API užklausomis

Pridėkite `Authorization` header su access token:

```bash
GET http://localhost:3000/projects
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 4. Token atnaujinimas

Kai access token pasibaigia (po 15 min), naudokite refresh token:

```bash
POST http://localhost:3000/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Atsakas:** Nauji accessToken ir refreshToken

#### 5. Keisti naudotojo rolę (tik ADMIN)

```bash
PATCH http://localhost:3000/users/:id/role
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "role": "MEMBER"
}
```

**Galimos rolės:** `GUEST`, `MEMBER`, `ADMIN`

**Pavyzdys su cURL:**
```bash
# Pakeisti naudotojo (ID=1) rolę į MEMBER
curl -X PATCH http://localhost:3000/users/1/role \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"MEMBER"}'
```

**Kaip gauti ADMIN rolę:**
1. Registruokitės kaip paprastas naudotojas (gausite GUEST rolę)
2. Duomenų bazėje pakeiskite savo naudotojo rolę į ADMIN:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```
3. Prisijunkite iš naujo ir gausite ADMIN token
4. Dabar galite keisti kitų naudotojų roles per API

**Arba naudokite GET /users endpointą (tik ADMIN):**
```bash
# Gauti visų naudotojų sąrašą
GET http://localhost:3000/users
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

### Testavimas su Swagger UI

1. Eikite į http://localhost:3000/api
2. Spustelėkite **"Authorize"** mygtuką (viršuje dešinėje)
3. Įveskite: `Bearer YOUR_ACCESS_TOKEN`
4. Dabar galite testuoti visus endpointus

### Testavimas su cURL

```bash
# 1. Registracija
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"Test User","password":"password123"}'

# 2. Išsaugokite accessToken iš atsako

# 3. Naudokite token API užklausoms
curl -X GET http://localhost:3000/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Testavimas su Postman

1. **Registracija/Login:**
   - POST `http://localhost:3000/auth/register`
   - Body: JSON su email, username, password
   - Išsaugokite `accessToken` iš atsako

2. **Naudojimas:**
   - Eikite į bet kurį kitą endpoint
   - Skirtuke "Authorization" pasirinkite "Bearer Token"
   - Įveskite savo `accessToken`
   - Dabar galite siųsti užklausas

### Rolės prieigos kontrolė

| Endpoint | GUEST | MEMBER | ADMIN |
|----------|-------|--------|-------|
| GET /projects | ✅ | ✅ | ✅ |
| GET /tasks | ✅ | ✅ | ✅ |
| GET /comments | ✅ | ✅ | ✅ |
| POST /projects | ❌ | ✅ | ✅ |
| POST /tasks | ❌ | ✅ | ✅ |
| POST /comments | ❌ | ✅ | ✅ |
| PATCH /projects/:id | ❌ | ✅ | ✅ |
| PATCH /tasks/:id | ❌ | ✅ | ✅ |
| PATCH /comments/:id | ❌ | ✅ | ✅ |
| DELETE /projects/:id | ❌ | ❌ | ✅ |
| DELETE /tasks/:id | ❌ | ❌ | ✅ |
| DELETE /comments/:id | ❌ | ❌ | ✅ |
| GET /users | ❌ | ❌ | ✅ |
| GET /users/me | ✅ | ✅ | ✅ |
| PATCH /users/:id/role | ❌ | ❌ | ✅ |

## 📖 HTTP Status kodai

- **200 OK** - Sėkmingas GET arba PATCH užklausa
- **201 Created** - Sėkmingai sukurtas resursas (POST)
- **204 No Content** - Sėkmingai ištrintas resursas (DELETE)
- **400 Bad Request** - Neteisingas užklausos formatas
- **404 Not Found** - Resursas nerastas
- **422 Unprocessable Entity** - Validacijos klaidos (blogas payload)

## 🧪 Testavimas su Postman

Projekte yra paruošta Postman kolekcija su visais API metodais ir automatiniais testais.

### Naudojimas:

1. Importuokite `Lab1-ReaderBackend.postman_collection.json` į Postman
2. Patikrinkite, kad `baseUrl` kintamasis nustatytas į `http://localhost:3000`
3. Paleiskite "Run Collection" - visi testai bus vykdomi automatiškai

Kolekcija apima:
- ✅ Visus 16 API metodų testus
- ✅ 404 scenarijų testus (kai resursas nerastas)
- ✅ 400/422 scenarijų testus (blogas payload)
- ✅ 201 scenarijų testus (resurso sukūrimas)
- ✅ 204 scenarijų testus (resurso ištrynimas)

**Visi testai turėtų užtrukti ~15 sekundžių**

## 📝 OpenAPI / Swagger Dokumentacija

Kai aplikacija paleista, OpenAPI dokumentacija prieinama:
- **Swagger UI**: http://localhost:3000/api
- **OpenAPI JSON**: http://localhost:3000/api-json

`swagger.json` failas generuojamas automatiškai paleidžiant aplikaciją.

## 🗄️ Duomenų bazė

Projektas naudoja **PostgreSQL** su **TypeORM**.

- **Development režime**: `synchronize: true` - lentelės sukūriamos automatiškai
- **Database schema**:
  - `users` - naudotojai (su rolėmis)
  - `projects` - projektai
  - `tasks` - užduotys (FK į projects)
  - `comments` - komentarai (FK į tasks)

### Duomenų bazės paleidimas

```bash
# Paleisti PostgreSQL konteinerį
docker-compose up -d

# Patikrinti, ar konteineris veikia
docker ps

# Sustabdyti konteinerį
docker-compose down
```

## 🛠️ Development komandos

```bash
# Development su auto-reload
npm run start:dev

# Production build
npm run build
npm run start:prod

# Testai
npm run test          # Unit testai
npm run test:e2e      # E2E testai
npm run test:cov      # Test coverage

# Linting
npm run lint
```

## 📁 Projekto struktūra

```
src/
├── modules/
│   ├── user/             # Naudotojų modulis
│   │   ├── user.entity.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   ├── auth/             # Autentifikacijos modulis
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/   # JWT strategija
│   │   ├── guards/       # JWT ir Roles guards
│   │   └── decorators/   # Public, Roles, CurrentUser
│   ├── project/          # Projekto modulis
│   │   ├── project.controller.ts
│   │   ├── project.service.ts
│   │   ├── project.entity.ts
│   │   └── Dto/
│   ├── task/             # Užduočių modulis
│   │   ├── task.controller.ts
│   │   ├── task.service.ts
│   │   ├── task.entity.ts
│   │   └── Dto/
│   └── comment/          # Komentarų modulis
│       ├── comment.controller.ts
│       ├── comment.service.ts
│       ├── comment.entity.ts
│       └── Dto/
├── common/
│   ├── database/         # DB konfigūracija
│   └── filters/          # Exception filtrai
├── configs/
│   └── typeorm.config.ts # TypeORM konfigūracija
└── main.ts               # Aplikacijos entry point
```

## 🔧 Technologijos

- **NestJS** - Node.js framework
- **TypeScript** - Programavimo kalba
- **TypeORM** - ORM biblioteka
- **PostgreSQL** - Duomenų bazė
- **JWT** - Autentifikacija ir autorizacija
- **Passport** - Autentifikacijos strategijos
- **bcrypt** - Slaptažodžių šifravimas
- **Swagger/OpenAPI** - API dokumentacija
- **class-validator** - Validacija
- **Docker** - Konteinerizacija

## 📦 Priklausomybės

Pagrindinės priklausomybės:
- `@nestjs/core`, `@nestjs/common` - NestJS pagrindai
- `@nestjs/typeorm`, `typeorm` - TypeORM integracija
- `@nestjs/jwt`, `@nestjs/passport` - JWT autentifikacija
- `passport`, `passport-jwt` - Passport JWT strategija
- `bcrypt` - Slaptažodžių šifravimas
- `@nestjs/swagger` - Swagger dokumentacija
- `pg` - PostgreSQL driver
- `class-validator`, `class-transformer` - Validacija ir transformacija

## 🐛 Troubleshooting

### Database connection error

Jei matote klaidą `Unable to connect to the database`:
1. Patikrinkite, ar PostgreSQL konteineris veikia: `docker ps`
2. Patikrinkite `.env` failo konfigūraciją
3. Paleiskite iš naujo: `docker-compose restart`

### Port already in use

Jei portas 3000 užimtas:
- Pakeiskite `PORT` kintamąjį `.env` faile
- Arba sustabdykite kitą aplikaciją, naudojančią tą patį portą

### JWT Authentication errors

Jei gaunate `401 Unauthorized` klaidas:
1. Patikrinkite, ar `.env` faile yra nustatyti `JWT_SECRET` ir `JWT_REFRESH_SECRET`
2. Įsitikinkite, kad naudojate teisingą `Bearer` token formatą: `Authorization: Bearer YOUR_TOKEN`
3. Patikrinkite, ar token nėra pasibaigęs (access token galioja 15 min)
4. Jei token pasibaigė, naudokite `/auth/refresh` endpointą su refresh token

### Role-based access errors

Jei gaunate `403 Forbidden` klaidas:
- Patikrinkite, ar jūsų naudotojo rolė turi prieigą prie šio endpointo
- GUEST gali tik peržiūrėti (GET)
- MEMBER gali kurti ir redaguoti (POST, PATCH)
- ADMIN turi pilną prieigą (visi metodai)

## 📄 Licencija

[MIT](LICENSE)

## 🔗 Nuorodos

- **Git Repository**: https://github.com/Gustanina/Tinklai.git
- **NestJS Dokumentacija**: https://docs.nestjs.com
- **TypeORM Dokumentacija**: https://typeorm.io

## 👨‍💻 Autorius

Projektas sukurtas laboratoriniam darbui "Tinklų programavimas".
