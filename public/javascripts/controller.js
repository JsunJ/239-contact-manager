export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Page load
    this.model.fetchContacts().then(_ => {
      this.model.loadTags();
      this.view.drawContacts(this.model.contacts);
    });

    //  Bindings
    this.view.bindFormRequest(this.handleFormRequest.bind(this));
    this.view.bindFormCancel(this.handleFormCancel.bind(this));
    this.view.bindAddEditContact(this.handleAddContact.bind(this),
      this.handleEditContact.bind(this));
    this.view.bindDeleteContact(this.handleDeleteContact.bind(this));
    this.view.bindSearchInputChange(this.handleSearchInputChange.bind(this));
    this.view.bindTagClick(this.handleTagClick.bind(this));
    this.view.bindTagFilterReset(this.handleTagFilterReset.bind(this));
  }

  // add a helper here
  handleFormRequest(id) {
    let contact;
    let context;
    let preSelections;

    if (id) {
      contact = this.model.contacts.filter(contact => {
        return contact.id === parseInt(id, 10);
      })[0];

      preSelections = this.model.tags.filter(tag => {
        return contact.tags.indexOf(tag) !== -1;
      });
    }

    context = {
      id: id ? id : '',
      formHeader: id ? 'Edit Contact' : 'Create Contact',
      formClass: id ? 'edit-form' : 'add-form',
      fullName: id ? contact.fullName : '',
      email: id ? contact.email : '',
      phoneNumber: id ? contact.phoneNumber : '',
      tags: this.model.tags,
    };

    this.view.drawContactForm(context, preSelections);
  }

  handleFormCancel() {
    this.view.drawContacts(this.model.contacts);
  }

  handleAddContact(formData) {
    this.model.addContact(formData).then(_ => {
      this.model.loadTags();
      this.view.drawContacts(this.model.contacts);
    });
  }

  handleDeleteContact(id) {
    this.model.deleteContact(id).then(_ => {
      this.model.loadTags();
      this.view.drawContacts(this.model.contacts);
    });
  }

  handleEditContact(id, formData) {
    this.model.editContact(id, formData).then(_ => {
      this.model.loadTags();
      this.view.drawContacts(this.model.contacts);
    });
  }

  handleSearchInputChange(query) {
    if (query.length > 0) {
      let matches = this.model.getNameMatches(query);

      if (matches.length === 0) {
        this.view.drawNoContactsFound(query);
      } else {
        this.view.drawContacts(matches);
      }
    } else {
      this.view.drawContacts(this.model.contacts);
    }
  }

  handleTagClick(query) {
    let matches = this.model.getTagMatches(query);
    this.view.drawTagFilteredContacts(matches, query);
  }

  handleTagFilterReset() {
    this.view.drawContacts(this.model.contacts);
    this.view.bindSearchInputChange(this.handleSearchInputChange.bind(this));
  }
}