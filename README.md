# AutoForm Generic Error

AutoForm's error handling is field specific and cannot produce an error message that is generic and not linked directly to a field. This package adds support for generic errors to be attached to a form.

## Usage:

Place the ``{{> afFormErrors }}`` template helper inside your form:

```
	{{#autoForm id="loginForm" schema=schema }}
		{{> afQuickField name='username' }}
		{{> afQuickField name='password' type='password' }}
		{{> afFormErrors }}

		<button type="submit">Login</button>
	{{/autoForm}}
```

## Automatic error handling

This package will automatically handle errors that are the result of a meteormethod call, or are passed to ``this.done`` within a hook method. You can now return errors from methods and have them show up in your form.

```
AutoForm.hooks({
  loginForm: {

    onSubmit: function(doc) {
      this.event.preventDefault();
      Meteor.loginWithPassword({ username: doc.username }, doc.password, this.done);
    }
  }
});
```

Is all thats required. Any errors as a result of loginWithPassword will show up in the ``afFormErrors`` template.

## Methods

The following new methods are available:

### AutoForm.setFormError(formId, error)
Allows you to add errors to a form by ID. 

**Example:**

``AutoForm.setFormError('loginForm', 'Invalid password!');``

``AutoForm.setFormError('loginForm', new Error('An error object instead!'));``


### AutoForm.getFormErrors(formId, isReactive)
Returns the errors for a specific form. Reactivity is optional via the second argument.

**Example:**

``AutoForm.getFormErrors('loginForm', true);``

### AutoForm.clearFormErrors(formId)###
Clears all errors associated with a given form.

**Example:**

``AutoForm.clearFormErrors('loginForm');``



