export async function fetchGitHubAccessToken(code: string) {
    try {
        const response = await fetch("/api/auth-github", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetchGitHubAccessToken. HTTP error! Status: ${
                    response.status
                }: ${response.text()}`
            );
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Error fetching GitHub access token:", error);
        return null;
    }
}

export async function clonePrivateRepo(access_token: string, repoUrl: string) {
    try {
        const response = await fetch("/api/github-code-index", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_token: access_token,
                repo_url: repoUrl,
            }),
        });
        if (!response.ok) {
            throw new Error(
                `Failed to clone private repo. HTTP error! Status: ${
                    response.status
                }: ${response.text()}`
            );
        }
        const result = await response.json();
        console.log("DEBUG clonePrivateRepo response", result);
        return result;
    } catch (error) {
        console.error("Error clonePrivateRepo:", error);
        throw new Error(`Failed to clone private repo. ${error}`);
    }
}
