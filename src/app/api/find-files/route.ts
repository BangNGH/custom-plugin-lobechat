import { executeMCPTool } from "@/app/service/mcpService";
import { MCPServerTool } from "../type";

export const config = {
    runtime: "edge",
};

export async function POST(req: Request) {
    try {
        const toolName: MCPServerTool = "find_files";
        const { pattern, project_path } = await req.json();
        console.log(`DEBUG ${toolName} tool called: `, pattern, project_path);
        const result = await executeMCPTool(toolName, {
            pattern,
            project_path,
        });
        return new Response(JSON.stringify(result));
    } catch (error) {
        console.error("DEBUG MCP Client Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
