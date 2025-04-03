export async function POST(req: Request) {
    try {
        const { code } = await req.json();
        console.log("DEBUG code:", code);

        if (!code) {
            return new Response("Invalid code", { status: 501 });
        }

        const response = await fetch(
            "https://github.com/login/oauth/access_token",
            {
                body: JSON.stringify({
                    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                method: "POST",
            }
        );
        if (response.status !== 200 || !response.ok) {
            const err = await response.text();
            console.log("DEBUG err:", err);
            throw new Error(
                `HTTP error! Status: ${response.status}: ${err.toString()}`
            );
        }
        const data = await response.json();
        console.log("DEBUG auth-github response:", data);
        return Response.json({ data });
    } catch (error) {
        console.error("DEBUG MCP Client Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
