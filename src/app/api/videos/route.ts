import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    console.log("API Route: Fetching videos from Vercel Blob storage...");

    // Get videos from both testimonials folders
    const { blobs: testimonialBlobs } = await list({ prefix: "testimonials/" });
    const { blobs: testimonialVideosBlobs } = await list({
      prefix: "testimonial videos/",
    });

    // Combine and filter for actual video files (exclude folders)
    const allBlobs = [...testimonialBlobs, ...testimonialVideosBlobs];
    const videoFiles = allBlobs.filter(
      (blob) =>
        blob.size > 0 && // Exclude folder entries (size 0)
        (blob.pathname.endsWith(".mp4") ||
          blob.pathname.endsWith(".MP4") ||
          blob.pathname.endsWith(".webm") ||
          blob.pathname.endsWith(".mov"))
    );

    console.log("API Route: Found video files:", videoFiles.length);

    // Transform to our video testimonial format
    const videoTestimonials = videoFiles.map((blob, index) => {
      // Extract name from filename
      const filename = blob.pathname.split("/").pop() || "";
      let customerName = `Customer ${index + 1}`;

      // Try to extract name from filename patterns
      if (filename.includes("-story-")) {
        // Format: "brendan-story-xxx.mp4"
        customerName = filename
          .split("-story-")[0]
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      } else if (filename.includes(". ")) {
        // Format: "3. Hector Perdomo-xxx.MP4"
        const namePart = filename.split(". ")[1]?.split("-")[0];
        if (namePart) {
          customerName = namePart;
        }
      }

      return {
        id: `video-${index}`,
        name: customerName,
        avatar: "",
        testimonialText: "",
        date: ["1d", "2d", "3d", "4d", "5d"][index % 5],
        rating: 5,
        title: "",
        verified: true,
        photos: [],
        isVideo: true,
        videoUrl: blob.url,
        thumbnailImage: blob.url, // You might want to generate thumbnails
        duration: "0:30", // You might want to get actual duration
      };
    });

    return NextResponse.json({
      success: true,
      data: videoTestimonials,
      count: videoFiles.length,
    });
  } catch (error) {
    console.error("Error fetching videos from Vercel storage:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch videos",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
