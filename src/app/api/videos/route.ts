import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { TESTIMONIAL_CONSTANTS } from "@/utils/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    
    console.log("API Route: Fetching videos from Vercel Blob storage for page:", page);

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

    // Transform all videos to our testimonial format first
    const allVideoTestimonials = videoFiles.map((blob, index) => {
      // Extract name from filename
      const filename = blob.pathname.split("/").pop() || "";
      let customerName = `Customer ${index + 1}`;

      // Extract name by removing file extension and cleaning up
      const nameWithoutExtension = filename.replace(/\.(mp4|MP4|webm|mov)$/i, '');
      
      if (nameWithoutExtension) {
        // Handle different naming patterns
        if (nameWithoutExtension.includes("Dr. ")) {
          // "Dr. Shannon Egleston" -> "Dr. Shannon Egleston"
          customerName = nameWithoutExtension;
        } else if (nameWithoutExtension.match(/^\d+\.\s*/)) {
          // "3. Hector Perdomo" -> "Hector Perdomo"
          customerName = nameWithoutExtension.replace(/^\d+\.\s*/, '');
        } else {
          // Simple names like "Kalifa", "Manny", "Kimo 1", etc.
          customerName = nameWithoutExtension;
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

    // Calculate pagination with different distribution
    // Page 1: 3 videos (for 9 text reviews = 3:1 ratio)
    // Page 2+: 4 videos each (for 13 text reviews = ~3:1 ratio) 
    const totalVideos = allVideoTestimonials.length;
    let videosForThisPage, startIndex;
    
    if (page === 1) {
      videosForThisPage = 3;
      startIndex = 0;
    } else {
      videosForThisPage = 4;
      startIndex = 3 + ((page - 2) * 4); // Start after first 3, then 4 per page
    }
    
    const endIndex = startIndex + videosForThisPage;
    const totalPages = Math.ceil((totalVideos - 3) / 4) + 1; // 1 page for first 3, then 4 per page
    
    // Get videos for this page
    const videoTestimonials = allVideoTestimonials.slice(startIndex, endIndex);
    
    const hasNextPage = page < totalPages;

    console.log(`API Route: Returning ${videoTestimonials.length} videos for page ${page}/${totalPages}`);

    return NextResponse.json({
      success: true,
      data: videoTestimonials,
      pagination: {
        page: page,
        per_page: videosForThisPage,
        total: totalVideos,
        total_pages: totalPages,
        has_next_page: hasNextPage,
      },
      count: videoTestimonials.length,
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
