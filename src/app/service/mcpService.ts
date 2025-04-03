import { experimental_createMCPClient } from "ai";
import { PluginErrorType, createErrorResponse } from "@lobehub/chat-plugin-sdk";
import { MCPServerTool } from "../api/type";
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio";

export async function executeMCPTool(
    toolName: MCPServerTool,
    args: Record<string, unknown>
) {
    try {
        const mcpClient = await experimental_createMCPClient({
            transport: {
                type: "sse",
                url: "http://localhost:8000/sse",
            },
        });

        const tools = await mcpClient.tools();

        const tool = tools[toolName];
        if (!tool) {
            return createErrorResponse(
                PluginErrorType.InternalServerError,
                `Tool ${toolName} not found in MCP server`
            );
        }

        const toolResult = await tool.execute(
            { ...args },
            {
                toolCallId: Math.random().toString(36).substring(2),
                messages: [],
            }
        );
        console.log("DEBUG toolResult", toolName, toolResult);

        await mcpClient.close();

        return {
            toolName,
            toolResult,
            today: Date.now(),
        };
    } catch (error) {
        console.error("DEBUG MCP Client Error:", error);
        throw error;
    }
}

export async function connectToMCPServer() {
    try {
        const transport = new Experimental_StdioMCPTransport({
            command: "/usr/local/bin/go",
            args: [
                "run",
                "/Users/tamtran/Documents/mcp/github-mcp-server/cmd/github-mcp-server/main.go",
                "stdio",
            ],
            cwd: "/Users/tamtran/Documents/mcp/github-mcp-server",
            env: {
                ...process.env,
                GITHUB_PERSONAL_ACCESS_TOKEN: "GITHUB_PERSONAL_ACCESS_TOKEN",
            },
        });

        const stdioClient = await experimental_createMCPClient({
            transport,
        });

        const tools = await stdioClient.tools();

        const toolResult = await tools.search_code.execute(
            {
                q: "git_clone in:file repo:BangNGH/github-code-index-mcp-server",
            },
            {
                toolCallId: Math.random().toString(36).substring(2),
                messages: [],
            }
        );
        console.log("DEBUG test4", toolResult);
        await stdioClient.close();

        return {
            toolResult,
            today: Date.now(),
        };
    } catch (error) {
        console.error("DEBUG MCP Client Error:", error);
        throw error;
    }
}
