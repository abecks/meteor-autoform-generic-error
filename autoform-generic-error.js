'use strict';

var _formErrors = {};
var _formErrorDeps = {};

/**
 * Sets an error on a given form.
 * @param {String} formId
 * @param {String} error
 */
AutoForm.setFormError = function afSetFormError(formId, error) {
  // Create an array to hold the errors for this form
  if (!_formErrors[formId]) {
    _formErrors[formId] = [];
  }

  // Construct a normalized error object
  if (_.isString(error)) {
    error = {
      message: error
    };
  }else if(error.reason){
    error.message = error.reason;
  }

  // Add error to the list of errors for this form
  _formErrors[formId].push(error);

  // Trigger a reactive change
  if(_formErrorDeps[formId]){
    _formErrorDeps[formId].changed();
  }
};

/**
 * Displays errors associated with a given form.
 * @function
 * @param {String} formId
 * @param {Boolean} [isReactive]
 */
AutoForm.getFormErrors = function(formId, isReactive) {
  if(!formId){
    formId = getFormId();
  }

  // Create the dependency for this form if it does not exist
  if (!_formErrorDeps[formId]) {
    _formErrorDeps[formId] = new Tracker.Dependency();
  }

  // Depend on changes to this form's errors
  if (isReactive !== false) {
    _formErrorDeps[formId].depend();
  }

  return _formErrors[formId];
};

Template.registerHelper('afGetFormErrors', AutoForm.getFormErrors);

/**
 * Clears the errors for a given form.
 */
AutoForm.clearFormErrors = function(formId){
  if(!formId){
    formId = getFormId();
  }

  _formErrors[formId] = [];
  if(_formErrorDeps[formId]){
    _formErrorDeps[formId].changed();
  }
};

/**
 * Look up the ID of the form using the current data context.
 * @returns {String} [formId]
 */
function getFormId(){
  var formId = AutoForm.getFormId();
  if(!formId){
    throw new Error('Generic Form Errors: Unable to find formId in current context');
  }
  return formId;
}

AutoForm.addHooks(null, {
  beginSubmit: function(){
    // Clear form errors
    AutoForm.clearFormErrors(this.formId);

    // If there are no user-defined hooks, by default we disable the submit button during submission
    var submitButton = this.template.find("button[type=submit]") || this.template.find("input[type=submit]" || this.template.find('.submit-form'));
    if (submitButton) {
      submitButton.disabled = true;
    }
  },
  endSubmit: function(){
    var submitButton = this.template.find("button[type=submit]") || this.template.find("input[type=submit]" || this.template.find('.submit-form'));
    if (submitButton) {
      submitButton.disabled = false;
    }
  },
  onError: function(formType, error){
    // Don't show validation errors because they are rendered inline by AutoForm
    if(this.ss._validationContexts[this.formId].invalidKeys().length > 0){
      return;
    }

    // Display the error
    AutoForm.setFormError(this.formId, error);
  }
});

/*
 * Clear form errors each time they are rendered to prevent stale errors from
 * reappearing
 */
var originalAFRendered = Template.autoForm.rendered;
Template.autoForm.rendered = function(){
  // Clear errors for this form
  AutoForm.clearFormErrors(this.data.id);
  // Call the original AutoForm rendered hook
  originalAFRendered.apply(this, arguments);
};
