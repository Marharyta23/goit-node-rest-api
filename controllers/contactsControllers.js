import contactsServices from "../services/contactsServices.js";
import express from "express";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
const router = express.Router();

export const getAllContacts = async (req, res) => {
  const contacts = await contactsServices.listContacts();

  return res.status(200).json(contacts);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;

  const contact = await contactsServices.getContactById(id);

  if (contact) {
    return res.status(200).json(contact);
  }

  return res.status(404).json({ message: "Not found" });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsServices.removeContact(id);

  if (contact) {
    return res.status(200).json(contact);
  }
  return res.status(404).json({ message: "Not found" });
};

export const createContact = async (req, res) => {
  const createdContact = req.body;

  const { error } = createContactSchema.validate(createdContact, {
    abortEarly: false,
  });

  if (typeof error !== "undefined") {
    return res
      .status(400)
      .send(error.details.map((error) => error.message).join(", "));
  }

  const contact = await contactsServices.addContact(createdContact);

  return res.status(201).json(contact);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;

  const update = req.body;

  const { error } = updateContactSchema.validate(update, {
    abortEarly: false,
  });

  if (typeof error !== "undefined") {
    return res
      .status(400)
      .send(error.details.map((error) => error.message).join(", "));
  }

  const contact = await contactsServices.changeContact(id, update);

  return res.status(200).json(contact);
};

router.get("/", getAllContacts);
router.get("/:id", getOneContact);
router.delete("/:id", deleteContact);
router.post("/", createContact);
router.put("/:id", updateContact);

export default router;
