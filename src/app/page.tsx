"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define User interface for type safety
interface User {
  name: string;
  email: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // Typed state for user

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser: User = JSON.parse(userData); // Ensure parsedUser matches `User` type
        if (parsedUser && parsedUser.name) {
          setUser(parsedUser); // Set the user if valid
        } else {
          console.error("Invalid user data, redirecting to login");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/login");
      }
    } else {
      router.push("/"); // Redirect to home if no user data is found
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/"); // Redirect to home after logout
  };

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
          <button
            style={{
              padding: "10px 15px",
              borderRadius: "5px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
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
      {user ? (
        <h2 style={{ fontSize: "1.5rem" }}>
          Welcome, {user.name}! {/* Display user's name */}
        </h2>
      ) : (
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
          My Login Application
        </h1>
      )}
    </main>
  );
}
