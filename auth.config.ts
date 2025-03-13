import type { NextAuthConfig } from 'next-auth';
import Routes from './Routes';

export const authConfig: NextAuthConfig = {
  experimental: { enableWebAuthn: true },
  pages: {
    signIn: '/signin',
    error: '/signin/error',
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnDashboardMain = nextUrl.pathname === '/dashboard';
      const isOnAuthPage = nextUrl.pathname.startsWith('/signin');

      if (isLoggedIn && isOnAuthPage) {
        return Response.redirect(new URL('/', nextUrl));
      }
      if (isLoggedIn && isOnDashboardMain) {
        return Response.redirect(new URL(Routes.dashboard['account management']['account information'], nextUrl));
      }
      if (!isLoggedIn && isOnDashboard) {
        return false;
      }
      return true;
    }
  },
  providers: [], // Add your providers here
};
