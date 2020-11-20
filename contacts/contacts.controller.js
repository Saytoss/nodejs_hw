const Joi = require("joi");
const contactModel = require("./contacts.model");
const NotFoundError = require("./contacts.error");
const { MongoClient, ObjectID } = require("mongodb");

class ContactsController {
  async listContacts(req, res) {
    const contacts = await contactModel.find();
    res.json(contacts);
  }

  async getById(req, res) {
    const id = req.params.contactId;

    const contact = await contactModel.findById(id);

    if (contact) {
      return res.status(200).json(contact);
    }

    return res.status(404).json({ message: "Not found" });
  }

  async addContact(req, res) {
    const addedContact = await contactModel.create(req.body);
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

  async removeContact(req, res) {
    const id = req.params.contactId;

    const contact = await contactModel.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact is not found" });
    }

    res.status(204).send(contact);
  }

  async updateContact(req, res) {
    const id = req.params.contactId;

    const contact = await contactModel.findByIdAndUpdate(id, {
      $set: req.body,
    });

    if (Object.keys(req.body).length == 0) {
      return res.status(400).json({ message: "missing fields" });
    }

    return res.status(200).json(contact);
  }
}

module.exports = new ContactsController();
