import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        // Here we'll add Prisma DB check later when we set up the DB fully.
        // For now, allow a hardcoded test admin user if they match.
        if (credentials?.email === "admin@wairb.com" && credentials?.password === "admin123") {
          return { id: "1", name: "Admin Wairb", email: "admin@wairb.com", role: "ADMIN" }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
      }
      return session
    }
  }
})
