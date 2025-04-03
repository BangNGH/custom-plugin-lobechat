import { executeMCPTool } from "@/app/service/mcpService";
import { MCPServerTool } from "../type";

export const config = {
    runtime: "edge",
};

export async function POST(req: Request) {
    try {
        const toolName: MCPServerTool = "index_github_repo";
        const { repo_url, access_token } = await req.json();
        console.log("DEBUG Github index code called: ", repo_url, access_token);
        const result = await executeMCPTool(toolName, {
            repo_url,
            access_token: access_token,
        });
        return new Response(JSON.stringify(result));
    } catch (error) {
        console.error("DEBUG MCP Client Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
