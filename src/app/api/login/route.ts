
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    console.log("Starting login request...");

    const { email, password }: LoginRequestBody = await request.json();
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.error("MongoDB URI not defined.");
      return NextResponse.json({ error: "MongoDB URI not defined" }, { status: 500 });
    }

    console.log("Connecting to MongoDB...");
    const client = new MongoClient(uri);
    await client.connect();

    const database = client.db("test");
    const usersCollection = database.collection("users");

    console.log("Looking up user...");
    const user = await usersCollection.findOne({ email });

    if (!user) {
      console.error("User not found.");
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    console.log("Comparing passwords...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("Invalid password.");
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    await client.close();

    console.log("Login successful.");
    return NextResponse.json({ user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Failed to log in", details: error }, { status: 500 });
  }
}
