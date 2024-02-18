export default class View {
  constructor() {
    // Templates
    this.contactsTmpl = Handlebars.compile($('#contactsTemplate').html());
    this.contactTmpl = Handlebars.compile($('#contactTemplate').html());
    Handlebars.registerPartial('contactTemplate', $('#contactTemplate').html());
    this.contactFormTmpl = Handlebars.compile($('#contactFormTemplate').html());
    this.noContactsFoundTmpl = Handlebars.compile($('#noContactsFoundTemplate').html());

    // Static Elements
    this.$actionsContainer = $('.actions-container');
    this.$contactsContainer = $('.contacts-container');
  }

  drawContacts(contacts) {
    this.$actionsContainer.css('display', 'flex');
    this.$contactsContainer.html(this.contactsTmpl({ contacts: contacts }));
  }

  drawNoContactsFound(query) {
    this.$contactsContainer.html(this.noContactsFoundTmpl(query));
  }

  drawContactForm(context) {
    if (!context) {
      context = {
        id: '',
        formHeader: 'Create Contact',
        formClass: 'add-form',
        fullName: '',
        email: '',
        phoneNumber: '',
      };
    }

    this.$actionsContainer.css('display', 'none');
    this.$contactsContainer.html(this.contactFormTmpl(context));
  }

  bindFormRequest() {
    $('main').on('click', 'button', event => {
      let $button = $(event.target);

      if ($button.hasClass('add')) {
        this.drawContactForm();
      } else if ($button.hasClass('edit')) {
        let $contact = $button.closest('.contact');

        this.drawContactForm({
          id: $contact.attr('data-id'),
          formHeader: 'Edit Contact',
          formClass: 'edit-form',
          fullName: $contact.find('.contact-name').text(),
          email: $contact.find('.contact-email').text(),
          phoneNumber: $contact.find('.contact-number').text(),
        });
      }
    });
  }

  bindFormCancel(handler) {
    this.$contactsContainer.on('click', 'button.cancel', event => {
      event.preventDefault();
      handler();
    });
  }

  // eslint-disable-next-line max-lines-per-function
  bindAddEditContact(addHandler, editHandler) {
    // eslint-disable-next-line max-lines-per-function
    this.$contactsContainer.on('submit', 'form', event => {
      event.preventDefault();
      let $form = $('form');
      let formData = new FormData($form[0]);

      if ($form.hasClass('add-form')) {
        addHandler({
          full_name: formData.get('full_name'),
          email: formData.get('email'),
          phone_number: formData.get('phone_number'),
          tags: "",
        });
      } else if ($form.hasClass('edit-form')) {
        let contactId = $form.attr('data-id');
        editHandler(contactId, {
          id: contactId,
          full_name: formData.get('full_name'),
          email: formData.get('email'),
          phone_number: formData.get('phone_number'),
          tags: "",
        });
      }
    });
  }

  bindDeleteContact(handler) {
    this.$contactsContainer.on('click', 'button.delete', event => {
      event.preventDefault();
      if (confirm('Are you sure you want to delete this contact?')) {
        let $contact = $(event.target).closest('.contact');
        let contactId = $contact.attr('data-id');
        handler(contactId);
      }
    });
  }

  bindSearchInputChange(handler) {
    let $input = $(this.$actionsContainer.find('input'));
    $input.on('input', _ => {
      let value = $input.val();
      handler(value);
    });
  }
}