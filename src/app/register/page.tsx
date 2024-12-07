"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // New state for the user's name
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error before new request

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }), // Send name along with email and password
      });

      // Handle non-OK responses from the backend
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong!");
      }

      const data = await res.json();
      console.log("User registered successfully", data);

      // Redirect to login page after successful registration
      router.push("/login");
    } catch (error: any) {
      // Handle both network and custom errors
      setError(error.message || "An unexpected error occurred. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // End loading state after completion
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Sign Up</h2>
        {error && <p className={styles.error}>{error}</p>} {/* Display error message */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
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
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
        
      </form>
    </div>
  );
}
