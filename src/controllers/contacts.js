import {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
} from '../services/contacts.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { isValidObjectId } from '../validation/validation.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  const { _id: userId } = req.user._id;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = {
    ...parseFilterParams(req.query),
    userId,
  };
  const contacts = await getContacts({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user._id;

  if (!isValidObjectId(contactId)) {
    next(createHttpError(400, 'Invalid contact ID'));
    return;
  }
  const contact = await getContactById({ _id: contactId, userId });
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { _id: userId } = req.user._id;
  const contact = await createContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user._id;
  const contact = await deleteContact({ _id: contactId, userId });
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(204).send();
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user._id;
  const result = await updateContact({ _id: contactId, userId }, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user._id;
  const result = await updateContact(
    { _id: contactId, userId },
    { ...req.body },
    { new: true },
  );

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};