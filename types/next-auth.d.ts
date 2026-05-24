import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id:    string;
      name:  string;
      email: string;
      role:  'client' | 'admin';
    };
  }
  interface User {
    id:   string;
    role: 'client' | 'admin';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id:   string;
    role: string;
  }
}
