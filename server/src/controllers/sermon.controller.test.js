/**
 * Unit tests for sermon controller
 *
 * Framework: Vitest
 * - Mocks external dependencies: Sermon model (Mongoose) and logger
 * - Validates: happy paths, validation failures, not-found paths, and error handling
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { createSermon, getSermons, getSermonById, updateSermon, deleteSermon } from "./sermon.controller.js";

// Mock Sermon model and logger (ESM-friendly)
vi.mock("../db/models/sermon.model.js", () => ({
  default: {
    create: vi.fn(),
    find: vi.fn(() => ({ sort: vi.fn() })),
    countDocuments: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

vi.mock("../utils/logger.js", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

import Sermon from "../db/models/sermon.model.js";
import { logger } from "../utils/logger.js";

// Helper to mock Express req/res
const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockReq = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createSermon", () => {
  const validBody = {
    title: "Faith and Works",
    date: "2025-08-03",
    spotifyEmbedUrl: "https://open.spotify.com/embed/episode/abc",
    description: "Exploring the balance of faith and works.",
    speaker: "Jane Doe",
  };

  it("returns 201 and created sermon on success", async () => {
    const created = { _id: "s1", ...validBody };
    Sermon.create.mockResolvedValueOnce(created);

    const req = mockReq({ body: validBody });
    const res = mockRes();

    await createSermon(req, res);

    expect(Sermon.create).toHaveBeenCalledWith(validBody);
    expect(logger.info).toHaveBeenCalledWith("Sermon created:", created._id);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Sermon created",
      success: true,
      data: created,
    });
  });

  it("returns 400 when any required field is missing", async () => {
    const { title, ...missingTitle } = validBody; // remove title
    const req = mockReq({ body: missingTitle });
    const res = mockRes();

    await createSermon(req, res);

    expect(Sermon.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "All fields are required", success: false });
  });

  it("returns 500 on unexpected error and logs it", async () => {
    Sermon.create.mockRejectedValueOnce(new Error("DB down"));

    const req = mockReq({ body: validBody });
    const res = mockRes();

    await createSermon(req, res);

    expect(logger.error).toHaveBeenCalledWith("Error creating sermon:", expect.any(Error));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server error", success: false });
  });
});

describe("getSermons", () => {
  it("fetches all sermons without search; sorts by date desc; includes count", async () => {
    const sermons = [{ _id: "a", date: "2025-08-03" }, { _id: "b", date: "2025-08-01" }];
    const sortMock = vi.fn().mockResolvedValueOnce(sermons);
    Sermon.find.mockReturnValueOnce({ sort: sortMock });
    Sermon.countDocuments.mockResolvedValueOnce(42);

    const req = mockReq({ query: {} });
    const res = mockRes();

    await getSermons(req, res);

    expect(Sermon.find).toHaveBeenCalledWith({});
    expect(sortMock).toHaveBeenCalledWith({ date: -1 });
    expect(Sermon.countDocuments).toHaveBeenCalledWith();
    expect(logger.info).toHaveBeenCalledWith(`Fetched ${sermons.length} sermons`);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Sermons fetched",
      success: true,
      count: 42,
      data: sermons,
    });
  });

  it("applies text search when query.search is provided", async () => {
    const sermons = [{ _id: "s" }];
    const sortMock = vi.fn().mockResolvedValueOnce(sermons);
    Sermon.find.mockReturnValueOnce({ sort: sortMock });
    Sermon.countDocuments.mockResolvedValueOnce(1);

    const req = mockReq({ query: { search: "faith" } });
    const res = mockRes();

    await getSermons(req, res);

    expect(Sermon.find).toHaveBeenCalledWith({ $text: { $search: "faith" } });
    expect(sortMock).toHaveBeenCalledWith({ date: -1 });
    expect(Sermon.countDocuments).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 500 on error and logs", async () => {
    Sermon.find.mockImplementationOnce(() => ({ sort: vi.fn().mockRejectedValueOnce(new Error("boom")) }));

    const req = mockReq({ query: {} });
    const res = mockRes();

    await getSermons(req, res);

    expect(logger.error).toHaveBeenCalledWith("Error fetching sermons:", expect.any(Error));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server error", success: false });
  });
});

describe("getSermonById", () => {
  it("returns 200 with sermon when found", async () => {
    const sermon = { _id: "id1" };
    Sermon.findById.mockResolvedValueOnce(sermon);

    const req = mockReq({ params: { id: "id1" } });
    const res = mockRes();

    await getSermonById(req, res);

    expect(Sermon.findById).toHaveBeenCalledWith("id1");
    expect(logger.info).toHaveBeenCalledWith("Fetched sermon:", "id1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Sermon fetched", success: true, data: sermon });
  });

  it("returns 404 when sermon not found", async () => {
    Sermon.findById.mockResolvedValueOnce(null);

    const req = mockReq({ params: { id: "missing" } });
    const res = mockRes();

    await getSermonById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Sermon not found", success: false });
  });

  it("returns 500 on error", async () => {
    Sermon.findById.mockRejectedValueOnce(new Error("db err"));

    const req = mockReq({ params: { id: "x" } });
    const res = mockRes();

    await getSermonById(req, res);

    expect(logger.error).toHaveBeenCalledWith("Error fetching sermon by id:", expect.any(Error));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server error", success: false });
  });
});

describe("updateSermon", () => {
  it("updates sermon with validators and returns 200 when found", async () => {
    const updated = { _id: "u1", title: "New" };
    Sermon.findByIdAndUpdate.mockResolvedValueOnce(updated);

    const req = mockReq({ params: { id: "u1" }, body: { title: "New" } });
    const res = mockRes();

    await updateSermon(req, res);

    expect(Sermon.findByIdAndUpdate).toHaveBeenCalledWith(
      "u1",
      { $set: { title: "New" } },
      { new: true, runValidators: true }
    );
    expect(logger.info).toHaveBeenCalledWith("Updated sermon:", "u1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Sermon updated", success: true, data: updated });
  });

  it("returns 404 when sermon to update not found", async () => {
    Sermon.findByIdAndUpdate.mockResolvedValueOnce(null);

    const req = mockReq({ params: { id: "nope" }, body: { title: "X" } });
    const res = mockRes();

    await updateSermon(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Sermon not found", success: false });
  });

  it("returns 500 on error", async () => {
    Sermon.findByIdAndUpdate.mockRejectedValueOnce(new Error("bad"));

    const req = mockReq({ params: { id: "e" }, body: { title: "T" } });
    const res = mockRes();

    await updateSermon(req, res);

    expect(logger.error).toHaveBeenCalledWith("Error updating sermon:", expect.any(Error));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server error", success: false });
  });
});

describe("deleteSermon", () => {
  it("deletes sermon and returns 200 when found", async () => {
    const deleted = { _id: "d1" };
    Sermon.findByIdAndDelete.mockResolvedValueOnce(deleted);

    const req = mockReq({ params: { id: "d1" } });
    const res = mockRes();

    await deleteSermon(req, res);

    expect(Sermon.findByIdAndDelete).toHaveBeenCalledWith("d1");
    expect(logger.info).toHaveBeenCalledWith("Deleted sermon:", "d1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Sermon deleted", success: true });
  });

  it("returns 404 when sermon to delete not found", async () => {
    Sermon.findByIdAndDelete.mockResolvedValueOnce(null);

    const req = mockReq({ params: { id: "missing" } });
    const res = mockRes();

    await deleteSermon(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Sermon not found" });
  });

  it("returns 500 on error", async () => {
    Sermon.findByIdAndDelete.mockRejectedValueOnce(new Error("nope"));

    const req = mockReq({ params: { id: "x" } });
    const res = mockRes();

    await deleteSermon(req, res);

    expect(logger.error).toHaveBeenCalledWith("Error deleting sermon:", expect.any(Error));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server error", success: false });
  });
});