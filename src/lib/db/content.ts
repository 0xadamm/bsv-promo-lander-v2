import { ObjectId } from "mongodb";
import { getContentCollection } from "../mongodb";
import type { Content, ContentQuery } from "@/types/database";
import type { CreateContentInput, UpdateContentInput } from "../validators/content";
import slugify from "slugify";

export async function createContent(input: CreateContentInput): Promise<Content> {
  const collection = await getContentCollection();

  const now = new Date();
  const content: Omit<Content, "_id"> = {
    ...input,
    slug: input.slug || slugify(input.title, { lower: true, strict: true }),
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(content as Content);

  return {
    _id: result.insertedId,
    ...content,
  } as Content;
}

export async function getContentById(id: string): Promise<Content | null> {
  const collection = await getContentCollection();
  return await collection.findOne({ _id: new ObjectId(id) });
}

export async function getContentBySlug(slug: string): Promise<Content | null> {
  const collection = await getContentCollection();
  return await collection.findOne({ slug });
}

export async function listContent(query: ContentQuery = {}) {
  const collection = await getContentCollection();

  const {
    contentType,
    sport,
    ailment,
    featured,
    search,
    limit = 50,
    skip = 0,
    sort = "-publishedAt",
  } = query;

  // Build filter
  const filter: Record<string, unknown> = {};

  if (contentType) {
    filter.contentType = contentType;
  }

  if (sport) {
    filter.sports = sport;
  }

  if (ailment) {
    filter.ailments = ailment;
  }

  if (featured !== undefined) {
    filter.featured = featured;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Parse sort
  const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
  const sortOrder: 1 | -1 = sort.startsWith("-") ? -1 : 1;
  const sortQuery: { [key: string]: 1 | -1 } = { [sortField]: sortOrder };

  // Execute query
  const total = await collection.countDocuments(filter);
  const items = await collection
    .find(filter)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .toArray();

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  return {
    data: items,
    pagination: {
      page: currentPage,
      per_page: limit,
      total,
      total_pages: totalPages,
      has_next_page: currentPage < totalPages,
    },
    count: items.length,
  };
}

export async function updateContent(
  id: string,
  input: UpdateContentInput
): Promise<Content | null> {
  const collection = await getContentCollection();

  const update: Partial<Content> & { updatedAt: Date } = {
    ...input,
    updatedAt: new Date(),
  };

  // Update slug if title changed
  if (input.title && !input.slug) {
    update.slug = slugify(input.title, { lower: true, strict: true });
  }

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: update },
    { returnDocument: "after" }
  );

  return result || null;
}

export async function deleteContent(id: string): Promise<boolean> {
  const collection = await getContentCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function getAllContent(): Promise<Content[]> {
  const collection = await getContentCollection();
  return await collection.find().toArray();
}
