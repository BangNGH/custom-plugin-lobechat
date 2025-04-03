import { executeMCPTool } from "@/app/service/mcpService";
import { MCPServerTool } from "../type";

export const config = {
    runtime: "edge",
};

export async function POST(req: Request) {
    try {
        const toolName: MCPServerTool = "search_code";
        const { query, project_path, extensions, case_sensitive } =
            await req.json();
        console.log(
            "DEBUG searchCode tool called: ",
            query,
            project_path,
            extensions,
            case_sensitive
        );
        const result = await executeMCPTool(toolName, {
            query,
            project_path,
            extensions,
            case_sensitive,
        });
        return new Response(JSON.stringify(result));
    } catch (error) {
        console.error("DEBUG MCP Client Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
