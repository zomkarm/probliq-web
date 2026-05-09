import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import prisma from "@/lib/prisma/client";


// GET SINGLE PROBLEM SET
export async function GET(req, context) {
  try {
    const user = await getUserFromToken();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const set = await prisma.problemSet.findFirst({
      where: {
        id,
        userId: user.id,
      },

      include: {
        problems: {
          include: {
            solutionPaths: true,
          },
          orderBy: [
            { category: "asc" },
            { orderIndex: "asc" },
          ],
        },
      },
    });

    if (!set) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    //  normalize for frontend (important fix)
    return NextResponse.json({
      id: set.id,
      name: set.name,
      problems: set.problems.map((p) => ({
        id: p.id,
        label: p.label,
        priority: p.priority,
        friction: p.friction,
        category: p.category,
        completed: p.completed,
        plan: p.plan || "",              // STEP 4 SUPPORT
        solutionPaths: p.solutionPaths,
      })),
    });
  } catch (err) {
    console.error("Error fetching problem set:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



// MARK PROBLEM COMPLETE
export async function PATCH(req, context) {
  try {
    const user = await getUserFromToken();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const { problemId, completed, plan } = body;

    if (!problemId) {
      return NextResponse.json(
        { error: "Problem ID required" },
        { status: 400 }
      );
    }

    // verify ownership
    const set = await prisma.problemSet.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!set) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const problem = await prisma.problemNode.findFirst({
      where: {
        id: problemId,
        problemSetId: id,
      },
    });

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    //  UPDATE FIELDS DYNAMICALLY
    const updateData = {};

    if (completed !== undefined) {
      updateData.completed = completed;
    }

    if (plan !== undefined) {
      updateData.plan = plan; // STEP 4
    }

    const updated = await prisma.problemNode.update({
      where: { id: problemId },
      data: updateData,
    });

    return NextResponse.json(updated, { status: 200 });

  } catch (err) {
    console.error("Problem update error:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}