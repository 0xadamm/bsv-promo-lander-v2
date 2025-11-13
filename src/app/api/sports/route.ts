import { NextRequest, NextResponse } from "next/server";
import { listSports, createSport } from "@/lib/db/sports";
import { createSportSchema } from "@/lib/validators/sport";
import { ZodError } from "zod";

// GET /api/sports - List all sports
export async function GET() {
  try {
    const sports = await listSports();

    return NextResponse.json({
      success: true,
      data: sports,
      count: sports.length,
    });
  } catch (error) {
    console.error("Error listing sports:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list sports",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/sports - Create new sport
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createSportSchema.parse(body);

    const sport = await createSport(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: sport,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating sport:", error);

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
        error: "Failed to create sport",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
