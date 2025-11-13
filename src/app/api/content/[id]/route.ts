import { NextRequest, NextResponse } from "next/server";
import {
  getContentById,
  updateContent,
  deleteContent,
} from "@/lib/db/content";
import { updateContentSchema } from "@/lib/validators/content";
import { ZodError } from "zod";

// GET /api/content/[id] - Get single content item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const content = await getContentById(id);

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "Content not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch content",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/content/[id] - Update content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateContentSchema.parse(body);

    const content = await updateContent(id, validatedData);

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "Content not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Error updating content:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update content",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/content/[id] - Delete content
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteContent(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Content not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete content",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
