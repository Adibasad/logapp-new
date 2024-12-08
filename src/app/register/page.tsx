"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>(""); // State for the user's name
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Input validation
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    setError(null); // Reset any previous errors

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }), // Send name along with email and password
      });

      // Read the raw response text to handle non-JSON errors gracefully
      const rawResponse = await res.text();
      console.log("Raw Response from backend:", rawResponse);

      if (!res.ok) {
        // Try parsing the response as JSON; fallback to raw response
        let errorData;
        try {
          errorData = JSON.parse(rawResponse);
        } catch (err) {
          throw new Error(rawResponse || "An unexpected error occurred!");
        }
        throw new Error(errorData.error || "Something went wrong!");
      }

      const data = JSON.parse(rawResponse); // Parse JSON response
      console.log("User registered successfully", data);
      // Redirect to login page after successful registration
      router.push("/login");
    } catch (error: unknown) {
      // Safely handle errors and fallback to a generic message
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          className={styles.input}
          disabled={isLoading} // Disable input during loading
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className={styles.input}
          disabled={isLoading} // Disable input during loading
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className={styles.input}
          disabled={isLoading} // Disable input during loading
        />
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
