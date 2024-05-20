import contactsServices from "../services/contactsServices.js";
import express from "express";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const router = express.Router();

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsServices.listContacts();
    return res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await contactsServices.getContactById(id);
    if (contact === null) {
      return res.status(404).send({ message: "Not found" });
    }
    return res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await contactsServices.removeContact(id);
    if (contact) {
      return res.status(200).send(contact);
    }
    return res.status(404).send({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const createdContact = req.body;
  try {
    const { error } = createContactSchema.validate(createdContact, {
      abortEarly: false,
    });

    if (typeof error !== "undefined") {
      return res.status(400).send({
        message: `${error.details.map((error) => error.message).join(", ")}`,
      });
    }

    const contact = await contactsServices.addContact(createdContact);

    return res.status(201).send(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;

  const update = req.body;
  try {
    const { error } = updateContactSchema.validate(update, {
      abortEarly: false,
    });

    if (typeof error !== "undefined") {
      return res.status(400).send({
        message: `${error.details.map((error) => error.message).join(", ")}`,
      });
    }

    const contact = await contactsServices.changeContact(id, update);

    if (contact) {
      return res.status(200).send(contact);
    }

    return res.status(404).send({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};

export const updateFavoriteContact = async (req, res, next) => {
  const { id } = req.params;
  const update = req.body;

  try {
    const { error } = updateFavoriteSchema.validate(update, {
      abortEarly: false,
    });

    if (typeof error !== "undefined") {
      return res.status(400).send({
        message: `${error.details.map((error) => error.message).join(", ")}`,
      });
    }

    const contact = await contactsServices.updateStatusContact(id, update);

    if (contact) {
      return res.status(200).send(contact);
    }

    return res.status(404).send({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};
