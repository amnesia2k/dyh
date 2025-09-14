/**
 * Tests for PR controller functions.
 * Testing library/framework: Jest (unit tests with manual req/res stubs).
 *
 * We mock:
 * - ../db/models/pr.model.js -> PrayerRequest static methods (create, find, countDocuments, findById, findByIdAndUpdate)
 * - ../utils/logger.js -> logger.info
 *
 * We validate:
 * - createPR: required fields, default 'anonymous', success, internal error
 * - getAllPRs: returns sorted list, count, logs total, internal error
 * - getSinglePR: success, not found, internal error
 * - updatePRStatus: success, not found, validation/internal error
 */

import { createPR, getAllPRs, getSinglePR, updatePRStatus } from "./pr.controller.js";

jest.mock("../db/models/pr.model.js", () => {
  const create = jest.fn();
  const find = jest.fn();
  const countDocuments = jest.fn();
  const findById = jest.fn();
  const findByIdAndUpdate = jest.fn();
  return {
    PrayerRequest: { create, find, countDocuments, findById, findByIdAndUpdate },
  };
});

jest.mock("../utils/logger.js", () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
}));

import { PrayerRequest } from "../db/models/pr.model.js";
import { logger } from "../utils/logger.js";

// Simple helpers to create mock req/res
const createRes = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
};

const createReq = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  ...overrides,
});

describe("PR Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPR", () => {
    it("returns 400 when required fields are missing", async () => {
      const res = createRes();

      await createPR(createReq({ body: { email: "a@b.com", message: "msg" } }), res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Full name, email, and message are required.",
        success: false,
      });

      jest.clearAllMocks();

      await createPR(createReq({ body: { fullName: "John", message: "msg" } }), res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Full name, email, and message are required.",
        success: false,
      });

      jest.clearAllMocks();

      await createPR(createReq({ body: { fullName: "John", email: "a@b.com" } }), res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Full name, email, and message are required.",
        success: false,
      });
    });

    it("creates a Prayer Request with anonymous defaulting to false and returns 201", async () => {
      const res = createRes();
      const prDoc = { _id: "1", fullName: "Jane", email: "j@e.com", message: "Pray", anonymous: false };
      PrayerRequest.create.mockResolvedValue(prDoc);

      await createPR(
        createReq({ body: { fullName: "Jane", email: "j@e.com", message: "Pray" } }),
        res
      );

      expect(PrayerRequest.create).toHaveBeenCalledWith({
        fullName: "Jane",
        email: "j@e.com",
        message: "Pray",
        anonymous: false,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Prayer Request created successfully",
        success: true,
        data: prDoc,
      });
    });

    it("creates a Prayer Request honoring provided anonymous flag", async () => {
      const res = createRes();
      const prDoc = { _id: "2", fullName: "Doe", email: "d@e.com", message: "Thanks", anonymous: true };
      PrayerRequest.create.mockResolvedValue(prDoc);

      await createPR(
        createReq({ body: { fullName: "Doe", email: "d@e.com", message: "Thanks", anonymous: true } }),
        res
      );

      expect(PrayerRequest.create).toHaveBeenCalledWith({
        fullName: "Doe",
        email: "d@e.com",
        message: "Thanks",
        anonymous: true,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Prayer Request created successfully",
        success: true,
        data: prDoc,
      });
    });

    it("returns 500 when model.create throws", async () => {
      const res = createRes();
      PrayerRequest.create.mockRejectedValue(new Error("DB down"));

      await createPR(
        createReq({ body: { fullName: "Jane", email: "j@e.com", message: "Pray" } }),
        res
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Failed to create Prayer Request",
          error: "DB down",
        })
      );
    });
  });

  describe("getAllPRs", () => {
    it("returns 200 with list sorted desc by createdAt and logs total", async () => {
      const res = createRes();
      const data = [
        { _id: "b", createdAt: new Date("2023-02-02") },
        { _id: "a", createdAt: new Date("2023-01-01") },
      ];

      const sortFn = jest.fn().mockResolvedValue(data);
      PrayerRequest.find.mockReturnValue({ sort: sortFn });
      PrayerRequest.countDocuments.mockResolvedValue(2);

      await getAllPRs(createReq(), res);

      expect(PrayerRequest.find).toHaveBeenCalledTimes(1);
      expect(sortFn).toHaveBeenCalledWith({ createdAt: -1 });
      expect(PrayerRequest.countDocuments).toHaveBeenCalledTimes(1);
      expect(logger.info).toHaveBeenCalledWith("Total Prayer Requests: 2");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Prayer requests fetched successfully",
        success: true,
        count: 2,
        data,
      });
    });

    it("returns 500 when any model call throws", async () => {
      const res = createRes();
      const sortFn = jest.fn().mockRejectedValue(new Error("Query failed"));
      PrayerRequest.find.mockReturnValue({ sort: sortFn });

      await getAllPRs(createReq(), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Failed to get Prayer Requests",
          error: "Query failed",
        })
      );
    });
  });

  describe("getSinglePR", () => {
    it("returns 200 and the document when found", async () => {
      const res = createRes();
      const doc = { _id: "xyz", message: "Hi" };
      PrayerRequest.findById.mockResolvedValue(doc);

      await getSinglePR(createReq({ params: { id: "xyz" } }), res);

      expect(PrayerRequest.findById).toHaveBeenCalledWith("xyz");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Prayer Request fetched successfully",
        success: true,
        data: doc,
      });
    });

    it("returns 404 when not found", async () => {
      const res = createRes();
      PrayerRequest.findById.mockResolvedValue(null);

      await getSinglePR(createReq({ params: { id: "nope" } }), res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Prayer request not found",
        success: false,
      });
    });

    it("returns 500 on internal error", async () => {
      const res = createRes();
      PrayerRequest.findById.mockRejectedValue(new Error("lookup failed"));

      await getSinglePR(createReq({ params: { id: "err" } }), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Failed to get Prayer Request",
          error: "lookup failed",
        })
      );
    });
  });

  describe("updatePRStatus", () => {
    it("updates request and returns 200 with updated doc", async () => {
      const res = createRes();
      const updated = { _id: "1", status: "closed" };
      PrayerRequest.findByIdAndUpdate.mockResolvedValue(updated);

      const body = { status: "closed" };
      await updatePRStatus(createReq({ params: { id: "1" }, body }), res);

      expect(PrayerRequest.findByIdAndUpdate).toHaveBeenCalledWith("1", body, {
        new: true,
        runValidators: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Prayer Request updated successfully",
        success: true,
        data: updated,
      });
    });

    it("returns 404 when document to update does not exist", async () => {
      const res = createRes();
      PrayerRequest.findByIdAndUpdate.mockResolvedValue(null);

      await updatePRStatus(createReq({ params: { id: "missing" }, body: { status: "open" } }), res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Prayer request not found",
        success: false,
      });
    });

    it("returns 500 when update throws (e.g., validation error)", async () => {
      const res = createRes();
      PrayerRequest.findByIdAndUpdate.mockRejectedValue(new Error("Validation error"));

      await updatePRStatus(createReq({ params: { id: "1" }, body: { status: "???invalid" } }), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Failed to update Prayer Request",
          error: "Validation error",
        })
      );
    });
  });
});