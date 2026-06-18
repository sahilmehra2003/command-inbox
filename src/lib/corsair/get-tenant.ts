import { corsair } from "@/server/corsair";

export const getTenant = async (tenantId: string) => {
    const tenant = corsair.withTenant(tenantId);

    if (!tenant) {
        throw new Error("Corsair account not found");
    }
    return tenant
}