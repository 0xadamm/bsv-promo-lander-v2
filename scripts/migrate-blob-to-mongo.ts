// Load environment variables FIRST before any other imports
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { list } from "@vercel/blob";
import { createContent } from "../src/lib/db/content";
import { createIndexes } from "../src/lib/mongodb";
import slugify from "slugify";

function extractNameFromFilename(filename: string): string {
  // Remove file extension
  const name = filename.replace(/\.(mp4|MP4|webm|mov|MOV|jpg|jpeg|png|PNG|JPEG|JPG)$/i, "");

  // Handle different patterns
  if (name.includes("Dr. ")) {
    // "Dr. Shannon Egleston" -> "Dr. Shannon Egleston"
    return name;
  } else if (name.match(/^\d+\.\s*/)) {
    // "3. Hector Perdomo" -> "Hector Perdomo"
    return name.replace(/^\d+\.\s*/, "");
  } else if (name.includes("-story")) {
    // "brendan-story" -> "Brendan"
    const namePart = name.split("-story")[0];
    return namePart
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } else if (name.includes("-")) {
    // "customer-name" -> "Customer Name"
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } else {
    // "Kalifa", "Manny", "Kimo 1" -> as is
    return name;
  }
}

function determineMediaType(pathname: string): "image" | "video" {
  if (/\.(mp4|MP4|webm|mov|MOV)$/i.test(pathname)) {
    return "video";
  }
  return "image";
}

function determineSource(pathname: string): string {
  if (pathname.startsWith("instagram-videos/")) {
    return "instagram";
  } else if (pathname.startsWith("dominate-media/")) {
    return "marketing";
  } else if (pathname.startsWith("testimonials/")) {
    return "customer-testimonial";
  } else if (pathname.startsWith("text-reviews/")) {
    return "text-message";
  }
  return "vercel-blob";
}

async function migrateContent() {
  console.log("🚀 Starting migration of Vercel Blob content to MongoDB...\n");

  try {
    // Create indexes first
    console.log("📊 Creating database indexes...");
    await createIndexes();

    // Get all blobs
    console.log("\n📦 Fetching all files from Vercel Blob...");
    const { blobs: allBlobs } = await list();

    // Filter for actual files (exclude folders)
    const actualFiles = allBlobs.filter((blob) => blob.size > 0);
    console.log(`Found ${actualFiles.length} files to migrate\n`);

    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ file: string; error: string }> = [];

    for (const blob of actualFiles) {
      const filename = blob.pathname.split("/").pop() || "";
      const name = extractNameFromFilename(filename);
      const mediaType = determineMediaType(blob.pathname);
      const source = determineSource(blob.pathname);

      console.log(`Processing: ${blob.pathname}`);
      console.log(`  Name: ${name}`);
      console.log(`  Media Type: ${mediaType}`);
      console.log(`  Source: ${source}`);

      try {
        await createContent({
          slug: slugify(name + "-" + Date.now(), { lower: true, strict: true }),
          title: name,
          description: "", // Will be filled in later through admin
          contentType: "testimonial", // All existing content is testimonials
          mediaType: mediaType,
          mediaUrls: [blob.url],
          thumbnailUrl: blob.url, // For videos, this will need proper thumbnails later
          sports: [], // Will be tagged later through admin
          ailments: [], // Will be tagged later through admin
          source: source,
          published: true,
          featured: false,
          priority: 0,
          publishedAt: new Date(blob.uploadedAt),
        });

        console.log(`  ✅ Migrated successfully\n`);
        successCount++;
      } catch (error) {
        console.log(`  ❌ Failed to migrate`);
        console.error(`  Error: ${error}\n`);
        errorCount++;
        errors.push({
          file: blob.pathname,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📈 MIGRATION SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ Successfully migrated: ${successCount} files`);
    console.log(`❌ Failed: ${errorCount} files`);
    console.log(`📊 Total processed: ${actualFiles.length} files\n`);

    if (errors.length > 0) {
      console.log("⚠️  Errors encountered:");
      errors.forEach((err) => {
        console.log(`  - ${err.file}: ${err.error}`);
      });
    }

    console.log("\n✨ Migration complete!");
    console.log("\nNext steps:");
    console.log("1. Use the admin interface to add descriptions");
    console.log("2. Tag content with sports and ailments");
    console.log("3. Mark featured content");
    console.log("4. Generate proper thumbnails for videos");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  }
}

// Run migration
migrateContent();
