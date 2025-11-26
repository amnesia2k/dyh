import { body } from "express-validator";
import { checkErrors } from "../middleware/checkErrors.js";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const statusValues = ["new", "read", "resolved"];

export const validateRegister = [
  body("name")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),

  body("email")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Password is required")
    .bail()
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("tribe")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Tribe is required")
    .isString()
    .withMessage("Tribe must be a string"),

  body("bio").optional({ checkFalsy: true }).isString().withMessage("Bio must be a string"),

  body("imageUrl").optional({ checkFalsy: true }).isURL().withMessage("Invalid image URL"),

  body("phone").optional({ checkFalsy: true }).isString().withMessage("Phone must be a string"),

  checkErrors,
];

export const validateUpdate = [
  body("name").optional().isString().isLength({ min: 1 }).withMessage("Name is required"),

  body("email").optional().isEmail().withMessage("Invalid email address"),

  body("password")
    .optional()
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("tribe").optional().isString().withMessage("Tribe must be a string"),

  body("bio").optional({ checkFalsy: true }).isString().withMessage("Bio must be a string"),

  body("imageUrl").optional({ checkFalsy: true }).isURL().withMessage("Invalid image URL"),

  body("phone").optional({ checkFalsy: true }).isString().withMessage("Phone must be a string"),

  checkErrors,
];

export const validateLogin = [
  body("email")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Password is required")
    .bail()
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  checkErrors,
];

export const validateCreateMember = [
  body("fullName")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Full name is required")
    .isString()
    .withMessage("Full name must be a string"),

  body("email").optional({ checkFalsy: true }).isEmail().withMessage("Invalid email address"),

  body("phone")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Phone number must be a string"),

  body("birthday")
    .optional({ checkFalsy: true })
    .matches(dateRegex)
    .withMessage("Invalid date format (YYYY-MM-DD)"),

  body("address").optional({ checkFalsy: true }).isString().withMessage("Address must be a string"),

  body("departmentOfInterest")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Department of interest must be a string"),

  body("joinedAt")
    .optional({ checkFalsy: true })
    .matches(dateRegex)
    .withMessage("Invalid date format (YYYY-MM-DD)"),

  body("imageUrl").optional({ checkFalsy: true }).isURL().withMessage("Invalid image URL"),

  checkErrors,
];

export const validateUpdateMember = [
  body("fullName").optional().isString().isLength({ min: 1 }).withMessage("Full name is required"),

  body("email").optional().isEmail().withMessage("Invalid email address"),

  body("phone")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Phone number must be a string"),

  body("birthday")
    .optional({ checkFalsy: true })
    .matches(dateRegex)
    .withMessage("Invalid date format (YYYY-MM-DD)"),

  body("address").optional({ checkFalsy: true }).isString().withMessage("Address must be a string"),

  body("departmentOfInterest")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Department of interest must be a string"),

  body("joinedAt")
    .optional({ checkFalsy: true })
    .matches(dateRegex)
    .withMessage("Invalid date format (YYYY-MM-DD)"),

  body("imageUrl").optional({ checkFalsy: true }).isURL().withMessage("Invalid image URL"),

  checkErrors,
];

export const validateCreateSermon = [
  body("title")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  body("date")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Date is required")
    .bail()
    .matches(dateRegex)
    .withMessage("Invalid date format (YYYY-MM-DD)"),

  body("spotifyEmbedUrl")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Invalid Spotify embed URL"),

  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Description must be a string"),

  body("speaker").optional({ checkFalsy: true }).isString().withMessage("Speaker must be a string"),

  checkErrors,
];

export const validateUpdateSermon = [
  body("title").optional().isString().isLength({ min: 1 }).withMessage("Title is required"),

  body("date").optional().matches(dateRegex).withMessage("Invalid date format (YYYY-MM-DD)"),

  body("spotifyEmbedUrl")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Invalid Spotify embed URL"),

  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Description must be a string"),

  body("speaker").optional({ checkFalsy: true }).isString().withMessage("Speaker must be a string"),

  checkErrors,
];

export const validateCreateEvent = [
  body("title")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  body("date")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Date is required")
    .bail()
    .matches(dateRegex)
    .withMessage("Invalid date format (YYYY-MM-DD)"),

  body("location")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Location must be a string"),

  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Description must be a string"),

  body("featured").optional().isBoolean().withMessage("Featured must be a boolean"),

  body("imageUrl").optional({ checkFalsy: true }).isURL().withMessage("Invalid image URL"),

  checkErrors,
];

