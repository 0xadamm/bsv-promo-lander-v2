import { NextRequest, NextResponse } from "next/server";
import { listContent, createContent } from "@/lib/db/content";
import { createContentSchema } from "@/lib/validators/content";
import { ZodError } from "zod";

// GET /api/content - List content with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = {
      contentType: searchParams.get("contentType") as
        | "testimonial"
        | "raw-footage"
        | "content"
        | undefined,
      sport: searchParams.get("sport") || undefined,
      ailment: searchParams.get("ailment") || undefined,
      featured: searchParams.get("featured")
        ? searchParams.get("featured") === "true"
        : undefined,
      search: searchParams.get("search") || undefined,
      limit: parseInt(searchParams.get("limit") || "50"),
      skip: parseInt(searchParams.get("skip") || "0"),
      sort: searchParams.get("sort") || "-publishedAt",
    };

    const result = await listContent(query);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error listing content:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list content",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/content - Create new content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createContentSchema.parse(body);

    const content = await createContent(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: content,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating content:", error);

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
        error: "Failed to create content",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
