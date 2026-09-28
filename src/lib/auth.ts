import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
    pages: {
        signIn: "/login",
    },
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, request) {
                const validated = loginSchema.safeParse(credentials);
                if (!validated.success) return null;

                const { email, password } = validated.data;

                // Brute-force protection: per account and per IP
                const ip =
                    request?.headers?.get("x-real-ip") ||
                    request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                    "unknown";
                const [emailOk, ipOk] = await Promise.all([
                    rateLimit(`login:email:${email}`, 10, 15 * 60),
                    rateLimit(`login:ip:${ip}`, 30, 15 * 60),
                ]);
                if (!emailOk || !ipOk) return null;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.password) return null;

                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role?: string }).role ?? "CUSTOMER";
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
});
