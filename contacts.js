const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

function listContacts() {
  fs.readFile(contactsPath, "utf-8", (err, contacts) => {
    if (err) console.log(err);
    console.table(JSON.parse(contacts));
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, "utf-8", (err, contacts) => {
    if (err) console.log(err);
    const contactByID = JSON.parse(contacts).find(
      (contact) => contact.id === contactId
    );
    console.log(contactByID);
  });
}
function removeContact(contactId) {
  fs.readFile(contactsPath, "utf-8", (err, contacts) => {
    if (err) console.log(err);
    const newContactsList = JSON.parse(contacts).filter(
      (contact) => contact.id !== contactId
    );
    fs.writeFile(contactsPath, JSON.stringify(newContactsList), (err) => {
      if (err) console.log(err);
      console.table(newContactsList);
    });
  });
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath, "utf-8", (err, contacts) => {
    if (err) console.log(err);
    const currentContactsList = JSON.parse(contacts);
    const newContactsList = [
      ...currentContactsList,
      {
        id: uniqid(),
        name,
        email,
        phone,
      },
    ];
    fs.writeFile(contactsPath, JSON.stringify(newContactsList), (err) => {
      if (err) console.log(err);
      console.table(newContactsList);
    });
  });
}

module.exports = { listContacts, getContactById, removeContact, addContact };
