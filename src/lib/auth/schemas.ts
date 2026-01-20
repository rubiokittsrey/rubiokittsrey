import { z } from 'zod';

export const userSchema = z.object({
    id: z.string(),
    email: z.email(),
    name: z.string().optional(),
    image: z.string().optional(),
    role: z.enum(['admin', 'user']),
});

export type User = z.infer<typeof userSchema>;
