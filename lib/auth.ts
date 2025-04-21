import GoogleProvider from "next-auth/providers/google";
import prisma from "@/db/db";
import { NextAuthOptions, Session } from "next-auth";
import { Role } from "@prisma/client";

export interface session extends Session {
  user?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    role?: Role;
    profilePic?: string | null;
  };
}

interface Token {
  id?: string;
  name?: string | null;
  email: string;
  role?: Role;
  profilePic?: string | undefined | null;
}

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    // @ts-ignore
    session: async ({
      session,
      token,
    }: {
      session: session;
      token: Token;
    }): Promise<session> => {
      const newSession: session = session as session;
      if (newSession.user) {
        newSession.user.id = token.id ?? "";
        newSession.user.name = token.name ?? "";
        newSession.user.email = token.email ?? "";
        newSession.user.role = token.role;
        newSession.user.profilePic = token.profilePic ?? undefined;
      }
      return newSession;
    },
    // @ts-ignore
    jwt: async ({ token }: { token: Token }) => {
      const user = await prisma.user.findFirst({
        where: {
          email: token?.email ?? "",
        },
      });
      if (user) {
        token.id = user.id.toString();
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.profilePic = user.profilePic;
      }
      return token;
    },
    // @ts-ignore
    signIn: async ({
      user,
      account,
      profile,
    }: {
      user: { email: string };
      account: { provider: string | null };
      profile: { name: string | null; picture?: string };
    }) => {
      if (account?.provider === "google") {
        const email = user.email;
        if (!email) {
          return false;
        }

        const userDb = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });

        if (userDb) {
          return true;
        }

        await prisma.user.create({
          data: {
            email: email,
            name: profile?.name ?? "Unknown",
            profilePic: profile?.picture, // <-- Save the Google profile image
            role: "USER",
            password: "",
            number: "",
          },
        });

        return true;
      }

      return false;
    },
  },
} satisfies NextAuthOptions;
