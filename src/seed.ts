import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.note.deleteMany();
  console.log('🗑️  Cleared existing notes');

  // Create sample notes
  const sampleNotes = [
    {
      title: 'Welcome to Notes API',
      content: 'This is your first note! You can create, read, update, and delete notes using the tRPC API.',
      tags: ['welcome', 'getting-started'],
    },
    {
      title: 'Shopping List',
      content: 'Milk, bread, eggs, cheese, and some fresh vegetables for the week.',
      tags: ['shopping', 'personal'],
    },
    {
      title: 'Meeting Notes - Project Kickoff',
      content: 'Discussed project timeline, team roles, and initial requirements. Next meeting scheduled for Friday.',
      tags: ['work', 'meeting', 'project'],
    },
    {
      title: 'Recipe Ideas',
      content: 'Pasta carbonara, chicken curry, and homemade pizza. Need to buy ingredients this weekend.',
      tags: ['cooking', 'recipes', 'food'],
    },
    {
      title: 'Book Recommendations',
      content: 'The Pragmatic Programmer, Clean Code, and Design Patterns. Must-read for developers.',
      tags: ['books', 'programming', 'learning'],
    },
  ];

  for (const noteData of sampleNotes) {
    await prisma.note.create({
      data: noteData,
    });
  }

  console.log(`✅ Created ${sampleNotes.length} sample notes`);

  // Display created notes
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: 'asc' },
  });

  console.log('\n📝 Sample notes created:');
  notes.forEach((note) => {
    console.log(`  - ${note.title} (${note.tags.join(', ')})`);
  });

  console.log('\n🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 