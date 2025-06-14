"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// READ USERS
export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        interview: true,
        _count: {
          select: { feedback: true, interview: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      cacheStrategy: {
        ttl: 60, // Cache is fresh for 60 seconds
        tags: ["users_list"], // Tag for cache invalidation
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

// READ USER BY ID
export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        interview: {
          orderBy: {
            createdAt: "desc",
          },
        },
        feedback: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        _count: {
          select: { interview: true, feedback: true },
        },
      },
      cacheStrategy: {
        ttl: 30, // Fresh for 30 seconds
        swr: 60, // Then stale but acceptable for 60 more seconds
        tags: [`user_${id}`], // User-specific tag
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
}

// CREATE USER (REGISTER)
export async function createUser({
  email,
  name,
  password,
}: {
  email: string;
  name?: string;
  password: string;
}) {
  if (!email || !password) {
    throw new Error("Email / Password are required");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Revalidate the home page to show the new user
    revalidatePath("/");

    return user;
  } catch (error: any) {
    // Handle duplicate email error
    if (error.code === "P2002") {
      throw new Error("A user with this email already exists");
    }
    console.log(error, "this is error here===");
    throw new Error("Failed to create user");
  }
}

