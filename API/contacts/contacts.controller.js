
const Joi = require('@hapi/joi');
const isEmpty = require('lodash.isempty');
const contactsModel = require('./contacts.model');
const val = require('../validation/validation');

class ContactsController {
  validateAddContact(req, res, next) {
    const schema = Joi.object(val.postValidation);
    const validation = schema.validate(req.body);

    if (validation.error) return handleValidationError(res, validation);

    next();
  }



  validateAddContact(req, res, next) {
    const schema = Joi.object(postValidation);
    const validation = schema.validate(req.body);

    if (validation.error) return handleValidationError(res, validation);

    next();
  }

  validateUpdateContact(req, res, next) {
    const schema = Joi.object(patchValidation);
    const validation = schema.validate(req.body);

    if (validation.error) return handleValidationError(res, validation);

    next();
  }

  // GET
  async getContacts(req, res) {
    try {
      const { page, limit, sub: subscription } = req.query;
      let options = { page, limit };
      let contacts;
      if (!page && !limit) options = null;
      const res = await contactsModel.paginate({}, options);
      if (subscription) {
        const contactsBySubs = res.docs.filter(
            contact => contact.subscription === subscription,
        );
        contacts = contactsBySubs;
      } else {
        contacts = res.docs;
      }
      res.status(200).send(contacts);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  async getContact(req, res) {
    try {
      const { contactid } = req.params;
      const contact = await contactsModel.findById(contactid);

      res.status(200).send(contact);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
  // POST
  async _addContact(req, res) {
    try {
      const newContact = { ...req.body };
      const existedContact = await contactsModel.findOne({
        email: newContact.email,
      });

      const contact = await contactsModel.create(newContact);
      res.status(200).send(`Contact ${contact.name} created`);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  // DELETE
  async _removeContact(req, res) {
    try {
      const {contactid} = req.params;
      await contactsModel.findByIdAndRemove(contactid);
      res.status(200).send('Contact deleted');
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
  // PATCH
  async _updateContact(req, res) {
    try {
      const { contactid } = req.params;
      const updatedContact = { ...req.body };

      if (isEmpty(req.body)) return res.status(404).send('missing fields');

      const newContact = await contactsModel.findByIdAndUpdate(
          contactid,
          updatedContact,
          { new: true },
      );

      res.status(200).send(newContact);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
}

function handleValidationError(res, val) {
  return res.status(400).send(val.error.message);
}
module.exports = new ContactsController();