import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"
import { nextCookies } from "better-auth/next-js";
import { env } from "@/config/env.config";
import * as schema from "@/db/schemas/auth-schema"
import { sendForgotPasswordEmail, sendUserVerificationEmail, sendWelcomeEmail } from "@/services/email.service";
import { createAuthMiddleware } from "better-auth/api";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        revokeSessionsOnPasswordReset: true,
        resetPasswordTokenExpiresIn: 60 * 15, // 15min
        sendResetPassword: async ({ user, url }) => {
             await sendForgotPasswordEmail({
                email:user.email,
                name:user.name,
                resetUrl:url
             })
        },


    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        expiresIn: 60 * 15, // 15min
           sendVerificationEmail: async ({ user, url }) => {
            await sendUserVerificationEmail({
                email: user.email,
                name: user.name,
                verificationUrl: url
            })
        },

    },
    // Google oauth login
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET
        }
    },
    // when we try to access user info we don't need to call backend api every time-> this will cache that info for 1 min
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 // 1 min
        }
    },
    // plugin helps the application to setup cookies inside nextJs application when we do signup and signin based operations on your server
    plugins: [nextCookies()],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    // allows us to perform action on event
    hooks:{
       after:createAuthMiddleware(async ctx=>{
           if (ctx.path.startsWith("/sign-up")) {
              const user=ctx.context.newSession?.user ?? {
                name:ctx.body.name,
                email:ctx.body.email
              }
              if (user!=null) {
                await sendWelcomeEmail({
                    email:user.email,
                    name:user.name,
                    dashboardUrl:env.BETTER_AUTH_URL
                })
              }
           }
       })
    }
});