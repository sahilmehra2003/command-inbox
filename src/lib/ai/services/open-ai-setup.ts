import OpenAI from "openai";
import { env } from "@/config/env.config";

export const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
});