import NextAuth from "next-auth"; import Credentials from "next-auth/providers/credentials"; import { prisma } from "@/lib/prisma"; import bcrypt from "bcryptjs";
export const { auth, signIn, signOut, handlers } = NextAuth({
  providers:[Credentials({ name:"Credenciais", credentials:{ email:{label:"Email",type:"email"}, password:{label:"Senha",type:"password"} }, authorize: async (creds)=>{ if(!creds?.email||!creds?.password) return null; const u=await prisma.user.findUnique({ where:{ email:creds.email }}); if(!u) return null; const ok=await bcrypt.compare(creds.password,u.password); if(!ok) return null; return { id:String(u.id), name:u.name, email:u.email, role:u.role }; } })],
  session:{ strategy:"jwt" },
  callbacks:{ async jwt({token,user}){ if(user) token.role=(user as any).role; return token; }, async session({session,token}){ (session as any).role=token.role; return session; } },
  secret: process.env.NEXTAUTH_SECRET
});