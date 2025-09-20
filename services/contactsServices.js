import { where } from "sequelize";
import fs from "node:fs/promises";
import path from "node:path";

import Contact from "../db/Contact.js";

const avatarsDir = path.resolve("public", "avatars");

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

export async function addContact(data, file) {
  let avatarURL = null;
  if (file) {
    const newPath = path.join(avatarsDir, file.filename);
    await fs.rename(file.path, newPath);
    avatarURL = path.join("avatars", file.filename);
  }
  return await Contact.create({ ...data, avatarURL });
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
