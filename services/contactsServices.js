// import fs from "fs/promises";
// import { nanoid } from "nanoid";
// import path from "path";
// import { fileURLToPath } from "url";

import Contact from "../db/Contact.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const contactsPath = path.join(__dirname, "..", "db", "contacts.json");

// const updateContacts = (data) =>
//   fs.writeFile(contactsPath, JSON.stringify(data, null, 2));

// UPDATE BY ID

// export async function updateContact(id, patch) {
//   const data = await listContacts();
//   const idx = data.findIndex((contact) => contact.id === id);
//   if (idx === -1) return null;

//   data[idx] = { ...data[idx], ...patch };
//   await updateContacts(data);
//   return data[idx];
// }

export async function updateContact(id, patch) {
  const contact = await getContactById(id);
  if (!contact) return null;

  const updated = await contact.update(patch);
  return updated;
}

// SEE ALL CONTACTS

// export async function listContacts() {
//   const data = await fs.readFile(contactsPath, "utf-8");
//   return JSON.parse(data);
// }
export async function listContacts() {
  return await Contact.findAll();
}

// GET BY ID

// export async function getContactById(contactId) {
//   const data = await listContacts();
//   const result = data.find((item) => item.id === contactId);
//   return result || null;
// }

export async function getContactById(contactId) {
  return await Contact.findByPk(contactId);
}

// DELET CONTACT

// export async function removeContact(contactId) {
//   const data = await listContacts();
//   const index = data.findIndex((item) => item.id === contactId);
//   if (index === -1) return null;
//   const [result] = data.splice(index, 1);
//   await updateContacts(data);
//   return result;
// }

export async function removeContact(id) {
  const contact = await getContactById(id);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

// ADD CONTACT

// export async function addContact(name, email, phone) {
//   const data = await listContacts();
//   const newContact = {
//     id: nanoid(),
//     name,
//     email,
//     phone,
//   };
//   data.push(newContact);
//   await updateContacts(data);
//   return newContact;
// }

export async function addContact(name, email, phone) {
  return await Contact.create({ name, email, phone });
}

export async function updateStatusContact(contactId, { favorite }) {
  const contact = await getContactById(contactId);
  if (!contact) return null;
  contact.favorite = favorite;
  await contact.save();
  return contact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
