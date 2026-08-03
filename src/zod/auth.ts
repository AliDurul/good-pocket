import { z } from 'zod';

const password = z.string()
    .min(8, 'Password must be at least 8 characters')
    // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[A-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

export const signInSchema = z
    .object({
        email: z.email('Enter a valid email address'),
        password,
    })
    .strict();



export const signUpSchema = z
    .object({
        name: z.string().min(2, 'Full name is required'),
        email: z.email('Enter a valid email address'),
        phone: z.string().regex(/^\d{9}$/, 'Invalid phone number, must be 9 digits'),
        password,
        confirmPassword: password,
        country: z.string().min(1, 'Country is required'),
        city: z.string().min(1, 'City is required'),
        town: z.string().min(1, 'Town or area is required'),
        location: z.object(
            {
                latitude: z.number(),
                longitude: z.number(),
            },
            { error: 'Please capture your location' },
        ),
        birthday: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    })



export type SignInForm = z.infer<typeof signInSchema>;
export type SignUpForm = z.infer<typeof signUpSchema>;