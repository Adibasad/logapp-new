
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { email, password }: LoginRequestBody = await request.json();
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      return NextResponse.json({ error: "MongoDB URI not defined" }, { status: 500 });
    }

    const client = new MongoClient(uri);
    await client.connect();

    const database = client.db("test");
    const usersCollection = database.collection("users");

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    await client.close();

    // Return user info (excluding password) after successful login
    return NextResponse.json({ user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Failed to log in", details: error }, { status: 500 });
  }
}
