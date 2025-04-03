import { executeMCPTool } from "@/app/service/mcpService";
import { MCPServerTool } from "../type";
export const config = {
    runtime: "edge",
};

export async function POST(req: Request) {
    try {
        const { project_path, max_count } = await req.json();
        const tool_name: MCPServerTool = "git_log_tool";
        console.log(
            `DEBUG git_log_tool tool called: `,
            project_path,
            max_count
        );
        const result = await executeMCPTool(tool_name, {
            repo_path: project_path,
            max_count,
        });
        return new Response(JSON.stringify({ result }));
    } catch (error) {
        console.error("DEBUG MCP Client Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
