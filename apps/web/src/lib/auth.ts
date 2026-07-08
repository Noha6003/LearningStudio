import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@learningma/database';

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'student@learning.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find user in database
        const user = await db.user.findUnique({
          where: { email },
          include: {
            studentProfile: true,
            teacherProfile: true,
            parentProfile: true
          }
        });

        // Simple password check for development (In production, use bcrypt hash comparison)
        if (user && user.password === password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            studentProfileId: user.studentProfile?.id,
            teacherProfileId: user.teacherProfile?.id,
            parentProfileId: user.parentProfile?.id
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.studentProfileId = (user as any).studentProfileId;
        token.teacherProfileId = (user as any).teacherProfileId;
        token.parentProfileId = (user as any).parentProfileId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).studentProfileId = token.studentProfileId as string;
        (session.user as any).teacherProfileId = token.teacherProfileId as string;
        (session.user as any).parentProfileId = token.parentProfileId as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt'
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
