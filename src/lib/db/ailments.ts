import { getAilmentsCollection } from "../mongodb";
import type { Ailment } from "@/types/database";
import type { CreateAilmentInput, UpdateAilmentInput } from "../validators/ailment";
import slugify from "slugify";

export async function createAilment(input: CreateAilmentInput): Promise<Ailment> {
  const collection = await getAilmentsCollection();

  const now = new Date();
  const ailment: Omit<Ailment, "_id"> = {
    ...input,
    slug: input.slug || slugify(input.name, { lower: true, strict: true }),
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(ailment as Ailment);

  return {
    _id: result.insertedId,
    ...ailment,
  } as Ailment;
}

export async function getAilmentBySlug(slug: string): Promise<Ailment | null> {
  const collection = await getAilmentsCollection();
  return await collection.findOne({ slug });
}

export async function listAilments(category?: Ailment["category"]): Promise<Ailment[]> {
  const collection = await getAilmentsCollection();

  const filter: Partial<Pick<Ailment, "category">> = category ? { category } : {};

  return await collection.find(filter).sort({ displayOrder: 1, name: 1 }).toArray();
}

export async function updateAilment(
  slug: string,
  input: UpdateAilmentInput
): Promise<Ailment | null> {
  const collection = await getAilmentsCollection();

  const update: Partial<Ailment> & { updatedAt: Date } = {
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

export async function deleteAilment(slug: string): Promise<boolean> {
  const collection = await getAilmentsCollection();
  const result = await collection.deleteOne({ slug });
  return result.deletedCount > 0;
}
