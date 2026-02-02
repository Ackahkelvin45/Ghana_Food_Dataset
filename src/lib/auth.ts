import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/src/lib/prisma"
import bcrypt from "bcryptjs"

export const { signIn, signOut, auth, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: String(credentials.username).trim() },
        })
        if (!user || !(await bcrypt.compare(String(credentials.password), user.password)))
          return null
        return {
          id: String(user.id),
          email: user.email,
          name: user.fullName,
        }
      },
    }),
  ],
})