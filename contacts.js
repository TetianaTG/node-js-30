const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "db", "contacts.json");

class Contact {
  constructor({ name, email, phone }, id) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
}

const listContacts = async () => {
  const contacts = await fs
    .readFile(contactsPath, "utf-8")
    .then((res) => {
      console.log("\x1B[32m Contacts have been received! \x1b[0m");
      console.table(JSON.parse(res));
      return JSON.parse(res);
    })
    .catch((error) => {
      throw error;
    });

  return contacts;
};

const getContactById = async (contactId) => {
  const allContacts = await listContacts();
  const foundContact = allContacts.find((contact) => contact.id === contactId);

  console.log(
    foundContact
      ? `\x1B[32m Contact (${foundContact.name}) found! \x1b[0m `
      : `\x1B[31m Contact not found! \x1b[0m`,
    foundContact ? foundContact : ""
  );

  return allContacts.find((contact) => contact.id === contactId);
};

const removeContact = async (contactId) => {
  const allContacts = await listContacts();
  const foundContact = allContacts.find((contact) => contact.id === contactId);

  if (foundContact) {
    const newListContacts = await allContacts.filter(
      (contact) => contact.id !== contactId
    );
    await fs
      .writeFile(contactsPath, JSON.stringify(newListContacts))
      .then(() =>
        console.log(`\x1B[34m File with ID - ${contactId} - removed! \x1b[0m`)
      )
      .catch((error) => {
        throw error;
      });
  } else console.log(`\x1B[31m Contact not found! \x1b[0m`);
};

const addContact = async (name, email, phone) => {
  const allContacts = await listContacts();
  const newId = [...allContacts].pop().id + 1;
  const createdContact = new Contact({ name, email, phone }, newId);
  allContacts.push(createdContact);
  await fs
    .writeFile(contactsPath, JSON.stringify(allContacts))
    .then(() =>
      console.log(`\x1B[32m Added contact ${name}! \x1b[0m`, createdContact)
    )
    .catch((error) => {
      throw error;
    });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};