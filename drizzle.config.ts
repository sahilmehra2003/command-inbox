import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env.config";

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/db/schemas/*',
    out: "./drizzle",
    dbCredentials: {
        url: env.DATABASE_URL
    }
})