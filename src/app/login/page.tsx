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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong!");
      }

      const data = await res.json();
      console.log("User logged in successfully", data);

      // Store the user data in localStorage or cookies for authentication
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard or home page after successful login
      router.push("/");
    } catch (error: unknown) {
  if (error instanceof Error) {
    setError(error.message || "An unexpected error occurred. Please try again.");
    console.error("Error:", error);
  } else {
    setError("An unknown error occurred. Please try again.");
    console.error("Unexpected error type:", error);
  }
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
