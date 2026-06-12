import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schemas/auth-schema"

export const auth = betterAuth({
    emailAndPassword:{
        enabled:true
    },
    // when we try to access user info we don't need to call backend api every time-> this will cache that info for 1 min
    session:{
        cookieCache:{
            enabled:true,
            maxAge:60 // 1 min
        }
    },
    // plugin helps the application to setup cookies inside nextJs application when we do signup and signin based operations on your server
    plugins:[nextCookies()],
    database: drizzleAdapter(db, {
        provider: "pg", 
        schema
    }),
});