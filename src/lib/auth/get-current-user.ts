import { auth } from "../auth";
import { headers } from "next/headers";

export interface User{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;

}

export const getCurrentUser=async():Promise<User | null>=>{
    const session=await auth.api.getSession({headers:await headers()});
    return session?.user ?? null;
}