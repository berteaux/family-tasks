# Family Tasks - Backend

REST API for collaborative family task management. Allows users to create, assign, and track tasks with different permission levels (Manager/Member).

## Tech Stack

- **Framework**: NestJS (Node.js/TypeScript)
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Container**: Docker & Docker Compose

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Configuration

Environment variables are defined in `.env`:

```env
DATABASE_URL="postgresql://dev:dev@db:5432/family-task"
NODE_ENV="development"
```

### Installation & Launch

```bash
# Start the application in detached mode
docker-compose up --build -d

# Initialize the database
docker-compose exec app npx prisma migrate dev --name init
```

API will be available at `http://localhost:3000`

## Essential Commands

### Application

```bash
# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f app

# Rebuild after dependency changes
docker-compose up --build

# Access container shell
docker-compose exec app sh

# Stop and remove database data
$ docker-compose down -v
```

### Database (Prisma)

```bash
# Create and apply a migration
docker-compose exec app npx prisma migrate dev --name migration_name

# Generate Prisma Client (after schema changes)
docker-compose exec app npx prisma generate

# Reset database (deletes all data)
docker-compose exec app npx prisma migrate reset

# Open Prisma Studio (GUI)
docker-compose exec app npx prisma studio
```

### PostgreSQL Inspection

```bash
# List tables
docker exec family-task-postgres psql -U dev -d family-task -c "\dt"

# View table structure
docker exec family-task-postgres psql -U dev -d family-task -c "\d users"

# Interactive PostgreSQL shell
docker exec -it family-task-postgres psql -U dev -d family-task
```

### Testing

```bash
# Unit tests
docker-compose exec app npm test

# Coverage
docker-compose exec app npm run test:cov
```
