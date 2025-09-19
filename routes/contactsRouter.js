import { application, Router } from "express";

import authenticate from "../middlewares/authenticate.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} from "../controllers/contactsControllers.js";

const router = Router();

router.use(authenticate);

router.get("/", getAllContacts);
router.get("/:id", getOneContact);
router.delete("/:id", deleteContact);
router.post("/", validateBody(createContactSchema), createContact);
router.put("/:id", validateBody(updateContactSchema), updateContact);
router.patch(
  "/:id/favorite",
  authenticate,
  validateBody(updateFavoriteSchema),
  updateFavorite
);

export default router;
