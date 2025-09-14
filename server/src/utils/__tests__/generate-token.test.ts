/**
 * Tests for generate-token utilities.
 * Testing framework: Vitest.
 * - We mock 'jsonwebtoken' and the local './env' module.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock env
vi.mock("../env", () => ({
  env: { JWT_SECRET: "test_secret_value" },
}));

// Mock jsonwebtoken
const signMock = vi.fn();
const verifyMock = vi.fn();

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: signMock,
    verify: verifyMock,
  },
}));

// Import after mocks
let generateToken, verifyToken;
try {
  ({ generateToken, verifyToken } = await import("../generate-token.js"));
} catch {
  ({ generateToken, verifyToken } = await import("../generate-token.test.js"));
}

describe("generate-token utils", () => {
  beforeEach(() => {
    signMock.mockReset();
    verifyMock.mockReset();
  });

  describe("generateToken", () => {
    it("calls jwt.sign with expected payload and options", () => {
      signMock.mockReturnValue("signed.jwt.token");
      const token = generateToken("user-123");
      expect(token).toBe("signed.jwt.token");
      expect(signMock).toHaveBeenCalledWith(
        { _id: "user-123", purpose: "authentication" },
        "test_secret_value",
        { expiresIn: "7d" }
      );
    });

    it("propagates sign errors", () => {
      const err = new Error("sign failed");
      signMock.mockImplementation(() => { throw err; });
      expect(() => generateToken("x")).toThrow(err);
    });
  });

  describe("verifyToken", () => {
    it("returns decoded payload", () => {
      const decoded = { _id: "id" };
      verifyMock.mockReturnValue(decoded);
      expect(verifyToken("tkn")).toBe(decoded);
      expect(verifyMock).toHaveBeenCalledWith("tkn", "test_secret_value");
    });

    it("throws when verify fails", () => {
      const err = new Error("bad");
      verifyMock.mockImplementation(() => { throw err; });
      expect(() => verifyToken("bad")).toThrow(err);
    });
  });
});