// NextAuth types
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      capabilities: string[];
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    phone?: string;
    forcePasswordReset: boolean;
    capabilities: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    capabilities: string[];
  }
}
