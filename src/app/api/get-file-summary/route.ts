import { executeMCPTool } from "@/app/service/mcpService";
import { MCPServerTool } from "../type";

export const config = {
    runtime: "edge",
};

export async function POST(req: Request) {
    try {
        const toolName: MCPServerTool = "get_file_summary";
        const { file_path, project_path, include_file_content } =
            await req.json();
        console.log(
            "DEBUG searchCode tool called: ",
            file_path,
            project_path,
            include_file_content
        );
        const result = await executeMCPTool(toolName, {
            file_path,
            project_path,
            include_file_content,
        });
        return new Response(JSON.stringify(result));
    } catch (error) {
        console.error("DEBUG MCP Client Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
