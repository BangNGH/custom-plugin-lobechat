import { createGatewayOnEdgeRuntime } from "@lobehub/chat-plugins-gateway";

export const config = {
    runtime: "edge",
};

export async function POST(req: Request) {
    if (process.env.NODE_ENV === "development") {
        return createGatewayOnEdgeRuntime()(req);
    }
    return new Response("gateway");
}
