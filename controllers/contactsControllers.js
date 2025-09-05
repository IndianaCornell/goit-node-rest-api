import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (_req, res) => {
  const data = await contactsService.listContacts();
  res.status(200).json(data);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);
  if (!contact) return next(HttpError(404, "Not found"));
  res.status(200).json(contact);
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const removed = await contactsService.removeContact(id);
  if (!removed) return next(HttpError(404, "Not found"));
  res.status(200).json(removed);
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const created = await contactsService.addContact(name, email, phone);
  res.status(201).json(created);
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  if (!Object.keys(req.body || {}).length) {
    return next(HttpError(400, "Body must have at least one field"));
  }
  const updated = await contactsService.updateContact(id, req.body);
  if (!updated) return next(HttpError(404, "Not found"));
  res.status(200).json(updated);
};
