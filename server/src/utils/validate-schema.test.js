/**
 * Tests for server/src/utils/validate-schema.{js,ts}
 *
 * Detected testing library/framework: Jest/Vitest style (describe/it/expect).
 * These tests only rely on standard BDD-style globals.
 *
 * Notes:
 * - We import Zod schemas from validate-schema module.
 * - Where partial() schemas are used, tests verify both happy paths and failure cases.
 * - For optional-or-empty-string fields, tests cover "", undefined, valid, and invalid inputs.
 * - If the module uses ESM, dynamic import path resolution is attempted; for CJS we fallback to require.
 */
 
const path = require('path');
const fs = require('fs');
 
async function loadSchemas() {
  // Resolve candidate module files by common extensions
  const candidates = [
    'server/src/utils/validate-schema.ts',
    'server/src/utils/validate-schema.js',
    'server/src/utils/validate-schema.mjs',
    'server/src/utils/validate-schema.cjs',
    // Some repos place schemas under server/utils:
    'server/utils/validate-schema.ts',
    'server/utils/validate-schema.js',
    'server/utils/validate-schema.mjs',
    'server/utils/validate-schema.cjs'
  ];
 
  for (const rel of candidates) {
    const p = path.resolve(process.cwd(), rel);
    if (fs.existsSync(p)) {
      // Try ESM dynamic import first if .mjs or if package type:module
      const ext = path.extname(p);
      try {
        if (ext === '.mjs') {
          return await import(p);
        }
        // Attempt dynamic import; if it fails, fall back to require
        return await import(pathToFileUrl(p));
      } catch (e) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          return require(p);
        } catch (e2) {
          // Re-throw original error; tests will surface module import problems (e.g., invalid zod usage).
          throw e;
        }
      }
    }
  }
  throw new Error('validate-schema module not found in expected locations.');
}
 
// Helper to convert file path to file URL for dynamic import in Node
function pathToFileUrl(p) {
  const { pathToFileURL } = require('url');
  return pathToFileURL(p).href;
}
 
describe('validate-schema module', () => {
  let schemas;
 
  beforeAll(async () => {
    schemas = await loadSchemas();
  });
 
  it('exports expected schemas', () => {
    const expectedExports = [
      'registerSchema',
      'updateSchema',
      'loginSchema',
      'createMemberSchema',
      'updateMemberSchema',
      'createSermonSchema',
      'updateSermonSchema',
      'createPrSchema',
      'updatePrSchema',
    ];
    for (const k of expectedExports) {
      expect(schemas).toHaveProperty(k);
    }
  });
});
 
