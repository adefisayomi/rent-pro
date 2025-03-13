import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      gender?: string;
      phone?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username?: string;
    gender?: string;
    phone?: string;
  }
}
