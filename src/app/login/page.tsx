"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error before new request

    try {
      const controller = new AbortController(); // Add a timeout
      const timeout = setTimeout(() => controller.abort(), 30000); // 10 seconds timeout

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeout); // Clear timeout if request completes

      const rawResponse = await res.text(); // Log the raw response
      console.log("Raw Response from backend:", rawResponse);

      if (!res.ok) {
        // Attempt to parse JSON if response is not okay
        let errorMessage = rawResponse;
        try {
          const errorData = JSON.parse(rawResponse);
          errorMessage = errorData.error || "Something went wrong!";
        } catch {
          console.error("Error parsing error response:", rawResponse);
        }
        throw new Error(errorMessage);
      }

      // Parse successful response
      const data = JSON.parse(rawResponse);
      console.log("Login successful:", data);

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard or home page after successful login
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setError("Request timed out. Please try again.");
        console.error("Request timeout error:", error);
      } else if (error instanceof Error) {
        setError(error.message || "An unexpected error occurred. Please try again.");
        console.error("Error:", error);
      } else {
        setError("An unknown error occurred. Please try again.");
        console.error("Unexpected error type:", error);
      }
    } finally {
      setIsLoading(false); // End loading state after completion
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Logging In..." : "Log In"}
        </button>
      </form>

      {/* Sign Up Option */}
      <div className={styles.signupOption}>
        <p>
          Don&apos;t have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            style={{
              background: "none",
              border: "none",
              color: "#0070f3",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
