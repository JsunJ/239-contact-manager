export default class Model {
  constructor() {
    this.contacts = [];
    // {
    //   id: 1,
    //   fullName: "Jason Jones",
    //   email: "jasonjones@gmail.com",
    //   phoneNumber: "1234567890",
    //   tags: ["work", "friend"],
    // }
    this.tags = [];
    // ["work", "friend", "Launch School", "TA"]
  }

  async fetchContacts() {
    try {
      let response = await fetch('/api/contacts', { method: 'GET' });
      let data = await response.json();
      this.contacts = data.map(contact => {
        return this._processContact(contact);
      });
    } catch (error) {
      console.log(`Failed to fetch contacts: ${error.message}`);
    }
  }

  async addContact(formData) {
    try {
      let response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(this._processContactForm(formData)),
      });
      let data = await response.json();
      this.contacts.push(this._processContact(data));
    } catch (error) {
      console.log(`Failed to add contact: ${error.message}`);
    }
  }

  // add a helper here
  async editContact(id, formData) {
    try {
      let response = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: (() => {
          let obj = this._processContactForm(formData);
          obj.id = id;
          return JSON.stringify(obj);
        })(),
      });
      if (!response.ok) throw new Error('Bad request / Cannot find contact');

      let data = await response.json();
      this.contacts = this.contacts.map(contact => {
        if (contact.id === data.id) {
          return this._processContact(data);
        } else {
          return contact;
        }
      });
    } catch (error) {
      console.log(`Failed to edit contact: ${error.message}`);
    }
  }

  async deleteContact(id) {
    try {
      let response = await fetch(`/api/contacts/${id}`, { method: 'DELETE'});
      if (!response.ok) throw new Error('Bad request / Cannot find contact');

      this.contacts = this.contacts.filter(contact => {
        return contact.id !== parseInt(id, 10);
      });
    } catch (error) {
      console.log(`Failed to delete contact: ${error.message}`);
    }
  }

  loadTags() {
    let tags = [];
    this.contacts.forEach(contact => {
      tags.push(contact.tags);
    });
    let flatTags = tags.flat();
    this.tags = Array.from(new Set(flatTags));
  }

  getNameMatches(query) {
    return this.contacts.filter(contact => {
      let name = contact.fullName.toLowerCase();
      return name.includes(query.toLowerCase());
    });
  }

  getTagMatches(query) {
    return this.contacts.filter(contact => {
      let tags = contact.tags;
      tags.map(tag => tag.toLowerCase());
      return tags.includes(query.toLowerCase());
    });
  }

  _processContact(contactData) {
    return {
      id: contactData.id,
      fullName: contactData.full_name,
      email: contactData.email,
      phoneNumber: contactData.phone_number,
      tags: contactData.tags ? contactData.tags.split(',') : [],
    };
  }

  _processContactForm(formData) {
    let obj = {
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      phone_number: formData.get('phone_number'),
      tags: formData.getAll('tags').join(','),
    };

    if (formData.get('new_tag')) obj.tags += `,${formData.get('new_tag')}`;

    return obj;
  }
}