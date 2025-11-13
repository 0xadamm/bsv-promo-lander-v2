import * as dotenv from "dotenv";
import { getDb, COLLECTIONS } from "../src/lib/mongodb";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function inspectDatabase() {
  console.log("🔍 Inspecting MongoDB Database...\n");

  try {
    const db = await getDb();
    console.log(`✅ Connected to database: ${db.databaseName}\n`);

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("📚 Collections in database:");
    if (collections.length === 0) {
      console.log("  (No collections found - database is empty)\n");
    } else {
      collections.forEach((col) => {
        console.log(`  - ${col.name}`);
      });
      console.log();
    }

    // Check our expected collections
    console.log("📊 Checking expected collections:\n");

    // Content Collection
    const contentCollection = db.collection(COLLECTIONS.CONTENT);
    const contentCount = await contentCollection.countDocuments();
    console.log(`📄 Content Collection (${COLLECTIONS.CONTENT}):`);
    console.log(`   Total documents: ${contentCount}`);

    if (contentCount > 0) {
      // Show first 3 documents
      const sampleContent = await contentCollection.find().limit(3).toArray();
      console.log(`   Sample documents (first 3):`);
      sampleContent.forEach((doc, idx) => {
        console.log(`   ${idx + 1}. ${doc.title || "Untitled"}`);
        console.log(`      - Type: ${doc.contentType}`);
        console.log(`      - Media: ${doc.mediaType}`);
        console.log(`      - Slug: ${doc.slug}`);
        console.log(
          `      - Created: ${doc.createdAt ? new Date(doc.createdAt).toISOString() : "N/A"}`
        );
      });

      // Count by content type
      const testimonials = await contentCollection.countDocuments({
        contentType: "testimonial",
      });
      const rawFootage = await contentCollection.countDocuments({
        contentType: "raw-footage",
      });
      console.log(`   By type:`);
      console.log(`      - Testimonials: ${testimonials}`);
      console.log(`      - Raw Footage: ${rawFootage}`);
    }
    console.log();

    // Sports Collection
    const sportsCollection = db.collection(COLLECTIONS.SPORTS);
    const sportsCount = await sportsCollection.countDocuments();
    console.log(`🏆 Sports Collection (${COLLECTIONS.SPORTS}):`);
    console.log(`   Total documents: ${sportsCount}`);

    if (sportsCount > 0) {
      const sports = await sportsCollection.find().toArray();
      console.log(`   Sports:`);
      sports.forEach((sport) => {
        console.log(`      - ${sport.name} (${sport.slug})`);
      });
    }
    console.log();

    // Ailments Collection
    const ailmentsCollection = db.collection(COLLECTIONS.AILMENTS);
    const ailmentsCount = await ailmentsCollection.countDocuments();
    console.log(`💊 Ailments Collection (${COLLECTIONS.AILMENTS}):`);
    console.log(`   Total documents: ${ailmentsCount}`);

    if (ailmentsCount > 0) {
      const ailments = await ailmentsCollection.find().toArray();
      console.log(`   Ailments:`);
      ailments.forEach((ailment) => {
        console.log(
          `      - ${ailment.name} (${ailment.slug}) [${ailment.category}]`
        );
      });
    }
    console.log();

    // Summary
    console.log("=".repeat(60));
    console.log("📈 SUMMARY");
    console.log("=".repeat(60));
    console.log(`Database: ${db.databaseName}`);
    console.log(`Total Collections: ${collections.length}`);
    console.log(`Content Items: ${contentCount}`);
    console.log(`Sports: ${sportsCount}`);
    console.log(`Ailments: ${ailmentsCount}`);

    if (contentCount === 0 && sportsCount === 0 && ailmentsCount === 0) {
      console.log("\n✨ Database is empty and ready for migration!");
    } else {
      console.log(
        "\n⚠️  Database already contains data. Running migration may create duplicates."
      );
    }

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error inspecting database:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    process.exit(1);
  }
}

// Run inspection
inspectDatabase();
