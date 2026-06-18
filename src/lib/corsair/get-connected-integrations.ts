import { db } from "@/db";
import { corsairAccounts, corsairIntegrations } from "@/db/schemas/corsair.schema";
import { eq } from "drizzle-orm";

export const getConnectedIntegrations = async (userId: string) => {
    const integrations = await db
        .select({
            id: corsairIntegrations.id,
            name: corsairIntegrations.name
        })
        .from(corsairAccounts)
        .innerJoin(
            corsairIntegrations,
            eq(corsairAccounts.integrationId, corsairIntegrations.id)
        )
        .where(eq(corsairAccounts.tenantId, userId))
    return integrations;

}