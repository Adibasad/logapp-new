"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from './home.module.css';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null); // Store the full user object

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData)); // Parse the user object and set it to state
    } else {
      // Redirect to login page if no user data found
      router.push("/login");
    }
  }, [router]);

  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Top right corner with Login and Sign Up buttons */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        {user ? (
          <>
            <button
              style={{
                padding: "10px 15px",
                borderRadius: "5px",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => router.push("/login")}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              style={{
                padding: "10px 15px",
                borderRadius: "5px",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => router.push("/login")}
            >
              Login
            </button>
            <button
              style={{
                padding: "10px 15px",
                borderRadius: "5px",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => router.push("/register")}
            >
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* Main content in the center */}
      {user && (
        <h2 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
          Welcome, {user.name} {/* Display user's name in center */}
        </h2>
      )}
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
        My Login Application
      </h1>
    </main>
  );
}
