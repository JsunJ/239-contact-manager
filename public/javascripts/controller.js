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
    this.view.bindFormRequest();
    this.view.bindFormCancel(this.handleFormCancel.bind(this));
    this.view.bindAddEditContact(this.handleAddContact.bind(this),
      this.handleEditContact.bind(this));
    this.view.bindDeleteContact(this.handleDeleteContact.bind(this));
    this.view.bindSearchInputChange(this.handleSearchInputChange.bind(this));
  }

  handleFormCancel() {
    this.view.drawContacts(this.model.contacts);
  }

  handleAddContact(contactObj) {
    this.model.addContact(contactObj).then(_ => {
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

  handleEditContact(id, contactObj) {
    this.model.editContact(id, contactObj).then(_ => {
      this.model.loadTags();
      this.view.drawContacts(this.model.contacts);
    });
  }

  handleSearchInputChange(query) {
    if (query.length > 0) {
      let matches = this.model.getMatches(query);

      if (matches.length === 0) {
        this.view.drawNoContactsFound(query);
      } else {
        this.view.drawContacts(this.model.getMatches(query));
      }
    } else {
      this.view.drawContacts(this.model.contacts);
    }
  }
}