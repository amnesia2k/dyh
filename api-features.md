# API Features Overview (`/api/v1`)

This document summarizes the features exposed by the backend API to help guide frontend UX and screen design.

Base URL: `/api/v1`

---

## Common Response Pattern

Unless noted otherwise, JSON responses from the API follow this structure:

```json
{
  "message": "Human-readable status",
  "success": true,
  "data": {}, // object or array, or omitted
  "count": 0 // only for list endpoints
}
```

On errors, `success` is `false`, `message` contains a short explanation, and some endpoints also include an `error` string with technical details.

---

## Authentication & HoT (Head of Tribe)

Base: `/hot`

- `GET /hot/me`
  - Get the currently authenticated HoT profile (from the `token` cookie or `Authorization: Bearer` header).
- `GET /hot`
  - List all HoTs (for directory/list screens or admin views).
- `GET /hot/:id`
  - View single HoT profile details.
- `POST /hot/register`
  - Register a new HoT account (name, email, password, tribe, etc.).
- `POST /hot/login`
  - Log in as HoT (sets `token` cookie for protected routes).
- `POST /hot/logout`
  - Log out current HoT and clear the auth cookie.
- `PATCH /hot/:id`
  - Update HoT details (profile edit forms; protected).
- `DELETE /hot/:id`
  - Delete a HoT (protected, admin-only destructive action).

**HoT object (`Hot`)**

```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "tribe": "string",
  "bio": "string",
  "role": "admin | hot",
  "imageUrl": "string | null",
  "phone": "string",
  "lastLogin": "ISO datetime or null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

When returned from `POST /hot/register` or `POST /hot/login`, the `data` object also includes:

```json
{
  "token": "JWT access token"
}
```

**HoT request bodies**

- `POST /hot/register` body:

  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string (min 8 chars)",
    "tribe": "string",
    "phone": "string",
    "bio": "string (optional)",
    "imageUrl": "string URL (optional)"
  }
  ```

- `POST /hot/login` body:

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- `PATCH /hot/:id` body (all fields optional, any subset):

  ```json
  {
    "name": "string",
    "email": "string",
    "tribe": "string",
    "bio": "string",
    "imageUrl": "string URL",
    "phone": "string",
    "role": "admin | hot"
  }
  ```

**HoT success responses**

- `GET /hot`, `GET /hot/me`, `GET /hot/:id`:

  ```json
  {
    "message": "HOTs fetched successfully",
    "success": true,
    "data": [Hot]
  }
  ```

  ```json
  {
    "message": "HOT fetched successfully",
    "success": true,
    "data": Hot
  }
  ```

- `POST /hot/register`, `POST /hot/login`:

  ```json
  {
    "message": "HOT created successfully",
    "success": true,
    "data": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "tribe": "string",
      "role": "admin | hot",
      "token": "JWT access token",
      "...": "other Hot fields"
    }
  }
  ```

