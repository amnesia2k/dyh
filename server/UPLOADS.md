# Image Uploads and Cloudinary Integration

This backend centralizes all image handling through a single upload endpoint that stores images on Cloudinary and returns a URL. Domain APIs (members, events, announcements, HOT) only ever work with image URLs (`imageUrl`), not raw files.

## 1. Environment Variables

Set these in the server `.env`:

- `CLOUDINARY_CLOUD_NAME` – your Cloudinary cloud name
- `CLOUDINARY_API_KEY` – Cloudinary API key
- `CLOUDINARY_API_SECRET` – Cloudinary API secret
- `CLOUDINARY_FOLDER` – optional folder name (defaults to `dyh`)

They are wired through `server/src/utils/env.js` and used in `server/src/utils/cloudinary.js`.

## 2. Data Model Convention

All models use a single optional string field named `imageUrl`:

- Members: `server/src/db/models/member.model.js`
- Announcements: `server/src/db/models/announcement.model.js`
- Events: `server/src/db/models/event.model.js`
- HOT (Head of Tribe): `server/src/db/models/hot.model.js`

Zod schemas mirror this:

- Member create/update: `imageUrl` in `createMemberSchema` / `updateMemberSchema`
- HOT register/update: `imageUrl` in `registerSchema` / `updateSchema`
- Events/Announcements: you can optionally extend their create/update schemas with `imageUrl` if you want to validate it at the API boundary.

## 3. Cloudinary Utility

`server/src/utils/cloudinary.js`:

- Configures Cloudinary using env vars.
- Exposes:
  - `uploadImageBuffer(buffer)` – uploads an image buffer and resolves with the Cloudinary result (including `secure_url` and `public_id`).
  - `deleteImage(publicId)` – helper to delete an image by public id (used for future cleanup flows).

## 4. Upload Endpoint

Route: `POST /api/v1/upload/image`

- Defined in `server/src/routes/upload.route.js`
- Uses:
  - `upload` middleware from `server/src/middleware/upload.middleware.js` (Multer with in-memory storage).
  - `uploadImage` controller from `server/src/controllers/upload.controller.js`.

### Request

- Method: `POST`
- Path: `/api/v1/upload/image`
- Content-Type: `multipart/form-data`
- Body:
  - Field name: `image`
  - Type: file (binary)

Example (cURL):

```bash
curl -X POST http://localhost:8000/api/v1/upload/image \
  -F "image=@/path/to/file.jpg"
```

### Response

On success (`201`):

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "imageUrl": "https://res.cloudinary.com/.../image/upload/v123/....jpg",
    "publicId": "dyh/abc123",
    "width": 1024,
    "height": 768,
    "format": "jpg"
  }
}
```

On error:

- `400` if no file or invalid file type/size.
- `500` for Cloudinary/other server errors.

## 5. Validation and File Rules

`server/src/middleware/upload.middleware.js`:

- Uses `multer.memoryStorage()` to keep files in memory.
- Limits:
  - Max size: 5 MB
  - Allowed mime types: `image/jpeg`, `image/png`, `image/webp`
- Expects the field name `image`.

If a file is too large or has an invalid type, Multer will throw and the request will fail (you’ll see the error in logs).

## 6. How to Use From Other APIs (Two-Step Flow)

All domain APIs remain JSON-based. The recommended pattern is:

### Step 1: Upload image and get URL

From the client:

1. User selects file in a form (`<input type="file" name="image" />`).
2. Build a `FormData` instance and append the file under `"image"`.
3. `POST` the `FormData` to `/api/v1/upload/image`.
4. Read `data.imageUrl` from the response and store it in your form state.

### Step 2: Call domain endpoint with `imageUrl`

Use the existing JSON endpoints and include `imageUrl` in the body:

- Members:
  - `POST /api/v1/member`
  - `PATCH /api/v1/member/{id}`
  - Body field: `imageUrl?: string`
- HOT:
  - `POST /api/v1/hot/register`
  - `PATCH /api/v1/hot/{id}`
  - Body field: `imageUrl?: string`
- Events:
  - `POST /api/v1/event`
  - `PATCH /api/v1/event/{id}`
  - Body field: `imageUrl?: string`
- Announcements:
  - `POST /api/v1/announcement`
  - `PATCH /api/v1/announcement/{id}`
  - Body field: `imageUrl?: string`

These controllers simply read `imageUrl` from `req.body` and persist it to MongoDB.

## 7. Displaying Images

Once stored, you can render the image anywhere on the client:

```jsx
{
  entity.imageUrl && <img src={entity.imageUrl} alt={entity.title ?? "Image"} />;
}
```

Because the URL is coming from Cloudinary, you can also apply Cloudinary transformations via URL if needed (e.g., resizing, cropping).

## 8. Future Improvements

- Add `imagePublicId` to models that need lifecycle management and call `deleteImage(publicId)` on delete/replace.
- Add signed upload support if you want direct uploads from the browser to Cloudinary without proxying through the backend.
- Extend Zod schemas for events/announcements to validate `imageUrl` if you start requiring it there.
