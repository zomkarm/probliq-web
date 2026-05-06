import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import prisma from "@/lib/prisma/client";

export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sets = await prisma.problemSet.findMany({
      where: { userId: user.id },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        name: true,
        created_at: true,
      },
    });

    return NextResponse.json(sets, { status: 200 });
  } catch (err) {
    console.error("Error fetching problem sets:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromToken();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, nodes, edges } = body;

    if (!name || !nodes) {
      console.log("BAD pAYLOAD")
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const problemSet = await prisma.problemSet.create({
      data: {
        userId: user.id,
        name,
        nodes,
        edges: edges || [],
      },
    });

    return NextResponse.json(problemSet, { status: 201 });
  } catch (err) {
    console.error("Error creating problem set:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}