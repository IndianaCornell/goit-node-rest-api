import { where } from "sequelize";
import Contact from "../db/Contact.js";

export async function updateContact(query, patch) {
  const contact = await getContact(query);
  if (!contact) return null;

  const updated = await contact.update(patch);
  return updated;
}

// SEE ALL CONTACTS
export async function listContacts(query) {
  return await Contact.findAll({ where: query });
}

// GET BY ID
export async function getContact(query) {
  return await Contact.findOne({ where: query });
}

// DELETE CONTACT
export async function removeContact(query) {
  const contact = await getContact(query);

  if (!contact) return null;

  await contact.destroy();
  return contact;
}

// ADD CONTACT
export async function addContact(data) {
  return await Contact.create(data);
}

// ADD TO FAVORITE
export async function updateStatusContact(filter, { favorite }) {
  const contact = await getContact(filter);
  if (!contact) return null;

  contact.favorite = favorite;
  await contact.save();
  return contact;
}

export default {
  listContacts,
  getContact,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
