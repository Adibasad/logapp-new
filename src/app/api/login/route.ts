
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const startTime = Date.now(); // Start timer

  try {
    console.log("Request received at:", startTime);

    const { email, password }: LoginRequestBody = await request.json();
    console.log("Parsed request data:", { email });

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("MongoDB URI not defined");
      return NextResponse.json({ error: "MongoDB URI not defined" }, { status: 500 });
    }

    console.log("Connecting to MongoDB...");
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB:", Date.now() - startTime, "ms");

    const database = client.db("test");
    const usersCollection = database.collection("users");

    const user = await usersCollection.findOne({ email });
    console.log("User fetched:", user);

    if (!user) {
      console.error("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password validation complete:", Date.now() - startTime, "ms");

    if (!isPasswordValid) {
      console.error("Invalid password");
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    await client.close();
    console.log("MongoDB connection closed");

    return NextResponse.json({ user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error("Error during login:", error, "at", Date.now() - startTime, "ms");
    return NextResponse.json({ error: "Failed to log in", details: error }, { status: 500 });
  }
}
