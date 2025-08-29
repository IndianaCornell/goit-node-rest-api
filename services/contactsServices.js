import fs from "fs/promises";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, "..", "db", "contacts.json");

const updateContacts = (data) =>
  fs.writeFile(contactsPath, JSON.stringify(data, null, 2));

export async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  const data = await listContacts();
  const result = data.find((item) => item.id === contactId);
  return result || null;
}

export async function removeContact(contactId) {
  const data = await listContacts();
  const index = data.findIndex((item) => item.id === contactId);
  if (index === -1) return null;
  const [result] = data.splice(index, 1);
  await updateContacts(data);
  return result;
}

export async function addContact(name, email, phone) {
  const data = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  data.push(newContact);
  await updateContacts(data);
  return newContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
