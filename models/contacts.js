const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const contactsPath = path.join(__dirname, "contacts.json");

const writeContacts = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath, "utf-8");

  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();

  const contact = contacts.find(({ id }) => id === contactId);

  return contact || null;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(({ id }) => id === contactId);

  if (contactIndex === -1) {
    return null;
  }

  const [deletedContact] = contacts.splice(contactIndex, 1);

  await writeContacts(contacts);

  return deletedContact;
};

const addContact = async (body) => {
  const contacts = await listContacts();

  const existingContact = contacts.find(
    (contact) => contact.email === body.email
  );

  if (existingContact) {
    throw new Error("Contact with this email already exists");
  }

  const newContact = { id: crypto.randomUUID(), ...body };

  contacts.push(newContact);

  await writeContacts(contacts);

  return newContact;
};

const updateContact = async (contactId, updatedFields) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(({ id }) => id === contactId);

  if (contactIndex === -1) {
    return null;
  }

  const updatedContact = { ...contacts[contactIndex], ...updatedFields };

  contacts[contactIndex] = updatedContact;

  await writeContacts(contacts);

  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
