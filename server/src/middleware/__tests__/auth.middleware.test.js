/**
 * Test framework: Jest (assumed from repository; update if project uses Vitest/Mocha).
 * Subject: protectRoute and adminGuard middleware
 * Focus: Validate behavior across happy paths, edge cases, and failure conditions.
 */

import { jest } from '@jest/globals';

// Under test: adjust import path if implementation is elsewhere.
import * as middleware from '../auth.middleware.js';

// Mocks for external modules used by the middleware
jest.unstable_mockModule('../../utils/generate-token.js', () => ({
  verifyToken: jest.fn(),
}));

jest.unstable_mockModule('../../db/models/hot.model.js', () => {
  return {
    default: {
      // findById returns a query-like object with select() chain per Mongoose pattern
      findById: jest.fn().mockReturnValue({
        select: jest.fn(),
      }),
    },
  };
});

jest.unstable_mockModule('../../utils/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

// Re-import with mocks applied
const { protectRoute, adminGuard } = await import('../auth.middleware.js');
const { verifyToken } = await import('../../utils/generate-token.js');
const Hot = (await import('../../db/models/hot.model.js')).default;
const { logger } = await import('../../utils/logger.js');

function createMockRes() {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
}

function createReq({ cookies, headers, user } = {}) {
  return {
    cookies: cookies ?? {},
    headers: headers ?? {},
    user: user ?? undefined,
  };
}

describe('protectRoute middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 401 when no token is present in cookies or headers', async () => {
    const req = createReq();
    const res = createMockRes();
    const next = jest.fn();

    await protectRoute(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorized: You must be logged in to access this route',
      success: false,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('extracts token from Authorization header "Bearer <token>"', async () => {
    const token = 'abc123';
    const req = createReq({ headers: { authorization: `Bearer ${token}` } });
    const res = createMockRes();
    const next = jest.fn();

    // verifyToken resolves to decoded payload
    verifyToken.mockReturnValue({ _id: 'user1' });

    const userDoc = { _id: 'user1', role: 'user' };
    const selectMock = jest.fn().mockResolvedValue(userDoc);
    Hot.findById.mockReturnValue({ select: selectMock });

    await protectRoute(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith(token);
    expect(Hot.findById).toHaveBeenCalledWith('user1');
    expect(selectMock).toHaveBeenCalledWith('-passwordHash');
    expect(req.user).toEqual(userDoc);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('extracts token from cookies when present', async () => {
    const token = 'cookie-token';
    const req = createReq({ cookies: { token } });
    const res = createMockRes();
    const next = jest.fn();

    verifyToken.mockReturnValue({ _id: 'u2' });
    const selectMock = jest.fn().mockResolvedValue({ _id: 'u2', role: 'user' });
    Hot.findById.mockReturnValue({ select: selectMock });

    await protectRoute(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith(token);
    expect(next).toHaveBeenCalled();
  });

  test('returns 401 when token verification throws (invalid/expired)', async () => {
    const token = 'bad-token';
    const req = createReq({ headers: { authorization: `Bearer ${token}` } });
    const res = createMockRes();
    const next = jest.fn();

    verifyToken.mockImplementation(() => {
      throw new Error('jwt expired');
    });

    await protectRoute(req, res, next);

    expect(logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token', success: false });
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 when user not found for decoded._id', async () => {
    const req = createReq({ headers: { authorization: 'Bearer ok' } });
    const res = createMockRes();
    const next = jest.fn();

    verifyToken.mockReturnValue({ _id: 'missing' });
    const selectMock = jest.fn().mockResolvedValue(null);
    Hot.findById.mockReturnValue({ select: selectMock });

    await protectRoute(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found', success: false });
    expect(next).not.toHaveBeenCalled();
  });

  test('handles unexpected errors and returns 500', async () => {
    const req = createReq({ headers: { authorization: 'Bearer ok' } });
    const res = createMockRes();
    const next = jest.fn();

    verifyToken.mockReturnValue({ _id: 'boom' });
    // Simulate Hot.findById throwing synchronously before await (e.g., misconfigured model)
    Hot.findById.mockImplementation(() => { throw new Error('db down'); });

    await protectRoute(req, res, next);

    expect(logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', success: false });
    expect(next).not.toHaveBeenCalled();
  });

  test('tolerates malformed Authorization header without "Bearer " prefix (treated as no token)', async () => {
    const req = createReq({ headers: { authorization: 'Token something' } });
    const res = createMockRes();
    const next = jest.fn();

    await protectRoute(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('adminGuard middleware', () => {
  test('returns 401 when req.user is missing', () => {
    const req = createReq();
    const res = createMockRes();
    const next = jest.fn();

    adminGuard(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorized: No user context found',
      success: false,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 403 when req.user.role is not admin', () => {
    const req = createReq({ user: { role: 'user' } });
    const res = createMockRes();
    const next = jest.fn();

    adminGuard(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Forbidden: Admins only',
      success: false,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next when req.user.role is admin', () => {
    const req = createReq({ user: { role: 'admin' } });
    const res = createMockRes();
    const next = jest.fn();

    adminGuard(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});