import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: FirestoreAdapter({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    }),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger }) {
            if (user) {
                token.role = user.role || 'user';
                token.id = user.id;
            }

            if (trigger === 'update') {
                const db = getFirestore();
                const userDoc = await db
                    .collection('users')
                    .doc(token.id as string)
                    .get();
                token.role = userDoc.data()?.role || 'user';
            }

            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role as 'admin' | 'user';
            session.user.id = token.id as string;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
});
