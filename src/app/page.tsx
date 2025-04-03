"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { lobeChat } from "@lobehub/chat-plugin-sdk/client";

import { clonePrivateRepo, fetchGitHubAccessToken } from "./service/githubAuth";
import { useEffect, useState } from "react";

export default function Home() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [repoUrl, setRepoUrl] = useState<string>(""); // State for repo URL input
    const [cloneStatus, setCloneStatus] = useState<{
        message: string;
        type: "success" | "error" | "info" | null;
    }>({ message: "", type: null }); // State for clone status message

    // Initialize accessToken from sessionStorage on mount
    useEffect(() => {
        setAccessToken(sessionStorage.getItem("accessToken"));
    }, []);

    useEffect(() => {
        console.log("DEBUG accessToken", accessToken);
    }, [accessToken]);

    const handleLogout = () => {
        sessionStorage.removeItem("accessToken");
        setAccessToken(null); // Update state
    };

    const handleClonePrivateRepo = async () => {
        setCloneStatus({ message: "Cloning...", type: "info" }); // Indicate cloning start

        if (!accessToken || !repoUrl) {
            setCloneStatus({
                message:
                    "Access token or repository URL is missing. Please log in and enter a URL.",
                type: "error",
            });
            return;
        }
        try {
            // Call the service function with token and repo URL
            const mcpResult = await clonePrivateRepo(accessToken, repoUrl);
            const resText = mcpResult.toolResult.content[0].text;
            console.log("DEBUG resText", resText);
            if (resText.includes("error") || resText.includes("Error")) {
                console.error("DEBUG resText", resText);
                setCloneStatus({
                    message: `Failed to clone repository: ${repoUrl}`,
                    type: "error",
                });
                setTimeout(() => {
                    setCloneStatus({ message: "", type: null });
                }, 5000);
                return;
            }
            setCloneStatus({
                message: resText,
                type: "success",
            });
        } catch (error) {
            const errorMessage = `Failed to clone repository: ${
                error instanceof Error ? error.message : String(error)
            }`;
            console.error(errorMessage); // Keep console log for debugging
            setCloneStatus({ message: errorMessage, type: "error" });
        }
    };

    const handleLogin = () => {
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
            `https://github.com/login/oauth/authorize?client_id=${
                process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
            }&scope=repo&redirect_uri=${encodeURIComponent(
                process.env.NEXT_PUBLIC_REDIRECT_URI!
            )}`,
            "GitHub Login",
            `width=${width},height=${height},top=${top},left=${left}`
        );

        const interval = setInterval(async () => {
            try {
                if (
                    popup?.location?.href &&
                    popup?.location?.href.includes("?code=")
                ) {
                    const url = new URL(popup.location.href);
                    const code = url.searchParams.get("code");
                    if (!code) {
                        lobeChat.createAssistantMessage(
                            "You have failed to log in to GitHub. Please try again!"
                        );
                    } else if (code) {
                        url.searchParams.delete("code");
                        popup.history.replaceState(
                            {},
                            popup.document.title,
                            url.toString()
                        );
                        const res = await fetchGitHubAccessToken(code);
                        console.log("DEBUG res", res);
                        const fetchedToken = res.access_token
                            ? res.access_token
                            : "";
                        sessionStorage.setItem("accessToken", fetchedToken);
                        setAccessToken(fetchedToken); // Update state
                        console.log("DEBUG fetchedToken", fetchedToken);
                    }
                    popup.close();
                    clearInterval(interval);
                }
            } catch (error) {
                console.log(error);
            }
        }, 1000);
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Image
                    className={styles.logo}
                    src="/next.svg"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                />
                <div className={styles.ctas}>
                    <a
                        className={styles.primary}
                        href="#"
                        onClick={accessToken ? handleLogout : handleLogin} // Use state variable
                        role="button"
                        aria-label={
                            accessToken // Use state variable
                                ? "Logout with GitHub"
                                : "Login with GitHub"
                        }
                    >
                        <Image
                            className={styles.logo}
                            src="/vercel.svg"
                            alt="Vercel logomark"
                            width={20}
                            height={20}
                        />
                        {accessToken ? "Logout" : "Login with GitHub"}{" "}
                        {/* Use state variable */}
                    </a>
                </div>
                {/* Conditionally render input field when logged in */}
                {accessToken && (
                    <div className={styles.inputContainer}>
                        {" "}
                        {/* Added a container for potential styling */}
                        <input
                            type="text"
                            placeholder="Enter repository URL..."
                            className={styles.textInput}
                            value={repoUrl} // Bind value to state
                            onChange={(e) => setRepoUrl(e.target.value)} // Update state on change
                        />
                        <button
                            className={`${styles.button} ${styles.primary}`}
                            onClick={handleClonePrivateRepo} // Call the handler directly
                        >
                            {" "}
                            {/* Added button with styles */}
                            Clone
                        </button>
                    </div>
                )}
                {/* Display Clone Status */}
                {cloneStatus.message && (
                    <div
                        className={`${styles.statusMessage} ${
                            cloneStatus.type ? styles[cloneStatus.type] : ""
                        }`}
                    >
                        {cloneStatus.message}
                    </div>
                )}
            </main>
        </div>
    );
}