describe('Auth schemas', () => {
  let {
    registerSchema,
    updateSchema,
    loginSchema,
  } = {};
 
  beforeAll(async () => {
    const s = await loadSchemas();
    registerSchema = s.registerSchema;
    updateSchema = s.updateSchema;
    loginSchema = s.loginSchema;
  });
 
  describe('registerSchema', () => {
    it('accepts a valid registration payload (happy path)', () => {
      const payload = {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'supersecret',
        tribe: 'Choir',
        bio: 'Singer',
        photo: 'https://cdn.example.com/p/alice.jpg',
        phone: '1234567890',
      };
      const res = registerSchema.safeParse(payload);
      expect(res.success).toBe(true);
      if (!res.success) {
        console.error(res.error.format());
      }
    });
 
    it('rejects missing required fields with descriptive messages', () => {
      const payload = {
        // name missing
        email: 'alice@example.com',
        password: 'supersecret',
        // tribe missing
      };
      const res = registerSchema.safeParse(payload);
      expect(res.success).toBe(false);
      if (!res.success) {
        const fmt = res.error.format();
        expect(((fmt.name && fmt.name._errors) || [])).toContain('Name is required');
        expect(((fmt.tribe && fmt.tribe._errors) || [])).toContain('Tribe is required');
      }
    });
 
    it('rejects invalid email', () => {
      const res = registerSchema.safeParse({
        name: 'Bob',
        email: 'not-an-email',
        password: 'supersecret',
        tribe: 'Media',
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        const errs = res.error.issues.map(i => i.message);
        expect(errs.join(' ')).toMatch(/Invalid email address|Invalid email/i);
      }
    });
 
    it('rejects password shorter than 8 characters', () => {
      const res = registerSchema.safeParse({
        name: 'Bob',
        email: 'bob@example.com',
        password: 'short',
        tribe: 'Ushering',
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        const errs = res.error.issues.map(i => i.message);
        expect(errs).toContain('Password must be at least 8 characters');
      }
    });
 
    it('rejects invalid photo url when provided', () => {
      const res = registerSchema.safeParse({
        name: 'Carol',
        email: 'carol@example.com',
        password: 'supersecret',
        tribe: 'Tech',
        photo: 'not-a-url',
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        const errs = res.error.issues.map(i => i.message);
        expect(errs.join(' ')).toMatch(/Invalid.*URL/i);
      }
    });
 
    it('rejects non-string phone when provided', () => {
      const res = registerSchema.safeParse({
        name: 'D',
        email: 'd@example.com',
        password: 'supersecret',
        tribe: 'Welfare',
        phone: 12345,
      });
      expect(res.success).toBe(false);
    });
 
    it('allows optional fields to be omitted', () => {
      const res = registerSchema.safeParse({
        name: 'Eve',
        email: 'eve@example.com',
        password: 'supersecret',
        tribe: 'Prayer',
      });
      expect(res.success).toBe(true);
    });
  });
 
  describe('updateSchema (partial register)', () => {
    it('accepts an empty object', () => {
      const res = updateSchema.safeParse({});
      expect(res.success).toBe(true);
    });
 
    it('accepts updating a subset of fields', () => {
      const res = updateSchema.safeParse({
        bio: 'Updated bio',
        photo: 'https://example.com/x.png',
      });
      expect(res.success).toBe(true);
    });
 
    it('still validates provided fields and rejects invalid values', () => {
      const res = updateSchema.safeParse({
        email: 'nope',
        photo: 'still-not-a-url',
      });
      expect(res.success).toBe(false);
    });
  });
 
  describe('loginSchema', () => {
    it('accepts valid login payload', () => {
      const res = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'longenough',
      });
      expect(res.success).toBe(true);
    });
 
    it('rejects invalid email and short password', () => {
      const res = loginSchema.safeParse({
        email: 'not-email',
        password: 'short',
      });
      expect(res.success).toBe(false);
    });
  });
});
 
describe('Member schemas', () => {
  let {
    createMemberSchema,
    updateMemberSchema,
  } = {};
 
  beforeAll(async () => {
    const s = await loadSchemas();
    createMemberSchema = s.createMemberSchema;
    updateMemberSchema = s.updateMemberSchema;
  });
 
  describe('createMemberSchema', () => {
    it('accepts happy path with optional empties', () => {
      const res = createMemberSchema.safeParse({
        fullName: 'John Doe',
        email: '',
        phone: '',
        birthday: '',
        address: '',
        departmentOfInterest: '',
        joinedAt: '',
        photo: '',
      });
      expect(res.success).toBe(true);
    });
 
    it('accepts full valid payload with formats satisfied', () => {
      const res = createMemberSchema.safeParse({
        fullName: 'Jane Roe',
        email: 'jane.roe@example.com',
        phone: '555-0000',
        birthday: '1990-01-31',
        address: '123 Main St',
        departmentOfInterest: 'Choir',
        joinedAt: '2024-06-15',
        photo: 'https://cdn.example.org/p/jane.png',
      });
      expect(res.success).toBe(true);
    });
 
    it('rejects missing fullName', () => {
      const res = createMemberSchema.safeParse({
        // fullName missing
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        const fmt = res.error.format();
        expect(((fmt.fullName && fmt.fullName._errors) || [])).toContain('Full name is required');
      }
    });
 
    it('rejects invalid email when provided', () => {
      const res = createMemberSchema.safeParse({
        fullName: 'X',
        email: 'nope',
      });
      expect(res.success).toBe(false);
    });
 
    it('rejects invalid birthday format when provided', () => {
      const res = createMemberSchema.safeParse({
        fullName: 'Y',
        birthday: '01-31-1990',
      });
      expect(res.success).toBe(false);
    });
 
    it('rejects invalid joinedAt format when provided', () => {
      const res = createMemberSchema.safeParse({
        fullName: 'Z',
        joinedAt: '15/06/2024',
      });
      expect(res.success).toBe(false);
    });
 
    it('rejects invalid photo URL when provided', () => {
      const res = createMemberSchema.safeParse({
        fullName: 'W',
        photo: 'not-a-url',
      });
      expect(res.success).toBe(false);
    });
  });
 
  describe('updateMemberSchema (partial)', () => {
    it('accepts empty update', () => {
      const res = updateMemberSchema.safeParse({});
      expect(res.success).toBe(true);
    });
 
    it('validates provided fields', () => {
      const res = updateMemberSchema.safeParse({
        birthday: '1990/01/31',
        email: 'invalid',
        photo: 'bad-url',
      });
      expect(res.success).toBe(false);
    });
  });
});
 
describe('Sermon schemas', () => {
  let {
    createSermonSchema,
    updateSermonSchema,
  } = {};
 
  beforeAll(async () => {
    const s = await loadSchemas();
    createSermonSchema = s.createSermonSchema;
    updateSermonSchema = s.updateSermonSchema;
  });
 
  describe('createSermonSchema', () => {
    it('accepts minimal valid payload', () => {
      const res = createSermonSchema.safeParse({
        title: 'Walking in Faith',
        date: '2025-01-05',
      });
      expect(res.success).toBe(true);
    });
 
    it('rejects missing title and invalid date', () => {
      const res = createSermonSchema.safeParse({
        title: '',
        date: '05-01-2025',
      });
      expect(res.success).toBe(false);
    });
 
    it('accepts optional fields including empty strings', () => {
      const res = createSermonSchema.safeParse({
        title: 'Test',
        date: '2024-12-24',
        spotifyEmbedUrl: '',
        description: '',
        speaker: '',
      });
      expect(res.success).toBe(true);
    });
 
    it('rejects invalid spotifyEmbedUrl when provided', () => {
      const res = createSermonSchema.safeParse({
        title: 'With URL',
        date: '2024-12-24',
        spotifyEmbedUrl: 'not-a-url',
      });
      expect(res.success).toBe(false);
    });
  });
 
  describe('updateSermonSchema (partial)', () => {
    it('accepts empty update', () => {
      const res = updateSermonSchema.safeParse({});
      expect(res.success).toBe(true);
    });
 
    it('validates provided fields', () => {
      const res = updateSermonSchema.safeParse({
        title: '',
        date: 'not-a-date',
        spotifyEmbedUrl: 'bad',
      });
      expect(res.success).toBe(false);
    });
  });
});
 
describe('Prayer (PR) schemas', () => {
  let {
    createPrSchema,
    updatePrSchema,
  } = {};
 
  beforeAll(async () => {
    const s = await loadSchemas();
    createPrSchema = s.createPrSchema;
    updatePrSchema = s.updatePrSchema;
  });
 
  describe('createPrSchema', () => {
    it('accepts valid payload with optional fields', () => {
      const res = createPrSchema.safeParse({
        fullName: 'Alpha',
        email: 'alpha@example.com',
        message: 'Please pray for...',
        anonymous: true,
        status: 'new',
      });
      expect(res.success).toBe(true);
    });
 
    it('rejects missing requireds and invalid enums', () => {
      const res = createPrSchema.safeParse({
        fullName: '',
        email: 'not-email',
        message: '',
        status: 'unknown',
      });
      expect(res.success).toBe(false);
    });
 
    it('allows status to be any of the defined enum values', () => {
      for (const status of ['new', 'read', 'resolved']) {
        const res = createPrSchema.safeParse({
          fullName: 'Beta',
          email: 'beta@example.com',
          message: 'Thanks',
          status,
        });
        expect(res.success).toBe(true);
      }
    });
  });
 
  describe('updatePrSchema (partial)', () => {
    it('accepts empty update', () => {
      const res = updatePrSchema.safeParse({});
      expect(res.success).toBe(true);
    });
 
    it('validates provided fields', () => {
      const res = updatePrSchema.safeParse({
        email: 'bad',
        status: 'nope',
      });
      expect(res.success).toBe(false);
    });
  });
});