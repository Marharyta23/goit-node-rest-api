import Contact from "../models/contacts.js";

async function writeFile(contact) {
  const newContact = await Contact.create(contact);

  return newContact;
}

async function listContacts() {
  const data = await Contact.find();

  return data;
}

async function getContactById(contactId) {
  const contact = await Contact.findById(contactId);

  if (contact === null) {
    return null;
  }

  return contact;
}

async function removeContact(contactId) {
  const removedContact = await Contact.findByIdAndDelete(contactId);

  return removedContact;
}

async function addContact(createdContact) {
  const newContact = await writeFile(createdContact);

  return newContact;
}

async function changeContact(id, update) {
  const changedContact = await Contact.findByIdAndUpdate(id, update);

  return changedContact;
}

async function updateStatusContact(id, update) {
  const changedContact = await Contact.findByIdAndUpdate(id, update);

  return changedContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  changeContact,
  updateStatusContact,
};