- `POST /hot/logout`:

  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```

- `PATCH /hot/:id`:

  ```json
  {
    "message": "HOT updated successfully",
    "success": true,
    "data": Hot
  }
  ```

- `DELETE /hot/:id`:

  ```json
  {
    "message": "HOT deleted successfully",
    "success": true
  }
  ```

---

## Members

Base: `/member` (most routes require authentication)

- `GET /member`
  - List all members (table/list with filters) — protected.
- `GET /member/:id`
  - View single member profile — protected.
- `POST /member`
  - Create/add a new member (public form, validated via Zod).
- `PATCH /member/:id`
  - Update member details (protected).
- `DELETE /member/:id`
  - Delete a member record (protected).

**Member object (`Member`)**

```json
{
  "_id": "string",
  "fullName": "string",
  "email": "string | null",
  "phone": "string | null",
  "birthday": "ISO date string or null",
  "address": "string | null",
  "departmentOfInterest": "string | null",
  "joinedAt": "ISO date string",
  "imageUrl": "string URL or null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

**Member request bodies**

- `POST /member` body:

  ```json
  {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "birthday": "YYYY-MM-DD",
    "address": "string",
    "departmentOfInterest": "string (optional)",
    "joinedAt": "YYYY-MM-DD (optional)",
    "imageUrl": "string URL (optional)"
  }
  ```

- `PATCH /member/:id` body (all fields optional, any subset):

  ```json
  {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "birthday": "YYYY-MM-DD",
    "address": "string",
    "departmentOfInterest": "string",
    "joinedAt": "YYYY-MM-DD",
    "imageUrl": "string URL"
  }
  ```

**Member success responses**

- `GET /member`:

  ```json
  {
    "message": "Members fetched successfully",
    "success": true,
    "count": 42,
    "data": [Member]
  }
  ```

- `GET /member/:id`:

  ```json
  {
    "message": "Member fetched successfully",
    "success": true,
    "data": Member
  }
  ```

- `POST /member`:

  ```json
  {
    "message": "Member created successfully",
    "success": true,
    "data": Member
  }
  ```

- `PATCH /member/:id`:

  ```json
  {
    "message": "Member updated successfully",
    "success": true,
    "data": Member
  }
  ```

- `DELETE /member/:id`:

  ```json
  {
    "message": "Member deleted successfully",
    "success": true
  }
  ```

---

## Sermons

Base: `/sermon`

- `GET /sermon`
  - List all sermons (for sermon library page). Optional `?search=` full‑text search.
- `GET /sermon/:id`
  - View details of a single sermon (title, speaker, date, media, etc.).
- `POST /sermon`
  - Create a new sermon entry (protected; admin/HOT dashboard form).
- `PATCH /sermon/:id`
  - Edit/update sermon details (protected).
- `DELETE /sermon/:id`
  - Delete a sermon (protected).

**Sermon object (`Sermon`)**

```json
{
  "_id": "string",
  "title": "string",
  "date": "ISO date string",
  "spotifyEmbedUrl": "string URL or null",
  "description": "string | null",
  "speaker": "string | null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

**Sermon request bodies**

- `POST /sermon` body (all fields required in practice):

  ```json
  {
    "title": "string",
    "date": "YYYY-MM-DD",
    "spotifyEmbedUrl": "string URL",
    "description": "string",
    "speaker": "string"
  }
  ```

- `PATCH /sermon/:id` body (all fields optional, any subset):

  ```json
  {
    "title": "string",
    "date": "YYYY-MM-DD",
    "spotifyEmbedUrl": "string URL",
    "description": "string",
    "speaker": "string"
  }
  ```

**Sermon success responses**

- `GET /sermon`:

  ```json
  {
    "message": "Sermons fetched",
    "success": true,
    "count": 10,
    "data": [Sermon]
  }
  ```

  Optional query: `?search=string` for full-text search.

- `GET /sermon/:id`:

  ```json
  {
    "message": "Sermon fetched",
    "success": true,
    "data": Sermon
  }
  ```

- `POST /sermon`:

  ```json
  {
    "message": "Sermon created",
    "success": true,
    "data": Sermon
  }
  ```

- `PATCH /sermon/:id`:

  ```json
  {
    "message": "Sermon updated",
    "success": true,
    "data": Sermon
  }
  ```

- `DELETE /sermon/:id`:

  ```json
  {
    "message": "Sermon deleted",
    "success": true
  }
  ```

---

## Events

Base: `/event`

- `GET /event`
  - List all events (for event list/calendar pages). Optional `?search=` full‑text search.
- `GET /event/:id`
  - View details of a single event (title, date, location, description).
- `POST /event`
  - Create a new event (protected; admin/HOT).
- `PATCH /event/:id`
  - Edit/update event details (protected).
- `DELETE /event/:id`
  - Delete an event (protected).

**Event object (`Event`)**

```json
{
  "_id": "string",
  "title": "string",
  "date": "ISO date string",
  "location": "string | null",
  "description": "string | null",
  "featured": "boolean",
  "imageUrl": "string URL or null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

**Event request bodies**

- `POST /event` body:

  ```json
  {
    "title": "string",
    "date": "YYYY-MM-DD",
    "location": "string (optional)",
    "description": "string (optional)",
    "featured": false,
    "imageUrl": "string URL (optional)"
  }
  ```

- `PATCH /event/:id` body (all fields optional, any subset):

  ```json
  {
    "title": "string",
    "date": "YYYY-MM-DD",
    "location": "string",
    "description": "string",
    "featured": true,
    "imageUrl": "string URL"
  }
  ```

**Event success responses**

- `GET /event`:

  ```json
  {
    "message": "Events fetched",
    "success": true,
    "count": 10,
    "data": [Event]
  }
  ```

  Optional query: `?search=string` for full-text search.

- `GET /event/:id`:

  ```json
  {
    "message": "Event fetched",
    "success": true,
    "data": Event
  }
  ```

- `POST /event`:

  ```json
  {
    "message": "Event created",
    "success": true,
    "data": Event
  }
  ```

- `PATCH /event/:id`:

  ```json
  {
    "message": "Event updated",
    "success": true,
    "data": Event
  }
  ```

- `DELETE /event/:id`:

  ```json
  {
    "message": "Event deleted",
    "success": true
  }
  ```

---

## Announcements

Base: `/announcement`

- `GET /announcement`
  - List all announcements (for bulletin/noticeboard). Optional `?search=`.
- `GET /announcement/:id`
  - View a single announcement (title, date, summary, body).
- `POST /announcement`
  - Create a new announcement (protected; admin/HOT).
- `PATCH /announcement/:id`
  - Edit/update announcement details (protected).
- `DELETE /announcement/:id`
  - Delete an announcement (protected).

**Announcement object (`Announcement`)**

```json
{
  "_id": "string",
  "title": "string",
  "date": "ISO date string",
  "summary": "string | null",
  "body": "string | null",
  "imageUrl": "string URL or null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

**Announcement request bodies**

- `POST /announcement` body:

  ```json
  {
    "title": "string",
    "date": "YYYY-MM-DD",
    "summary": "string (optional)",
    "body": "string (optional)",
    "imageUrl": "string URL (optional)"
  }
  ```

- `PATCH /announcement/:id` body (all fields optional, any subset):

  ```json
  {
    "title": "string",
    "date": "YYYY-MM-DD",
    "summary": "string",
    "body": "string",
    "imageUrl": "string URL"
  }
  ```

**Announcement success responses**

- `GET /announcement`:

  ```json
  {
    "message": "Announcements fetched",
    "success": true,
    "count": 10,
    "data": [Announcement]
  }
  ```

- `GET /announcement/:id`:

  ```json
  {
    "message": "Announcement fetched",
    "success": true,
    "data": Announcement
  }
  ```

- `POST /announcement`:

  ```json
  {
    "message": "Announcement created",
    "success": true,
    "data": Announcement
  }
  ```

- `PATCH /announcement/:id`:

  ```json
  {
    "message": "Announcement updated",
    "success": true,
    "data": Announcement
  }
  ```

- `DELETE /announcement/:id`:

  ```json
  {
    "message": "Announcement deleted",
    "success": true
  }
  ```

---

## Prayer Requests

Base: `/prayer-request`

- `POST /prayer-request`
  - Submit a new prayer request (public-facing form; supports anonymous submissions).
- `GET /prayer-request`
  - List all prayer requests (admin/HOT view — status `new`/`read`/`resolved`).
- `GET /prayer-request/:id`
  - View a single prayer request.
- `PATCH /prayer-request/:id`
  - Update prayer request status or details (e.g., mark as “read”, “resolved”; protected).

**Prayer request object (`PrayerRequest`)**

```json
{
  "_id": "string",
  "fullName": "string | null",
  "email": "string | null",
  "message": "string",
  "anonymous": "boolean",
  "status": "new | read | resolved",
  "resolvedAt": "ISO datetime or null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

**Prayer request bodies**

- `POST /prayer-request` body:

  ```json
  {
    "fullName": "string",
    "email": "string",
    "message": "string",
    "anonymous": false
  }
  ```

  (In practice, `fullName`, `email`, and `message` must all be provided.)

- `PATCH /prayer-request/:id` body (all fields optional, any subset):

  ```json
  {
    "fullName": "string",
    "email": "string",
    "message": "string",
    "anonymous": true,
    "status": "new | read | resolved"
  }
  ```

**Prayer request success responses**

- `GET /prayer-request`:

  ```json
  {
    "message": "Prayer requests fetched successfully",
    "success": true,
    "count": 10,
    "data": [PrayerRequest]
  }
  ```

- `GET /prayer-request/:id`:

  ```json
  {
    "message": "Prayer Request fetched successfully",
    "success": true,
    "data": PrayerRequest
  }
  ```

- `POST /prayer-request`:

  ```json
  {
    "message": "Prayer Request created successfully",
    "success": true,
    "data": PrayerRequest
  }
  ```

- `PATCH /prayer-request/:id`:

  ```json
  {
    "message": "Prayer Request updated successfully",
    "success": true,
    "data": PrayerRequest
  }
  ```

---

## Testimonies

Base: `/testimony`

- `GET /testimony`
  - List all testimonies (for admin approval or testimony pages).
- `GET /testimony/:id`
  - View a single testimony.
- `POST /testimony`
  - Submit a testimony (public-facing or member form).
  - Used to power testimony listing or highlight sections after approval on the admin side.
- `PATCH /testimony/:id`
  - Update testimony status (`new`/`read`/`resolved`), approval, or featured flags (protected).
- `DELETE /testimony/:id`
  - Delete a testimony (protected).

**Testimony object (`Testimony`)**

```json
{
  "_id": "string",
  "fullName": "string | null",
  "email": "string | null",
  "message": "string",
  "anonymous": "boolean",
  "status": "new | read | resolved",
  "featured": "boolean",
  "approved": "boolean",
  "approvedAt": "ISO datetime or null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

**Testimony request bodies**

- `POST /testimony` body:

  ```json
  {
    "fullName": "string",
    "email": "string",
    "message": "string",
    "anonymous": false
  }
  ```

- `PATCH /testimony/:id` body (all fields optional, any subset):

  ```json
  {
    "status": "new | read | resolved",
    "featured": true,
    "approved": true,
    "approvedAt": "YYYY-MM-DD"
  }
  ```

**Testimony success responses**

- `GET /testimony`:

  ```json
  {
    "message": "Testimonies fetched successfully",
    "success": true,
    "count": 10,
    "data": [Testimony]
  }
  ```

- `GET /testimony/:id`:

  ```json
  {
    "message": "Testimony fetched successfully",
    "success": true,
    "data": Testimony
  }
  ```

- `POST /testimony`:

  ```json
  {
    "message": "Testimony created successfully",
    "success": true,
    "data": Testimony
  }
  ```

- `PATCH /testimony/:id`:

  ```json
  {
    "message": "Testimony updated successfully",
    "success": true,
    "data": Testimony
  }
  ```

- `DELETE /testimony/:id`:

  ```json
  {
    "message": "Testimony deleted successfully",
    "success": true
  }
  ```

---

## Image Uploads

Base: `/upload`

- `POST /upload/image`
  - Upload a single image file (as `multipart/form-data` with field name `image`).
  - Stores the image in Cloudinary and returns an `imageUrl` (plus metadata) to use in other JSON APIs.
  - Typical flow: first call this endpoint to get an `imageUrl`, then send that URL in bodies for members, events, announcements, or HoT profile updates.
  - For implementation and environment details, see `server/UPLOADS.md`.

**Upload request**

- `POST /upload/image` body:
  - `Content-Type: multipart/form-data`
  - Field:
    - `image`: binary file (JPEG, PNG, WEBP; max ~5MB)

**Upload success response**

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

---

## Activities

Base: `/activity` (protected)

- `GET /activity`
  - List activities generated by the system (e.g., member registrations, new sermons, events, announcements, prayer requests, testimonies, HoT changes).
  - Each record includes a friendly `message` like:
    - `"John Doe just registered"`,
    - `"New sermon added: Walking by Faith"`,
    - `"Prayer request from Anonymous was updated"`.
  - Use this for an admin “Recent Activity” feed or notifications screen.

**Activity object (`ActivityLog`)**

```json
{
  "_id": "string",
  "action": "string (e.g. MEMBER, EVENT, HOT)",
  "type": "NEW | UPDATED | DELETED",
  "message": "string",
  "meta": {}, // activity-specific payload (e.g. Member, Event)
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

**Activity success response**

- `GET /activity`:

  ```json
  {
    "message": "Activities fetched successfully",
    "success": true,
    "data": [ActivityLog]
  }
  ```

---

## Health Check / Docs

- `GET /api/v1`
  - Simple “Hello World!” health check endpoint.
- `GET /api-docs`
  - Swagger UI documentation for all endpoints (auto-generated from `@openapi` JSDoc comments).

---

### Suggested Screens / UI Areas

- Auth / HoT: Login, Register, Logout, “My Account” (HoT profile).
- HoTs: HoT list, HoT detail, HoT profile editing, admin HoT management.
- Members: Member list, Member detail, Create/Edit member.
- Sermons: Sermon list, Sermon detail, Create/Edit sermon.
- Events: Event calendar/list, Event detail, Create/Edit event.
- Announcements: Announcement list, Announcement detail, Create/Edit announcement.
- Prayer Requests: Public request form, Admin request list, Request detail & status update.
- Testimonies: Testimony submission form, Admin testimony list/approval, Featured testimonies.
- Activity: Admin recent activity feed/log built from `/activity` messages.
