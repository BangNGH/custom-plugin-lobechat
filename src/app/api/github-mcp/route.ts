import { connectToMCPServer } from "@/app/service/mcpService";

export const config = {
    runtime: "edge",
};

export async function POST(req: Request) {
    try {
        const result = await connectToMCPServer();
        return new Response(JSON.stringify(result));
    } catch (error) {
        console.error("DEBUG MCP Client Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
