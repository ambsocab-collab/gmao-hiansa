// NextAuth types
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      capabilities: string[];
      forcePasswordReset?: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    passwordHash?: string;
    phone?: string;
    forcePasswordReset?: boolean;
    capabilities?: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    capabilities?: string[];
    forcePasswordReset?: boolean;
  }
}
