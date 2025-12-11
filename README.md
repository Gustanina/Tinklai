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
- **Swagger/OpenAPI** - API dokumentacija
- **class-validator** - Validacija
- **Docker** - Konteinerizacija

## 📦 Priklausomybės

Pagrindinės priklausomybės:
- `@nestjs/core`, `@nestjs/common` - NestJS pagrindai
- `@nestjs/typeorm`, `typeorm` - TypeORM integracija
- `@nestjs/swagger` - Swagger dokumentacija
- `pg` - PostgreSQL driver
- `class-validator`, `class-transformer` - Validacija ir transformacija

## ☁️ Deployment į Railway

Projektas paruoštas deployment į Railway platformą.

### Railway Deployment žingsniai:

1. **Sukurkite Railway paskyrą**:
   - Eikite į https://railway.app
   - Prisijunkite su GitHub

2. **Sukurkite naują projektą**:
   - Spauskite "New Project"
   - Pasirinkite "Deploy from GitHub repo"
   - Pasirinkite savo `Tinklai` repository

3. **Pridėkite PostgreSQL duomenų bazę**:
   - Spauskite "+ New"
   - Pasirinkite "Database" → "Add PostgreSQL"
   - Railway automatiškai sukurs `DATABASE_URL` environment variable

4. **Konfigūruokite aplinkos kintamuosius** (jei reikia):
   - Eikite į "Variables" sekciją
   - Railway automatiškai nustato:
     - `DATABASE_URL` (iš PostgreSQL)
     - `PORT` (automatiškai)
   - Galite pridėti:
     - `NODE_ENV=production` (optional)

5. **Deploy**:
   - Railway automatiškai aptiks `Dockerfile` ir `railway.json`
   - Deployment vyks automatiškai
   - Po deployment gausite URL: `https://your-app.railway.app`

**Swagger dokumentacija bus prieinama**: `https://your-app.railway.app/api`

### Railway Features:

- ✅ Automatinis deployment iš GitHub
- ✅ Automatinis PostgreSQL setup su `DATABASE_URL`
- ✅ Free tier: $5/mėn. kreditai (~100 val. runtime)
- ✅ SSL sertifikatai automatiškai
- ✅ Custom domains

### Deployment patikrinimas:

1. **Health check**: `GET https://your-app.railway.app/`
2. **Swagger UI**: `https://your-app.railway.app/api`
3. **Test API**: Naudokite Postman su production URL

---

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

## 📄 Licencija

[MIT](LICENSE)

## 🔗 Nuorodos

- **Git Repository**: https://github.com/Gustanina/Tinklai.git
- **NestJS Dokumentacija**: https://docs.nestjs.com
- **TypeORM Dokumentacija**: https://typeorm.io

## 👨‍💻 Autorius

Projektas sukurtas laboratoriniam darbui "Tinklų programavimas".
