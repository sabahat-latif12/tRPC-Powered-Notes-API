# tRPC-Powered Notes API

A modern, type-safe Notes API built with **tRPC**, **Prisma**, **Zod**, and **Supabase Postgres**. This project demonstrates how to build a robust backend API with end-to-end type safety using tRPC's standalone adapter.

## 🚀 Features

- **Full CRUD operations** for Notes (Create, Read, Update, Delete)
- **Type-safe API** with tRPC and TypeScript
- **Input validation** using Zod schemas
- **Database operations** with Prisma ORM
- **PostgreSQL database** (Supabase compatible)
- **Search and filtering** capabilities
- **Tag-based organization** system
- **Pagination** support
- **Standalone tRPC adapter** for maximum flexibility

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **API**: tRPC with standalone adapter
- **Validation**: Zod
- **Database**: Prisma ORM + PostgreSQL
- **Hosting**: Supabase (Postgres)
- **Security**: Helmet, CORS

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (or any PostgreSQL database)
- Git

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd trpc-notes-api
npm install
```

### 2. Environment Setup

Copy the environment file and configure your database:

```bash
cp env.example .env
```

Edit `.env` with your database credentials:

```env
# Database (Supabase Postgres)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Server
PORT=3000
NODE_ENV=development
```

### 3. Database Setup

Generate Prisma client and push the schema:

```bash
npm run db:generate
npm run db:push
```

### 4. Seed the Database (Optional)

```bash
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Your API will be running at `http://localhost:3000`!

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/trpc
```

### Available Procedures

#### Notes Router (`notes.*`)

| Procedure | Type | Description | Input Schema |
|-----------|------|-------------|--------------|
| `notes.create` | Mutation | Create a new note | `{ title, content, tags[] }` |
| `notes.getById` | Query | Get note by ID | `{ id }` |
| `notes.getAll` | Query | Get all notes with filtering | `{ search?, tags[], page, limit }` |
| `notes.update` | Mutation | Update existing note | `{ id, data: { title?, content?, tags[]? } }` |
| `notes.delete` | Mutation | Delete note | `{ id }` |
| `notes.getTags` | Query | Get all unique tags | `{}` |

### Example API Calls

#### Create a Note
```typescript
// POST /trpc/notes.create
{
  "title": "My First Note",
  "content": "This is the content of my note",
  "tags": ["personal", "ideas"]
}
```

#### Get All Notes
```typescript
// GET /trpc/notes.getAll?input={"page":1,"limit":10}
```

#### Search Notes
```typescript
// GET /trpc/notes.getAll?input={"search":"meeting","tags":["work"],"page":1,"limit":20}
```

## 🗄️ Database Schema

```prisma
model Note {
  id        String   @id @default(cuid())
  title     String
  content   String
  tags      String[] // Array of tags
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("notes")
}
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Run database migrations
npm run db:reset     # Reset database
npm run db:seed      # Seed database with sample data
```

### Project Structure

```
src/
├── index.ts              # Main server entry point
├── trpc.ts               # tRPC configuration and context
├── routers/
│   ├── index.ts          # Root router
│   └── notes.ts          # Notes router with CRUD operations
└── schemas/
    └── note.ts           # Zod validation schemas
```

## 🌐 Supabase Integration

### Setting up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy the connection string
4. Update your `.env` file with the connection string

### Connection String Format
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## 🧪 Testing the API

### Using curl

```bash
# Health check
curl http://localhost:3000/health

# Create a note
curl -X POST http://localhost:3000/trpc/notes.create \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"Test content","tags":["test"]}'

# Get all notes
curl "http://localhost:3000/trpc/notes.getAll?input={\"page\":1,\"limit\":10}"
```

### Using tRPC Client (TypeScript)

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server/routers';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

// Create a note
const newNote = await client.notes.create.mutate({
  title: 'Hello World',
  content: 'This is a test note',
  tags: ['test', 'hello'],
});

// Get all notes
const notes = await client.notes.getAll.query({
  page: 1,
  limit: 10,
});
```

## 🔒 Security Features

- **Input validation** with Zod schemas
- **SQL injection protection** via Prisma ORM
- **CORS configuration** for cross-origin requests
- **Helmet middleware** for security headers
- **Environment variable** management

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your_production_database_url
```

### Build and Deploy

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: Create an issue on GitHub
- **Documentation**: [tRPC Documentation](https://trpc.io)
- **Prisma**: [Prisma Documentation](https://www.prisma.io/docs)
- **Zod**: [Zod Documentation](https://zod.dev)

---

Built with ❤️ using tRPC, Prisma, and Zod
