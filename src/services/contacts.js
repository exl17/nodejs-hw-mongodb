import { Contact } from '../db/models/contact.js';
import { isValidObjectId } from '../validation/validation.js';

export const getContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};
export const getContactById = async (contactId) => {
  if (!isValidObjectId(contactId)) {
    return;
  } else {
    const contact = await Contact.findById(contactId);
    return contact;
  }
};
export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId });
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};