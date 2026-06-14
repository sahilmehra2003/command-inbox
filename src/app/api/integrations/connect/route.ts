import { generateOAuthUrl } from "corsair/oauth";
import { corsair } from "@/server/corsair";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/config/env.config";
import { getCurrentUser } from "@/lib/auth/get-current-user";



const REDIRECT_URI = `${env.APP_URL}/api/integrations/callback`;

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            )
        }
        const tenantId = user.id;
        const plugin = new URL(request.url).searchParams.get("plugin");
        if (!plugin) {
            return NextResponse.json({ success:false,message: 'Missing plugin param' }, { status: 400 });
        }
        const { url, state } = await generateOAuthUrl(corsair, plugin, {
            tenantId,
            redirectUri: REDIRECT_URI
        })
        const response = NextResponse.redirect(url);
        response.cookies.set("oauth_state", state, {
            httpOnly: true,
            sameSite: "lax",
            secure: env.NODE_ENV === "production",
            maxAge: 60 * 10,
        })
        return response;
    } catch (error) {
        console.error("Error is: ", error);
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, error: `Failed to fetch todo:${error.message}` },
                { status: 500 }
            )
        }
        throw new Error("Failure in connection!");
    }
}