import { NextRequest, NextResponse } from "next/server";
import { listAilments, createAilment } from "@/lib/db/ailments";
import { createAilmentSchema } from "@/lib/validators/ailment";
import { ZodError } from "zod";

// GET /api/ailments - List all ailments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");

    // Validate category is one of the allowed values
    const validCategories = ["joint", "muscle", "recovery", "general"] as const;
    const category = categoryParam && validCategories.includes(categoryParam as typeof validCategories[number])
      ? (categoryParam as typeof validCategories[number])
      : undefined;

    const ailments = await listAilments(category);

    return NextResponse.json({
      success: true,
      data: ailments,
      count: ailments.length,
    });
  } catch (error) {
    console.error("Error listing ailments:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list ailments",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/ailments - Create new ailment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createAilmentSchema.parse(body);

    const ailment = await createAilment(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: ailment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ailment:", error);

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
        error: "Failed to create ailment",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
