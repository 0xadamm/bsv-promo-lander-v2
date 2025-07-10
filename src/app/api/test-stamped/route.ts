import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing Stamped.io API connection...");

    const storeHash = process.env.STAMPED_STORE_HASH || "288102";
    const username =
      process.env.STAMPED_USERNAME || "dd1a92af-eee0-4adf-93c4-753b07b35efe";
    const password =
      process.env.STAMPED_PASSWORD ||
      "51664fd6bcc3c6b5ca6a7f7593ce5fea0002084643ea29b0b3a50bfd6c77c0da";

    const credentials = Buffer.from(`${username}:${password}`).toString(
      "base64"
    );
    const url = `https://stamped.io/api/v2/${storeHash}/dashboard/reviews`;

    console.log("Test API: Making request to:", url);
    console.log(
      "Test API: Using credentials:",
      username.substring(0, 8) + "..."
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    console.log("Test API: Response status:", response.status);
    console.log(
      "Test API: Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Test API: Error response:", errorText);
      return NextResponse.json(
        {
          success: false,
          error: `HTTP ${response.status}`,
          message: errorText,
          url: url,
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Test API: Success! Raw response:", data);

    return NextResponse.json({
      success: true,
      message: "API connection successful",
      dataStructure: {
        keys: Object.keys(data),
        reviewCount: Array.isArray(data.data)
          ? data.data.length
          : "data is not an array",
        firstReview:
          Array.isArray(data.data) && data.data.length > 0
            ? data.data[0]
            : null,
      },
      rawData: data,
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Connection failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
