import { executeMCPTool } from "@/app/service/mcpService";
import { MCPServerTool } from "../type";

export const config = {
    runtime: "edge",
};

export async function POST(req: Request) {
    try {
        const toolName: MCPServerTool = "refresh_index";
        const { project_path } = await req.json();
        console.log("DEBUG refresh_index tool called: ", project_path);
        const result = await executeMCPTool(toolName, {
            project_path,
        });
        return new Response(JSON.stringify(result));
    } catch (error) {
        console.error("DEBUG MCP Client Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
