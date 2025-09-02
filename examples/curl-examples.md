# cURL Examples for tRPC Notes API

This document provides practical examples of how to interact with the Notes API using cURL commands.

## Prerequisites

- API server running on `http://localhost:3000`
- Database configured and running

## Basic API Calls

### 1. Health Check

```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Create a New Note

```bash
curl -X POST http://localhost:3000/trpc/notes.create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Note",
    "content": "This is the content of my first note",
    "tags": ["personal", "ideas"]
  }'
```

**Expected Response:**
```json
{
  "id": "clx1234567890abcdef",
  "title": "My First Note",
  "content": "This is the content of my first note",
  "tags": ["personal", "ideas"],
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

### 3. Get All Notes

```bash
curl "http://localhost:3000/trpc/notes.getAll?input={\"page\":1,\"limit\":10}"
```

**Expected Response:**
```json
{
  "notes": [
    {
      "id": "clx1234567890abcdef",
      "title": "My First Note",
      "content": "This is the content of my first note",
      "tags": ["personal", "ideas"],
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### 4. Get Note by ID

```bash
curl "http://localhost:3000/trpc/notes.getById?input={\"id\":\"clx1234567890abcdef\"}"
```

**Expected Response:**
```json
{
  "id": "clx1234567890abcdef",
  "title": "My First Note",
  "content": "This is the content of my first note",
  "tags": ["personal", "ideas"],
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

### 5. Update a Note

```bash
curl -X POST http://localhost:3000/trpc/notes.update \
  -H "Content-Type: application/json" \
  -d '{
    "id": "clx1234567890abcdef",
    "data": {
      "title": "Updated Note Title",
      "content": "This note has been updated",
      "tags": ["personal", "ideas", "updated"]
    }
  }'
```

**Expected Response:**
```json
{
  "id": "clx1234567890abcdef",
  "title": "Updated Note Title",
  "content": "This note has been updated",
  "tags": ["personal", "ideas", "updated"],
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:30:00.000Z"
}
```

### 6. Delete a Note

```bash
curl -X POST http://localhost:3000/trpc/notes.delete \
  -H "Content-Type: application/json" \
  -d '{
    "id": "clx1234567890abcdef"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

### 7. Get All Tags

```bash
curl "http://localhost:3000/trpc/notes.getTags"
```

**Expected Response:**
```json
["ideas", "personal", "updated"]
```

## Advanced Queries

### 8. Search Notes by Text

```bash
curl "http://localhost:3000/trpc/notes.getAll?input={\"search\":\"updated\",\"page\":1,\"limit\":5}"
```

### 9. Filter Notes by Tags

```bash
curl "http://localhost:3000/trpc/notes.getAll?input={\"tags\":[\"personal\"],\"page\":1,\"limit\":10}"
```

### 10. Combined Search and Filter

```bash
curl "http://localhost:3000/trpc/notes.getAll?input={\"search\":\"note\",\"tags\":[\"ideas\"],\"page\":1,\"limit\":20}"
```

## Error Handling Examples

### 11. Invalid Note ID

```bash
curl "http://localhost:3000/trpc/notes.getById?input={\"id\":\"invalid-id\"}"
```

**Expected Response:**
```json
{
  "error": {
    "message": "Note not found"
  }
}
```

### 12. Missing Required Fields

```bash
curl -X POST http://localhost:3000/trpc/notes.create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "content": ""
  }'
```

**Expected Response:**
```json
{
  "error": {
    "message": "Title is required"
  }
}
```

## Batch Operations

### 13. Create Multiple Notes

```bash
# Note 1
curl -X POST http://localhost:3000/trpc/notes.create \
  -H "Content-Type: application/json" \
  -d '{"title":"Work Note","content":"Important work reminder","tags":["work","urgent"]}'

# Note 2
curl -X POST http://localhost:3000/trpc/notes.create \
  -H "Content-Type: application/json" \
  -d '{"title":"Personal Note","content":"Personal reminder","tags":["personal","reminder"]}'

# Note 3
curl -X POST http://localhost:3000/trpc/notes.create \
  -H "Content-Type: application/json" \
  -d '{"title":"Shopping List","content":"Milk, bread, eggs","tags":["shopping","personal"]}'
```

## Testing Script

You can also create a simple bash script to test all endpoints:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "🧪 Testing Notes API..."

# Health check
echo "1. Health check..."
curl -s "$BASE_URL/health" | jq '.'

# Create note
echo -e "\n2. Creating note..."
NOTE_RESPONSE=$(curl -s -X POST "$BASE_URL/trpc/notes.create" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"Test content","tags":["test"]}')
echo $NOTE_RESPONSE | jq '.'

# Extract note ID
NOTE_ID=$(echo $NOTE_RESPONSE | jq -r '.id')
echo "Note ID: $NOTE_ID"

# Get all notes
echo -e "\n3. Getting all notes..."
curl -s "$BASE_URL/trpc/notes.getAll?input={\"page\":1,\"limit\":5}" | jq '.'

# Get note by ID
echo -e "\n4. Getting note by ID..."
curl -s "$BASE_URL/trpc/notes.getById?input={\"id\":\"$NOTE_ID\"}" | jq '.'

# Get all tags
echo -e "\n5. Getting all tags..."
curl -s "$BASE_URL/trpc/notes.getTags" | jq '.'

# Delete note
echo -e "\n6. Deleting note..."
curl -s -X POST "$BASE_URL/trpc/notes.delete" \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"$NOTE_ID\"}" | jq '.'

echo -e "\n✅ Testing completed!"
```

## Notes

- All timestamps are in ISO 8601 format
- IDs are generated using CUID (Collision-resistant Unique IDentifier)
- The API supports pagination with `page` and `limit` parameters
- Search is case-insensitive and searches both title and content
- Tags are stored as an array of strings
- All endpoints return JSON responses
- Error responses include descriptive error messages 