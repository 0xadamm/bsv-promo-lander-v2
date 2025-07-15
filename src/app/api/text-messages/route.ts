import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    console.log("API Route: Fetching text message screenshots from Vercel Blob storage...");

    // Get images from text-reviews folder
    const { blobs: textMessageBlobs } = await list({ prefix: "text-reviews/" });
    
    // Filter for actual image files (exclude folders)
    const imageFiles = textMessageBlobs.filter(
      (blob) =>
        blob.size > 0 && // Exclude folder entries (size 0)
        (blob.pathname.endsWith(".jpg") ||
          blob.pathname.endsWith(".jpeg") ||
          blob.pathname.endsWith(".JPG") ||
          blob.pathname.endsWith(".JPEG") ||
          blob.pathname.endsWith(".png") ||
          blob.pathname.endsWith(".PNG") ||
          blob.pathname.endsWith(".webp") ||
          blob.pathname.endsWith(".WEBP"))
    );

    console.log("API Route: Found text message image files:", imageFiles.length);

    // Transform to text message format
    const textMessages = imageFiles.map((blob, index) => {
      // Extract name from filename
      const filename = blob.pathname.split("/").pop() || "";
      let customerName = "";
      let altText = `Customer text message testimonial ${index + 1}`;

      // Try to extract customer name from filename patterns
      if (filename.includes("-")) {
        // Format: "customer-name.jpg" or similar
        const parts = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '').split("-");
        
        // Look for a part that looks like a name
        const namePart = parts.find(part => 
          part.length > 1 && 
          !part.match(/^\d+$/) && // not just numbers
          !part.toLowerCase().includes('img') &&
          !part.toLowerCase().includes('screenshot')
        );
        
        if (namePart) {
          customerName = namePart
            .split(/(?=[A-Z])/) // Split on capital letters
            .join(" ")
            .replace(/^\w/, c => c.toUpperCase()); // Capitalize first letter
        }
      }

      return {
        id: `text-message-${index + 1}`,
        image: blob.url,
        customerName: customerName || undefined,
        alt: altText,
        filename: filename,
      };
    });

    return NextResponse.json({
      success: true,
      data: textMessages,
      count: imageFiles.length,
    });
  } catch (error) {
    console.error("Error fetching text message screenshots from Vercel storage:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch text message screenshots",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}