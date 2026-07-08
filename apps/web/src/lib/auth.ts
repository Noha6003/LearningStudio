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

        try {
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
        } catch (dbError) {
          console.warn("⚠️ Database connection failed. Falling back to local mock authentication for offline testing.");
          
          // Local fallback accounts for testing without database
          const mockAccounts: Record<string, any> = {
            'student@learning.com': { 
              id: 'mock-student-id', 
              name: 'Sammy Star (Mock)', 
              email: 'student@learning.com',
              role: 'STUDENT', 
              studentProfileId: 'mock-student-profile-id' 
            },
            'teacher@learning.com': { 
              id: 'mock-teacher-id', 
              name: 'Professor Sarah (Mock)', 
              email: 'teacher@learning.com',
              role: 'TEACHER', 
              teacherProfileId: 'mock-teacher-profile-id' 
            },
            'parent@learning.com': { 
              id: 'mock-parent-id', 
              name: 'Helen Star (Mock)', 
              email: 'parent@learning.com',
              role: 'PARENT', 
              parentProfileId: 'mock-parent-profile-id' 
            },
            'admin@learning.com': { 
              id: 'mock-admin-id', 
              name: 'Super Admin (Mock)', 
              email: 'admin@learning.com',
              role: 'SUPER_ADMIN' 
            }
          };

          if (mockAccounts[email] && password === 'password123') {
            return mockAccounts[email];
          }
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
