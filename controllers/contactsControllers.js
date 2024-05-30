import mongoose from "mongoose";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import Contact from "../models/contacts.js";

export const getAllContacts = async (req, res, next) => {
  console.log(req.user);
  try {
    const contacts = await Contact.find({ owner: req.user.id });
    return res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ message: "ID is incorrect" });
  }

  try {
    const contact = await Contact.findById(id);

    if (contact === null) {
      return res.status(404).send({ message: "Not found" });
    }

    if (contact.owner.toString() !== req.user.id) {
      return res.status(404).send({ message: "Contact not found" });
    }

    return res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ message: "Not found" });
  }

  try {
    const contact = await Contact.findByIdAndDelete(id);

    if (contact.owner.toString() !== req.user.id) {
      return res.status(404).send({ message: "Contact not found" });
    }

    if (contact) {
      return res.status(200).send(contact);
    }

    return res.status(404).send({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const createdContact = {
    owner: req.user.id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };
  try {
    const { error } = createContactSchema.validate(createdContact, {
      abortEarly: false,
    });

    if (typeof error !== "undefined") {
      return res.status(400).send({
        message: `${error.details.map((error) => error.message).join(", ")}`,
      });
    }

    const contact = await Contact.create(createdContact);

    return res.status(201).send(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const update = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ message: "Not found" });
  }

  try {
    const { error } = updateContactSchema.validate(update, {
      abortEarly: false,
    });

    if (typeof error !== "undefined") {
      return res.status(400).send({
        message: `${error.details.map((error) => error.message).join(", ")}`,
      });
    }

    if (contact.owner.toString() !== req.user.id) {
      return res.status(404).send({ message: "Contact not found" });
    }

    const contact = await Contact.findByIdAndUpdate(id, update);

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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ message: "ID is incorrect" });
  }

  try {
    const { error } = updateFavoriteSchema.validate(update, {
      abortEarly: false,
    });

    if (typeof error !== "undefined") {
      return res.status(400).send({
        message: `${error.details.map((error) => error.message).join(", ")}`,
      });
    }

    if (contact.owner.toString() !== req.user.id) {
      return res.status(404).send({ message: "Contact not found" });
    }

    const contact = await Contact.findByIdAndUpdate(id, update);

    if (contact) {
      return res.status(200).send(contact);
    }

    return res.status(404).send({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};
