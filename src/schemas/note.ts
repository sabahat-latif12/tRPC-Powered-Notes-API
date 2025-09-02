import { z } from 'zod';

// Base note schema
export const noteBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).default([]),
});

// Schema for creating a new note
export const createNoteSchema = noteBaseSchema;

// Schema for updating a note
export const updateNoteSchema = noteBaseSchema.partial();

// Schema for note ID
export const noteIdSchema = z.object({
  id: z.string().min(1, 'Note ID is required'),
});

// Schema for note queries
export const noteQuerySchema = z.object({
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Schema for the complete note (including generated fields)
export const noteSchema = noteBaseSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Types derived from schemas
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type Note = z.infer<typeof noteSchema>;
export type NoteQuery = z.infer<typeof noteQuerySchema>; 