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