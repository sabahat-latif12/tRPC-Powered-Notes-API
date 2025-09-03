import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { createNoteSchema, updateNoteSchema, noteIdSchema, noteQuerySchema } from '../schemas/note';

export const notesRouter = router({
  // Create a new note
  create: publicProcedure
    .input(createNoteSchema)
    .mutation(async ({ input, ctx }) => {
      const note = await ctx.prisma.note.create({
        data: {
          ...input,
          tags: JSON.stringify(input.tags),
        },
      });
      return {
        ...note,
        tags: JSON.parse(note.tags),
      };
    }),

  // Get a note by ID
  getById: publicProcedure
    .input(noteIdSchema)
    .query(async ({ input, ctx }) => {
      const note = await ctx.prisma.note.findUnique({
        where: { id: input.id },
      });
      if (!note) {
        throw new Error('Note not found');
      }
      return {
        ...note,
        tags: JSON.parse(note.tags),
      };
    }),

  // Get all notes with optional filtering and pagination
  getAll: publicProcedure
    .input(noteQuerySchema)
    .query(async ({ input, ctx }) => {
      const { search, tags, page, limit } = input;
      const skip = (page - 1) * limit;

      // Get all notes first, then filter in memory for SQLite
      const allNotes = await ctx.prisma.note.findMany({
        orderBy: { updatedAt: 'desc' },
      });

      // Filter by search term if provided
      let filteredNotes = allNotes;
      if (search) {
        filteredNotes = allNotes.filter(note => 
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Filter by tags if provided
      if (tags && tags.length > 0) {
        filteredNotes = filteredNotes.filter(note => {
          const noteTags = JSON.parse(note.tags);
          return tags.some(tag => noteTags.includes(tag));
        });
      }

      // Apply pagination
      const total = filteredNotes.length;
      const paginatedNotes = filteredNotes.slice(skip, skip + limit);

      // Parse tags for each note
      const notes = paginatedNotes.map(note => ({
        ...note,
        tags: JSON.parse(note.tags),
      }));

      return {
        notes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }),

  // Update a note
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: updateNoteSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, data } = input;
      
      // Filter out undefined values for Prisma
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags);
      
      const note = await ctx.prisma.note.update({
        where: { id },
        data: updateData,
      });
      
      return {
        ...note,
        tags: JSON.parse(note.tags),
      };
    }),

  // Delete a note
  delete: publicProcedure
    .input(noteIdSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.note.delete({
        where: { id: input.id },
      });
      
      return { success: true, message: 'Note deleted successfully' };
    }),

  // Get all unique tags
  getTags: publicProcedure
    .query(async ({ ctx }) => {
      const notes = await ctx.prisma.note.findMany({
        select: { tags: true },
      });
      
      const allTags = notes.flatMap(note => JSON.parse(note.tags));
      const uniqueTags = [...new Set(allTags)].sort();
      
      return uniqueTags;
    }),
});
