import { list } from "@vercel/blob";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function checkBlobInventory() {
  console.log("🔍 Checking Vercel Blob Storage Inventory...\n");

  try {
    // Get ALL blobs (no prefix filter)
    const { blobs: allBlobs } = await list();

    console.log(`📊 Total files found: ${allBlobs.length}\n`);

    // Organize by folder/prefix
    const folderMap: Record<string, typeof allBlobs> = {};

    allBlobs.forEach((blob) => {
      // Extract folder from pathname (e.g., "testimonials/file.mp4" -> "testimonials")
      const parts = blob.pathname.split("/");
      const folder = parts.length > 1 ? parts[0] : "_root";

      if (!folderMap[folder]) {
        folderMap[folder] = [];
      }
      folderMap[folder].push(blob);
    });

    // Print organized inventory
    Object.keys(folderMap)
      .sort()
      .forEach((folder) => {
        const files = folderMap[folder];
        const actualFiles = files.filter((f) => f.size > 0); // Exclude folder entries

        console.log(`\n📁 ${folder}/`);
        console.log(`   Files: ${actualFiles.length}`);

        if (actualFiles.length > 0) {
          // Group by file type
          const videoFiles = actualFiles.filter((f) =>
            /\.(mp4|MP4|webm|mov|MOV)$/i.test(f.pathname)
          );
          const imageFiles = actualFiles.filter((f) =>
            /\.(jpg|jpeg|png|webp|gif|JPG|JPEG|PNG|WEBP|GIF)$/i.test(f.pathname)
          );
          const otherFiles = actualFiles.filter(
            (f) => !videoFiles.includes(f) && !imageFiles.includes(f)
          );

          if (videoFiles.length > 0)
            console.log(`   - Videos: ${videoFiles.length}`);
          if (imageFiles.length > 0)
            console.log(`   - Images: ${imageFiles.length}`);
          if (otherFiles.length > 0)
            console.log(`   - Other: ${otherFiles.length}`);

          // List first 10 files as sample
          console.log(`\n   Sample files:`);
          actualFiles.slice(0, 10).forEach((file) => {
            const filename = file.pathname.split("/").pop();
            const size = (file.size / 1024 / 1024).toFixed(2); // MB
            console.log(`   - ${filename} (${size} MB)`);
          });

          if (actualFiles.length > 10) {
            console.log(`   ... and ${actualFiles.length - 10} more files`);
          }
        }
      });

    // Summary stats
    console.log("\n\n📈 SUMMARY:");
    console.log("=".repeat(50));

    const allActualFiles = allBlobs.filter((f) => f.size > 0);
    const allVideos = allActualFiles.filter((f) =>
      /\.(mp4|MP4|webm|mov|MOV)$/i.test(f.pathname)
    );
    const allImages = allActualFiles.filter((f) =>
      /\.(jpg|jpeg|png|webp|gif|JPG|JPEG|PNG|WEBP|GIF)$/i.test(f.pathname)
    );

    console.log(`Total actual files: ${allActualFiles.length}`);
    console.log(`Total videos: ${allVideos.length}`);
    console.log(`Total images: ${allImages.length}`);
    console.log(`Total folders: ${Object.keys(folderMap).length}`);

    const totalSize = allActualFiles.reduce((sum, f) => sum + f.size, 0);
    console.log(
      `Total storage used: ${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`
    );

    // Export full list to JSON for reference
    const inventory = {
      totalFiles: allActualFiles.length,
      totalVideos: allVideos.length,
      totalImages: allImages.length,
      folders: Object.keys(folderMap).map((folder) => ({
        name: folder,
        fileCount: folderMap[folder].filter((f) => f.size > 0).length,
        files: folderMap[folder]
          .filter((f) => f.size > 0)
          .map((f) => ({
            pathname: f.pathname,
            url: f.url,
            size: f.size,
            uploadedAt: f.uploadedAt,
          })),
      })),
    };

    // Save to file
    const outputPath = path.join(process.cwd(), "blob-inventory.json");
    fs.writeFileSync(outputPath, JSON.stringify(inventory, null, 2));
    console.log(`\n✅ Full inventory saved to: blob-inventory.json`);
  } catch (error) {
    console.error("❌ Error checking blob inventory:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
  }
}

checkBlobInventory();