export const validateUpdateEvent = [
  body("title").optional().isString().isLength({ min: 1 }).withMessage("Title is required"),

  body("date").optional().matches(dateRegex).withMessage("Invalid date format (YYYY-MM-DD)"),

  body("location")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Location must be a string"),

  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Description must be a string"),

  body("featured").optional().isBoolean().withMessage("Featured must be a boolean"),

  body("imageUrl").optional({ checkFalsy: true }).isURL().withMessage("Invalid image URL"),

  checkErrors,
];

export const validateCreateAnnouncement = [
  body("title")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  body("date")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Date is required")
    .bail()
    .matches(dateRegex)
    .withMessage("Invalid date format (YYYY-MM-DD)"),

  body("summary").optional({ checkFalsy: true }).isString().withMessage("Summary must be a string"),

  body("body").optional({ checkFalsy: true }).isString().withMessage("Body must be a string"),

  body("imageUrl").optional({ checkFalsy: true }).isURL().withMessage("Invalid image URL"),

  checkErrors,
];

export const validateUpdateAnnouncement = [
  body("title").optional().isString().isLength({ min: 1 }).withMessage("Title is required"),

  body("date").optional().matches(dateRegex).withMessage("Invalid date format (YYYY-MM-DD)"),

  body("summary").optional({ checkFalsy: true }).isString().withMessage("Summary must be a string"),

  body("body").optional({ checkFalsy: true }).isString().withMessage("Body must be a string"),

  body("imageUrl").optional({ checkFalsy: true }).isURL().withMessage("Invalid image URL"),

  checkErrors,
];

export const validateCreatePr = [
  body("fullName")
    .if((value, { req }) => !req.body.anonymous)
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Full name is required"),

  body("fullName")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Full name must be a string"),

  body("email")
    .if((value, { req }) => !req.body.anonymous)
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Email is required"),

  body("email").optional({ checkFalsy: true }).isEmail().withMessage("Invalid email address"),

  body("message")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Message is required")
    .bail()
    .isString()
    .withMessage("Message must be a string"),

  body("anonymous").optional().isBoolean().withMessage("Anonymous must be a boolean"),

  body("status")
    .optional({ checkFalsy: true })
    .isIn(statusValues)
    .withMessage("Status must be one of: new, read, resolved"),

  checkErrors,
];

export const validateUpdatePr = [
  body("fullName")
    .if((value, { req }) => !req.body.anonymous)
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Full name is required"),

  body("fullName")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Full name must be a string"),

  body("email")
    .if((value, { req }) => !req.body.anonymous)
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Email is required"),

  body("email").optional({ checkFalsy: true }).isEmail().withMessage("Invalid email address"),

  body("message").optional().isString().isLength({ min: 1 }).withMessage("Message is required"),

  body("anonymous").optional().isBoolean().withMessage("Anonymous must be a boolean"),

  body("status")
    .optional({ checkFalsy: true })
    .isIn(statusValues)
    .withMessage("Status must be one of: new, read, resolved"),

  checkErrors,
];

export const validateCreateTestimony = [
  body("fullName")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Full name is required")
    .isString()
    .withMessage("Full name must be a string"),

  body("email")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email address"),

  body("message")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Message is required")
    .bail()
    .isString()
    .withMessage("Message must be a string"),

  body("anonymous").optional().isBoolean().withMessage("Anonymous must be a boolean"),

  body("status")
    .optional({ checkFalsy: true })
    .isIn(statusValues)
    .withMessage("Status must be one of: new, read, resolved"),

  checkErrors,
];

export const validateUpdateTestimony = [
  body("status")
    .optional({ checkFalsy: true })
    .isIn(statusValues)
    .withMessage("Status must be one of: new, read, resolved"),

  body("featured").optional().isBoolean().withMessage("Featured must be a boolean"),

  body("approved").optional().isBoolean().withMessage("Approved must be a boolean"),

  body("approvedAt")
    .optional({ checkFalsy: true })
    .matches(dateRegex)
    .withMessage("Invalid date format (YYYY-MM-DD)"),

  checkErrors,
];
