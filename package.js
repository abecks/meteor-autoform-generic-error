Package.describe({
  name: 'staringatlights:autoform-generic-error',
  version: '1.0.1',
  // Brief, one-line summary of the package.
  summary: 'Enables generic error handling in AutoForm.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/abecks/meteor-autoform-generic-error',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use(['templating', 'aldeed:autoform'], 'client');
  api.addFiles('autoform-generic-error.html', 'client');
  api.addFiles('autoform-generic-error.js', 'client');
});