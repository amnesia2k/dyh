/**
 * Tests for generate-token utilities.
 * Testing framework: Jest.
 * - We mock 'jsonwebtoken' and the local './env' module.
 * - We validate call arguments, returns, and error propagation.
 */

import { jest } from "@jest/globals";

// Mock env first so it's picked up by the module under test
jest.unstable_mockModule("../env", () => ({
  env: { JWT_SECRET: "test_secret_value" },
}));

// Mock jsonwebtoken to control sign/verify behavior
const signMock = jest.fn();
const verifyMock = jest.fn();

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: signMock,
    verify: verifyMock,
  },
}));

// Import module under test AFTER mocks
const { generateToken, verifyToken } = await import("../generate-token.js").catch(async () => {
  // Fallback: if implementation file is misnamed as .test.js in the repo (per PR snippet),
  // import from that path. This keeps tests resilient across the diff.
  return await import("../generate-token.test.js");
});

describe("generate-token utils", () => {
  beforeEach(() => {
    signMock.mockReset();
    verifyMock.mockReset();
  });

  describe("generateToken(userId)", () => {
    it("returns the token string from jwt.sign with correct payload and options", () => {
      signMock.mockReturnValue("signed.jwt.token");
      const token = generateToken("user-123");

      expect(token).toBe("signed.jwt.token");
      expect(signMock).toHaveBeenCalledTimes(1);
      expect(signMock).toHaveBeenCalledWith(
        { _id: "user-123", purpose: "authentication" },
        "test_secret_value",
        { expiresIn: "7d" }
      );
    });

    it("passes through undefined userId (edge case) and still calls sign with purpose", () => {
      signMock.mockReturnValue("token-undefined");
      const token = generateToken(undefined);

      expect(token).toBe("token-undefined");
      expect(signMock).toHaveBeenCalledWith(
        { _id: undefined, purpose: "authentication" },
        "test_secret_value",
        { expiresIn: "7d" }
      );
    });

    it("does not mutate the input userId object if an object is provided", () => {
      const userObj = { id: "abc", extra: true };
      signMock.mockReturnValue("obj.token");
      // passing object instead of string – function simply embeds it; we ensure no mutation
      generateToken(userObj);
      expect(userObj).toEqual({ id: "abc", extra: true });
      expect(signMock).toHaveBeenCalledWith(
        { _id: userObj, purpose: "authentication" },
        "test_secret_value",
        { expiresIn: "7d" }
      );
    });

    it("always includes purpose='authentication' and no unexpected options", () => {
      signMock.mockReturnValue("opt.token");
      generateToken("x");
      const call = signMock.mock.calls[0];
      expect(call[0]).toMatchObject({ purpose: "authentication" });
      // Ensure only expected options set
      expect(call[2]).toEqual({ expiresIn: "7d" });
    });

    it("propagates errors thrown by jwt.sign", () => {
      const err = new Error("sign failed");
      signMock.mockImplementation(() => { throw err; });

      expect(() => generateToken("bad")).toThrow(err);
    });
  });

  describe("verifyToken(token)", () => {
    it("returns the decoded payload from jwt.verify", () => {
      const decoded = { _id: "user-123", purpose: "authentication", iat: 1, exp: 2 };
      verifyMock.mockReturnValue(decoded);

      const res = verifyToken("some.token.here");
      expect(res).toBe(decoded);
      expect(verifyMock).toHaveBeenCalledTimes(1);
      expect(verifyMock).toHaveBeenCalledWith("some.token.here", "test_secret_value");
    });

    it("propagates jwt.verify errors (e.g., invalid token)", () => {
      const err = new Error("invalid token");
      verifyMock.mockImplementation(() => { throw err; });

      expect(() => verifyToken("invalid")).toThrow(err);
    });

    it("works with falsy token values by passing through to verify (edge case)", () => {
      verifyMock.mockReturnValue({ ok: true });
      const res = verifyToken("");
      expect(res).toEqual({ ok: true });
      expect(verifyMock).toHaveBeenCalledWith("", "test_secret_value");
    });
  });
});