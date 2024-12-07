import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt"; // Use bcrypt to hash passwords

interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
}

export async function POST(request: Request) {
  try {
    const { email, password, name }: RegisterRequestBody = await request.json();

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return NextResponse.json(
        { error: "MongoDB URI not defined" },
        { status: 500 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db("test");
    const usersCollection = database.collection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Insert the new user with the hashed password
    const user = await usersCollection.insertOne({
      email,
      password: hashedPassword, // Store the hashed password
      name,
    });

    await client.close();
    return NextResponse.json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Failed to register user:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
