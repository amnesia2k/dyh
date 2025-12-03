/**
 * Build a Mongo-style search filter from a request query.
 * Returns `{ $or: [...] }` with case-insensitive regex checks across provided fields,
 * or `null` when no valid `search` term is present.
 */
export function buildSearchFilter(query, fields) {
  const rawSearch = typeof query?.search === "string" ? query.search : "";
  const searchTerm = rawSearch.trim();

  if (!searchTerm) return null;

  const validatedFields = Array.isArray(fields)
    ? fields.filter((field) => typeof field === "string" && field.trim().length > 0)
    : [];

  const searchFields = validatedFields.length > 0 ? validatedFields : ["name", "description"];
  const uniqueFields = Array.from(new Set(searchFields));

  const escaped = escapeRegExp(searchTerm);
  const searchRegex = new RegExp(escaped, "i");

  const orConditions = uniqueFields.map((field) => ({
    [field]: { $regex: searchRegex },
  }));

  return { $or: orConditions };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
