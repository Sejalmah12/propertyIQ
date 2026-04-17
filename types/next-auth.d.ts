import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone?: string | null;
      mode: string;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    phone?: string | null;
    mode: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone?: string | null;
    mode: string;
    image?: string | null;
  }
}
