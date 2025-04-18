"use server"

import { auth, signIn, signOut } from "@/app/lib/auth";

export async function handlerAuth() {
   const session = await auth();
   
   if (session) {
      await signOut({
         redirectTo: "/login"
      });

      return;
   }

   await signIn("google", {
      redirectTo: "/dashboard"
   });
}