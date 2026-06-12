import { z } from "zod";
import "dotenv/config"

const envSchema = z.object({
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    CORSAIR_KEK:z.string()
});

export const env = envSchema.parse(process.env);