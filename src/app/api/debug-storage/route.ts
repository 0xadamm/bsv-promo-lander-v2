import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    console.log("Debug: Checking Vercel Blob storage...");
    
    // First, let's check if the environment variable is loaded
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    console.log("Debug: BLOB_READ_WRITE_TOKEN exists:", !!blobToken);
    console.log("Debug: BLOB_READ_WRITE_TOKEN length:", blobToken?.length || 0);
    
    // Show all environment variables that start with BLOB
    const blobEnvs = Object.keys(process.env).filter(key => key.includes('BLOB'));
    console.log("Debug: Blob-related env vars:", blobEnvs);

    if (!blobToken) {
      return NextResponse.json({
        success: false,
        error: "BLOB_READ_WRITE_TOKEN not found in environment",
        availableEnvs: blobEnvs,
        allEnvKeys: Object.keys(process.env).filter(key => !key.includes('PASSWORD') && !key.includes('SECRET'))
      });
    }

    // First, let's see what's in the root
    const { blobs: rootBlobs } = await list();
    console.log("Debug: Root blobs:", rootBlobs);

    // Then check the testimonials folder
    const { blobs: testimonialBlobs } = await list({ prefix: 'testimonials/' });
    console.log("Debug: Testimonial blobs:", testimonialBlobs);

    // Also check for any video files anywhere
    const videoFiles = rootBlobs.filter(blob => 
      blob.pathname.endsWith('.mp4') || 
      blob.pathname.endsWith('.webm') || 
      blob.pathname.endsWith('.mov') ||
      blob.pathname.includes('video')
    );

    return NextResponse.json({
      success: true,
      data: {
        totalFiles: rootBlobs.length,
        testimonialFiles: testimonialBlobs.length,
        videoFiles: videoFiles.length,
        allFiles: rootBlobs.map(blob => ({
          pathname: blob.pathname,
          url: blob.url,
          size: blob.size
        })),
        testimonialFiles: testimonialBlobs.map(blob => ({
          pathname: blob.pathname,
          url: blob.url,
          size: blob.size
        })),
        videoFiles: videoFiles.map(blob => ({
          pathname: blob.pathname,
          url: blob.url,
          size: blob.size
        }))
      }
    });
  } catch (error) {
    console.error("Debug: Error accessing Vercel storage:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to access storage",
        message: error instanceof Error ? error.message : "Unknown error",
        details: error
      },
      { status: 500 }
    );
  }
}