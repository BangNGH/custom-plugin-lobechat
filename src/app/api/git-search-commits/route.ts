import { executeMCPTool } from "@/app/service/mcpService";
import { MCPServerTool } from "../type";

export const config = {
    runtime: "edge",
};

export async function POST(req: Request) {
    try {
        const tool_name: MCPServerTool = "git_search_commits_tool";
        const {
            project_path,
            query,
            max_results,
            search_file_content,
            search_commit_messages,
            search_file_paths,
        } = await req.json();
        console.log(
            `DEBUG ${tool_name} tool called: `,
            project_path,
            query,
            max_results,
            search_file_content,
            search_commit_messages,
            search_file_paths
        );
        const result = await executeMCPTool(tool_name, {
            repo_path: project_path,
            query,
            max_results,
            search_file_content,
            search_commit_messages,
            search_file_paths,
        });
        return new Response(JSON.stringify({ result }));
    } catch (error) {
        console.error("DEBUG MCP Client Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
