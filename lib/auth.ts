import GoogleProvider from "next-auth/providers/google";
import prisma from "@/db/db";

import { NextAuthOptions, Session } from "next-auth";

export interface session extends Session {
  user?: {
    email?: string | null;
    name?: string | null;
    image?: string | null;
    id?: string | null;
  };
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
    session: ({
      session,
      token,
    }: {
      session: session;
      token: { id: string };
    }): session => {
      const newSession: session = session as session;
      if (newSession.user && token.id) {
        newSession.user.id = token.id ?? "";
      }
      // console.log("newSession", newSession);
      return newSession!;
    },
    // @ts-ignore
    async jwt({
      token,
    }: //  account, profile
    {
      token: { email: string; id: String };
    }) {
      const user = await prisma.user.findFirst({
        where: {
          email: token?.email ?? "",
        },
      });
      if (user) {
        token.id = user.id;
      }
      // console.log("token ", token);
      return token;
    },
    // @ts-ignore
    async signIn({
      user,
      account,
      profile,
    }: //  email, credentials
    {
      user: { email: string };
      account: { provider: string | null };
      profile: { name: string | null };
    }) {
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
            name: profile?.name,
          },
        });

        // console.log("inside sign in ", {
        //   user,
        //   account,
        //   profile,
        // });
        return true;
      }

      return false;
    },
  },
} satisfies NextAuthOptions;
