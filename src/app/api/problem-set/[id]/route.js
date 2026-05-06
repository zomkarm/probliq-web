import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import prisma from "@/lib/prisma/client";

export async function GET(req, context) {
  try {
    const user = await getUserFromToken();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const set = await prisma.problemSet.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!set) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(set, { status: 200 });
  } catch (err) {
    console.error("Error fetching problem set:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const user = await getUserFromToken();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nodeId } = await req.json();

    const set = await prisma.problemSet.findUnique({
      where: { id },
    });

    if (!set || set.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const node = (set.nodes || []).find((n) => n.id === nodeId);

    if (!node) {
      return NextResponse.json({ error: "Invalid node" }, { status: 400 });
    }

    if (node.completed) {
      return NextResponse.json(
        { error: "Already completed" },
        { status: 409 } // conflict
      );
    }

    const updatedNodes = set.nodes.map((n) =>
      n.id === nodeId ? { ...n, completed: true } : n
    );

    await prisma.problemSet.update({
      where: { id },
      data: { nodes: updatedNodes },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Progress update error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}