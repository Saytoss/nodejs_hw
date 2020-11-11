const Joi = require("joi");
const contacts = require("../db/contacts.json");
const NotFoundError = require("./contacts.error");

class ContactsController {
  get removeContact() {
    return this._removeContact.bind(this);
  }
  get updateContact() {
    return this._updateContact.bind(this);
  }
  listContacts(req, res) {
    res.json(contacts);
  }
  getById(req, res) {
    const id = req.params.contactId;

    const targetContactId = contacts.find((contact) => contact.id == id);

    if (targetContactId) {
      return res.status(200).json(targetContactId);
    }

    return res.status(404).json({ message: "Not found" });
  }
  addContact(req, res) {
    const addedContact = {
      ...req.body,
      id: contacts.length + 1,
    };
    contacts.push(addedContact);
    return res.status(201).json(addedContact);
  }
  validateCreateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const validationResult = createContactRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).json({ message: "missing required name field" });
    }

    next();
  }

  async _removeContact(req, res, next) {
    try {
      const targetContactIndex = this.findContactIndexById(
        res,
        req.params.contactId
      );

      contacts.splice(targetContactIndex, 1);

      return res.status(200).json({ message: "contact deleted" });
    } catch (err) {
      next(err);
    }
  }

  async _updateContact(req, res, next) {
    try {
      const targetContactIndex = this.findContactIndexById(
        res,
        req.params.contactId
      );

      if (Object.keys(req.body).length == 0) {
        return res.status(400).json({ message: "missing fields" });
      }
      contacts[targetContactIndex] = {
        ...contacts[targetContactIndex],
        ...req.body,
      };
      const targetContactId = contacts.find(
        (contact) => contact.id == req.params.contactId
      );
      return res.status(200).json(targetContactId);
    } catch (err) {
      next(err);
    }
  }

  findContactIndexById(res, contactId) {
    const id = parseInt(contactId);
    const targetContactIndex = contacts.findIndex(
      (contact) => contact.id === id
    );
    if (targetContactIndex === -1) {
      throw new NotFoundError();
    }

    return targetContactIndex;
  }
}

module.exports = new ContactsController();
