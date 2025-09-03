import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './routers';

// Create tRPC client
const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
    }),
  ],
});

// Test function to demonstrate API usage
async function testAPI() {
  try {
    console.log('🧪 Testing tRPC Notes API...\n');

    // 1. Create a new note
    console.log('1️⃣ Creating a new note...');
    const newNote = await client.notes.create.mutate({
      title: 'Test Note from Client',
      content: 'This is a test note created from the client',
      tags: ['test', 'client', 'demo'],
    });
    console.log('✅ Note created:', newNote);

    // 2. Get all notes
    console.log('\n2️⃣ Getting all notes...');
    const allNotes = await client.notes.getAll.query({
      page: 1,
      limit: 10,
    });
    console.log(`✅ Found ${allNotes.notes.length} notes`);
    console.log('📝 Notes:', allNotes.notes.map((n) => ({ id: n.id, title: n.title, tags: n.tags })));

    // 3. Get note by ID
    console.log('\n3️⃣ Getting note by ID...');
    const noteById = await client.notes.getById.query({
      id: newNote.id,
    });
    console.log('✅ Note retrieved:', noteById);

    // 4. Update the note
    console.log('\n4️⃣ Updating the note...');
    const updatedNote = await client.notes.update.mutate({
      id: newNote.id,
      data: {
        title: 'Updated Test Note',
        content: 'This note has been updated from the client',
        tags: ['test', 'client', 'demo', 'updated'],
      },
    });
    console.log('✅ Note updated:', updatedNote);

    // 5. Search notes
    console.log('\n5️⃣ Searching notes...');
    const searchResults = await client.notes.getAll.query({
      search: 'test',
      tags: ['demo'],
      page: 1,
      limit: 5,
    });
    console.log(`✅ Search results: ${searchResults.notes.length} notes found`);

    // 6. Get all tags
    console.log('\n6️⃣ Getting all tags...');
    const allTags = await client.notes.getTags.query();
    console.log('✅ All tags:', allTags);

    // 7. Delete the test note
    console.log('\n7️⃣ Deleting the test note...');
    const deleteResult = await client.notes.delete.mutate({
      id: newNote.id,
    });
    console.log('✅ Note deleted:', deleteResult);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

export { client, testAPI }; 