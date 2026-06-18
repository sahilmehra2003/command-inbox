
import { OpenAIAgentsProvider } from '@corsair-dev/mcp';
import { Agent, run, tool } from '@openai/agents';
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { corsair } from '@/server/corsair';
import { CorsairApiError } from '@corsair-dev/app';
import { error } from 'console';


export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            )
        }
        const body = await request.json();
        const message = body.message;
        if (!message) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Message is required",
                },
                {
                    status: 400,
                }
            );
        }

        const provider = new OpenAIAgentsProvider();


        // 
        const tenantCorsair = corsair.withTenant(user.id);
        const tools = provider.build({
            corsair: tenantCorsair,
            tool,
            tenantId: user.id,
        });

        const agent = new Agent({
            name: "command-inbox-agent",
            model: "gpt-4o-mini",
            instructions: `You are Command Inbox AI.
            You have access to Gmail and Google Calendar.
            Use list_operations only once when discovering APIs.
            After you know an operation path, call get_schema and then run_script.
            Do not repeatedly call list_operations for the same task.
            When retrieving emails:
           1. Never stop after gmail.api.messages.list().
           2. The list endpoint only provides IDs.
           3. For every returned message ID:
              call gmail.api.messages.get().
           4. Extract:
              - Subject
              - From
              - Date
              - Snippet
           5. Return human-readable results.
           6. Never return raw IDs unless the user explicitly asks.
           
           If a tool call fails, explain the failure instead of retrying indefinitely.`,
            tools,
        });
        const result = await run(
            agent,
            message,
            {
                maxTurns: 5
            }
        );
        for (const item of result.state._generatedItems) {
            console.dir(item, { depth: null });
        }
        return NextResponse.json({
            success: true,
            response: result.finalOutput,
        });
    } catch (err) {
        if (err instanceof CorsairApiError) {
            console.error(err.status, err.code, err.message, err.details);

        }


        return NextResponse.json(
            {
                success: false,
                message: "Failed to process request",
            },
            {
                status: 500,
            }
        );
    }
}