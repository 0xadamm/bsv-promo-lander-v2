import { ObjectId } from "mongodb";
import { getSportsCollection } from "../mongodb";
import type { Sport } from "@/types/database";
import type { CreateSportInput, UpdateSportInput } from "../validators/sport";
import slugify from "slugify";

export async function createSport(input: CreateSportInput): Promise<Sport> {
  const collection = await getSportsCollection();

  const now = new Date();
  const sport: Omit<Sport, "_id"> = {
    ...input,
    slug: input.slug || slugify(input.name, { lower: true, strict: true }),
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(sport as Sport);

  return {
    _id: result.insertedId,
    ...sport,
  } as Sport;
}

export async function getSportBySlug(slug: string): Promise<Sport | null> {
  const collection = await getSportsCollection();
  return await collection.findOne({ slug });
}

export async function listSports(): Promise<Sport[]> {
  const collection = await getSportsCollection();
  return await collection.find().sort({ displayOrder: 1, name: 1 }).toArray();
}

export async function updateSport(
  slug: string,
  input: UpdateSportInput
): Promise<Sport | null> {
  const collection = await getSportsCollection();

  const update: any = {
    ...input,
    updatedAt: new Date(),
  };

  // Update slug if name changed
  if (input.name && !input.slug) {
    update.slug = slugify(input.name, { lower: true, strict: true });
  }

  const result = await collection.findOneAndUpdate(
    { slug },
    { $set: update },
    { returnDocument: "after" }
  );

  return result || null;
}

export async function deleteSport(slug: string): Promise<boolean> {
  const collection = await getSportsCollection();
  const result = await collection.deleteOne({ slug });
  return result.deletedCount > 0;
}
