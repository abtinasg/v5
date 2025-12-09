import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'phone-otp',
      name: 'Phone OTP',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        code: { label: 'Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) {
          return null;
        }

        // Verify OTP
        const otpRecord = await prisma.otpCode.findFirst({
          where: {
            phone: credentials.phone,
            code: credentials.code,
            verified: false,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (!otpRecord) {
          return null;
        }

        // Mark OTP as verified
        await prisma.otpCode.update({
          where: { id: otpRecord.id },
          data: { verified: true },
        });

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              phone: credentials.phone,
              credits: 50, // Welcome bonus
            },
          });
        }

        // Update OTP with userId
        await prisma.otpCode.update({
          where: { id: otpRecord.id },
          data: { userId: user.id },
        });

        return {
          id: user.id,
          phone: user.phone,
          name: user.name,
          credits: user.credits,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
