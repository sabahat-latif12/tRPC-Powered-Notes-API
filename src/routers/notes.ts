import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { createNoteSchema, updateNoteSchema, noteIdSchema, noteQuerySchema } from '../schemas/note';

export const notesRouter = router({
  // Create a new note
  create: publicProcedure
    .input(createNoteSchema)
    .mutation(async ({ input, ctx }) => {
      const note = await ctx.prisma.note.create({
        data: input,
      });
      return note;
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
      return note;
    }),

  // Get all notes with optional filtering and pagination
  getAll: publicProcedure
    .input(noteQuerySchema)
    .query(async ({ input, ctx }) => {
      const { search, tags, page, limit } = input;
      const skip = (page - 1) * limit;

      // Build where clause for filtering
      const where: any = {};
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (tags && tags.length > 0) {
        where.tags = {
          hasSome: tags,
        };
      }

      // Get notes with pagination
      const [notes, total] = await Promise.all([
        ctx.prisma.note.findMany({
          where,
          orderBy: { updatedAt: 'desc' },
          skip,
          take: limit,
        }),
        ctx.prisma.note.count({ where }),
      ]);

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
      if (data.tags !== undefined) updateData.tags = data.tags;
      
      const note = await ctx.prisma.note.update({
        where: { id },
        data: updateData,
      });
      
      return note;
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
      
      const allTags = notes.flatMap(note => note.tags);
      const uniqueTags = [...new Set(allTags)].sort();
      
      return uniqueTags;
    }),
}); 