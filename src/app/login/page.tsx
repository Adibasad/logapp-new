"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

      // Handle non-OK responses from the backend
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong!");
      }

      const data = await res.json();
      console.log("User logged in successfully", data);

      // Redirect to homepage after successful login
      router.push("/home");
    } catch (error: unknown) {
      if (error instanceof Error) {
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
    <form onSubmit={handleSubmit}>
      {/* Form fields here */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
