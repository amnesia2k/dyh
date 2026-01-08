import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "../controllers/event.controller.js";
import { verifyAdminToken, verifyHotToken, verifyToken } from "../middleware/auth.middleware.js";
import { validateCreateEvent, validateUpdateEvent } from "../utils/validate-schema.js";

const router = Router();

/**
 * @openapi
 * /event:
 *   get:
 *     summary: Get all events
 *     description: Returns all events, optionally searchable via text search (requires authenticated role: past-hot, hot, or admin).
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search term.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Events fetched successfully.
 */
router.use(verifyToken);

router.get("/", getEvents);

/**
 * @openapi
 * /event/{id}:
 *   get:
 *     summary: Get a single event
 *     description: Fetch a single event by its ID (requires authenticated role: past-hot, hot, or admin).
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Event fetched successfully.
 *       404:
 *         description: Event not found.
 */
router.get("/:id", getEventById);

router.use(verifyHotToken);

/**
 * @openapi
 * /event:
 *   post:
 *     summary: Create a new event
 *     description: Create a new event (HOT or admin).
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               featured:
 *                 type: boolean
 *               imageUrl:
 *                 type: string
 *                 description: URL to event image.
 *             required:
 *               - title
 *               - date
 *     responses:
 *       201:
 *         description: Event created successfully.
 */
router.post("/", validateCreateEvent, createEvent);

/**
 * @openapi
 * /event/{id}:
 *   patch:
 *     summary: Update an event
 *     description: Update fields of an existing event (HOT or admin).
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EventUpdate"
 *     responses:
 *       200:
 *         description: Event updated successfully.
 *       404:
 *         description: Event not found.
 */
router.patch("/:id", validateUpdateEvent, updateEvent);

router.use(verifyAdminToken);

/**
 * @openapi
 * /event/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Delete an event by ID (admin only).
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID.
 *     responses:
 *       200:
 *         description: Event deleted successfully.
 *       404:
 *         description: Event not found.
 */
router.delete("/:id", deleteEvent);

export default router;
