import { executeMCPTool } from "@/app/service/mcpService";
import { MCPServerTool } from "../type";
export const config = {
    runtime: "edge",
};

export async function POST(req: Request) {
    try {
        const { project_path, revision } = await req.json();
        const tool_name: MCPServerTool = "git_show_tool";
        console.log(`DEBUG git Show tool called: `, project_path, revision);
        const result = await executeMCPTool(tool_name, {
            repo_path: project_path,
            revision,
        });
        return new Response(JSON.stringify({ result }));
    } catch (error) {
        console.error("DEBUG MCP Client Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
