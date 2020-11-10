const express = require("express");
const ContactsController = require("./contacts.controller");

const contactsRouter = express.Router();

contactsRouter.post(
  "/",
  ContactsController.validateCreateContact,
  ContactsController.addContact
);

contactsRouter.get("/", ContactsController.listContacts);

contactsRouter.get("/:contactId", ContactsController.getById);

contactsRouter.delete("/:contactId", ContactsController.removeContact);

contactsRouter.patch("/:contactId", ContactsController.updateContact);

module.exports = contactsRouter;
