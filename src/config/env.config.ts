import { z } from "zod";
import "dotenv/config"

const envSchema = z.object({
    NODE_ENV:z.string(),
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    CORSAIR_KEK:z.string(),
    GOOGLE_CLIENT_ID:z.string(),
    GOOGLE_CLIENT_SECRET:z.string(),
    RESEND_API_KEY:z.string(),
    APP_URL:z.string(),
    OPENAI_API_KEY:z.string(),

});

export const env = envSchema.parse(process.env);