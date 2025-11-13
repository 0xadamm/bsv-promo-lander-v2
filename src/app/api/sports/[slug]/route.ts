import { NextRequest, NextResponse } from "next/server";
import {
  getSportBySlug,
  updateSport,
  deleteSport,
} from "@/lib/db/sports";
import { updateSportSchema } from "@/lib/validators/sport";
import { ZodError } from "zod";

// GET /api/sports/[slug] - Get single sport
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const sport = await getSportBySlug(slug);

    if (!sport) {
      return NextResponse.json(
        {
          success: false,
          error: "Sport not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sport,
    });
  } catch (error) {
    console.error("Error fetching sport:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch sport",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/sports/[slug] - Update sport
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateSportSchema.parse(body);

    const sport = await updateSport(slug, validatedData);

    if (!sport) {
      return NextResponse.json(
        {
          success: false,
          error: "Sport not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sport,
    });
  } catch (error) {
    console.error("Error updating sport:", error);

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
        error: "Failed to update sport",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/sports/[slug] - Delete sport
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const deleted = await deleteSport(slug);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Sport not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sport deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting sport:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete sport",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
