import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid submission ID" },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        images: true,
        riceYamPlantainMeta: true,
        kokoMeta: true,
        bankuFufuMeta: true,
        breadMeta: true,
        gob3Meta: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, submission });
  } catch (e: unknown) {
    console.error("Get submission by ID error:", e);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: e instanceof Error ? e.message : "Failed to fetch submission",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid submission ID" },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, submission });
  } catch (e: unknown) {
    console.error("Delete submission error:", e);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: e instanceof Error ? e.message : "Failed to delete submission",
      },
      { status: 500 }
    );
  }
}
