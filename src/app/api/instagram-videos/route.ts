import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    console.log("API Route: Fetching Instagram videos from Vercel Blob storage...");

    // Get videos from instagram-videos folder
    const { blobs: instagramBlobs } = await list({ prefix: "instagram-videos/" });
    
    // Filter for actual video files (exclude folders)
    const videoFiles = instagramBlobs.filter(
      (blob) =>
        blob.size > 0 && // Exclude folder entries (size 0)
        (blob.pathname.endsWith(".mp4") ||
          blob.pathname.endsWith(".MP4") ||
          blob.pathname.endsWith(".webm") ||
          blob.pathname.endsWith(".mov"))
    );

    console.log("API Route: Found Instagram video files:", videoFiles.length);

    // Transform to Instagram post format
    const instagramPosts = videoFiles.map((blob, index) => {
      // Extract name from filename
      const filename = blob.pathname.split("/").pop() || "";
      let customerName = `Customer ${index + 1}`;
      let altText = `Customer testimonial video ${index + 1}`;
      
      // Try to extract name from filename patterns
      if (filename.includes("-story")) {
        // Format: "brendan-story.mp4" or "brendan-story-xxx.mp4"
        const namePart = filename.split("-story")[0];
        customerName = namePart
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        altText = `${customerName}'s Blue Scorpion pain relief testimonial video`;
      } else if (filename.includes(". ")) {
        // Format: "3. Hector Perdomo-xxx.MP4"
        const namePart = filename.split(". ")[1]?.split("-")[0];
        if (namePart) {
          customerName = namePart;
          altText = `${customerName}'s Blue Scorpion pain relief testimonial video`;
        }
      } else {
        // Use filename without extension as fallback
        customerName = filename
          .replace(/\.(mp4|MP4|webm|mov)$/, "")
          .replace(/[-_]/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        altText = `${customerName}'s Blue Scorpion pain relief testimonial video`;
      }

      return {
        id: `instagram-${index + 1}`,
        image: blob.url, // Video URL used as thumbnail
        url: blob.url,   // Same video URL for playback - this will be detected as .mp4
        alt: altText,
        customerName: customerName, // Additional field for reference
        filename: filename, // Additional field for reference
      };
    });

    return NextResponse.json({
      success: true,
      data: instagramPosts,
      count: videoFiles.length,
    });
  } catch (error) {
    console.error("Error fetching Instagram videos from Vercel storage:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Instagram videos",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}