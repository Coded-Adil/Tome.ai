import { z } from 'zod';

const MAX_PDF_SIZE = 50 * 1024 * 1024;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const fileSchema = z.custom<File>((value) => value instanceof File, {
  message: 'Please select a file.',
});

export const UploadSchema = z.object({
  pdf: fileSchema
    .refine((file) => file.type === 'application/pdf', {
      message: 'Please upload a PDF file.',
    })
    .refine((file) => file.size <= MAX_PDF_SIZE, {
      message: 'PDF must be 50MB or smaller.',
    }),
  coverImage: z
    .custom<File | undefined>(
      (value) => value === undefined || value instanceof File,
      { message: 'Please choose a valid image file.' }
    )
    .refine(
      (file) => file === undefined || file.type.startsWith('image/'),
      'Cover image must be an image file.'
    )
    .refine(
      (file) => file === undefined || file.size <= MAX_IMAGE_SIZE,
      'Cover image must be 10MB or smaller.'
    )
    .optional(),
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters long.'),
  author: z
    .string()
    .trim()
    .min(2, 'Author name must be at least 2 characters long.'),
  voice: z.string().min(1, 'Please choose an assistant voice.'),
});

