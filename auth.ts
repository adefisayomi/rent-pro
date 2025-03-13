import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import Linkedin from "next-auth/providers/linkedin";
import Credentials from "next-auth/providers/credentials";
import { googleRedirectUri, linkedinRedirectUri, twitterRedirectUri } from "./constants";
import { createUser, getUser, signinOrSignupUser } from "./server/controllers";

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Twitter({ redirectProxyUrl: twitterRedirectUri }),
    Linkedin({ redirectProxyUrl: linkedinRedirectUri }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // Fetch user by username (or email if applicable)
        const user = await signinOrSignupUser(credentials.email as string, credentials.password as string);
        if (!user.success || !user.data) return null;
        return user.data;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Ensure user exists or create one
      let existingUser = await getUser(user.email as string);

      if (!existingUser.success || !existingUser.data) {
        await createUser({ email: user.email as string });
        existingUser = await getUser(user.email as string);
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // Set user properties if available
        token.id = user.id;
        token.username = user.username;
        token.gender = user.gender;
        token.phone = user.phone;
      } else if (!token.id) {
        // Fetch user from DB if not already set
        const fetchedUser = await getUser(token.email as string);
        if (fetchedUser.success && fetchedUser.data) {
          token.id = fetchedUser.data.id;
          token.username = fetchedUser.data.username;
          token.gender = fetchedUser.data.gender;
          token.phone = fetchedUser.data.phone;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.gender = token.gender as string;
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },
});
