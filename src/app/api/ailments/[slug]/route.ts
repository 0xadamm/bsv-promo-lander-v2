import { NextRequest, NextResponse } from "next/server";
import {
  getAilmentBySlug,
  updateAilment,
  deleteAilment,
} from "@/lib/db/ailments";
import { updateAilmentSchema } from "@/lib/validators/ailment";
import { ZodError } from "zod";

// GET /api/ailments/[slug] - Get single ailment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const ailment = await getAilmentBySlug(slug);

    if (!ailment) {
      return NextResponse.json(
        {
          success: false,
          error: "Ailment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ailment,
    });
  } catch (error) {
    console.error("Error fetching ailment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch ailment",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/ailments/[slug] - Update ailment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateAilmentSchema.parse(body);

    const ailment = await updateAilment(slug, validatedData);

    if (!ailment) {
      return NextResponse.json(
        {
          success: false,
          error: "Ailment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ailment,
    });
  } catch (error) {
    console.error("Error updating ailment:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update ailment",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/ailments/[slug] - Delete ailment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const deleted = await deleteAilment(slug);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Ailment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ailment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ailment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete ailment",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
