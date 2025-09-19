import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  const { id: owner } = req.user;
  try {
    const data = await contactsService.listContacts({ owner });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id: owner } = req.user;
  const { id } = req.params;
  const contact = await contactsService.getContact({ id, owner });
  if (!contact) return next(HttpError(404, "Not found"));
  res.status(200).json(contact);
};

export const deleteContact = async (req, res, next) => {
  const { id: owner } = req.user;
  const { id } = req.params;
  const removed = await contactsService.removeContact({ id, owner });
  if (!removed) return next(HttpError(404, "Not found"));
  res.status(200).json(removed);
};

export const createContact = async (req, res) => {
  const { id: owner } = req.user;
  const created = await contactsService.addContact({ ...req.body, owner });
  res.status(201).json(created);
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  if (!Object.keys(req.body || {}).length) {
    return next(HttpError(400, "Body must have at least one field"));
  }
  const updated = await contactsService.updateContact({ id, owner }, req.body);
  if (!updated) return next(HttpError(404, "Not found"));
  res.status(200).json(updated);
};

export const updateFavorite = async (req, res, next) => {
  try {
    const ownerId = req.user.id; 
    const contactId = Number(req.params.id); 

    const updated = await contactsService.updateStatusContact(
      { id: contactId, owner: ownerId }, 
      req.body 
    );

    if (!updated) return next(HttpError(404, "Not found"));
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
