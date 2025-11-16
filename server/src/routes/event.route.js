import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "../controllers/event.controller.js";
import { validateRequest } from "zod-express-middleware";
import { createEventSchema, updateEventSchema } from "../utils/validate-schema.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /event:
 *   get:
 *     summary: Get all events
 *     description: Returns all events, optionally searchable via text search.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search term.
 *     responses:
 *       200:
 *         description: Events fetched successfully.
 */
router.get("/", getEvents);

/**
 * @openapi
 * /event/{id}:
 *   get:
 *     summary: Get a single event
 *     description: Fetch a single event by its ID.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID.
 *     responses:
 *       200:
 *         description: Event fetched successfully.
 *       404:
 *         description: Event not found.
 */
router.get("/:id", getEventById);

/**
 * @openapi
 * /event:
 *   post:
 *     summary: Create a new event
 *     description: Create a new event (protected route).
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
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
 *             required:
 *               - title
 *               - date
 *     responses:
 *       201:
 *         description: Event created successfully.
 */
router.post("/", protectRoute, validateRequest({ body: createEventSchema }), createEvent);

/**
 * @openapi
 * /event/{id}:
 *   patch:
 *     summary: Update an event
 *     description: Update fields of an existing event (protected route).
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
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
router.patch("/:id", protectRoute, validateRequest({ body: updateEventSchema }), updateEvent);

/**
 * @openapi
 * /event/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Delete an event by ID (protected route).
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
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
router.delete("/:id", protectRoute, deleteEvent);

export default router;
