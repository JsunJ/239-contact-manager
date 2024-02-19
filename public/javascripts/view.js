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

    if ($('.clear-filter')[0]) {
      $('.clear-filter').replaceWith(
        '<input type="text" class="actions-search" placeholder="Search">');
    }

    this.$contactsContainer.html(this.contactsTmpl({ contacts: contacts }));
  }

  drawTagFilteredContacts(contacts) {
    $('.actions-search').replaceWith(
      '<button class="btn actions-btn-lg clear-filter">*Clear Tag Filtering*</button>');

    this.$contactsContainer.html(this.contactsTmpl({ contacts: contacts }));
  }

  drawNoContactsFound(query) {
    this.$contactsContainer.html(this.noContactsFoundTmpl(query));
  }

  drawContactForm(context, preSelections) {
    this.$actionsContainer.css('display', 'none');
    this.$contactsContainer.html(this.contactFormTmpl(context));

    if (preSelections) {
      preSelections.forEach(option => {
        $(`option[value="${option}"]`).prop('selected', true);
      });
    }
  }

  bindFormRequest(handler) {
    $('main').on('click', 'button', event => {
      let $button = $(event.target);

      if ($button.hasClass('add')) {
        handler();
      } else if ($button.hasClass('edit')) {
        let $contact = $button.closest('.contact');
        let id = $contact.attr('data-id');

        handler(id);
      }
    });
  }

  bindFormCancel(handler) {
    this.$contactsContainer.on('click', 'button.cancel', event => {
      event.preventDefault();
      handler();
    });
  }

  bindAddEditContact(addHandler, editHandler) {
    this.$contactsContainer.on('submit', 'form', event => {
      event.preventDefault();
      let $form = $('form');
      let formData = new FormData($form[0]);

      if ($form.hasClass('add-form')) {
        addHandler(formData);
      } else if ($form.hasClass('edit-form')) {
        let contactId = $form.attr('data-id');
        editHandler(contactId, formData);
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

  bindTagClick(handler) {
    this.$contactsContainer.on('click', 'p.contact-tag', event => {
      let tagQuery = $(event.target).text();
      handler(tagQuery);
    });
  }

  bindTagFilterReset(handler) {
    this.$actionsContainer.on('click', 'button.clear-filter', event => {
      event.preventDefault();
      handler();
    });
  }
}