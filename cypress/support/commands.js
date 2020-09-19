// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('failsWith', function (fn, message) {
  const failed = `Expected to fail with "${message}"`;
  const passed = `${failed}, but it did not fail`;

  cy.on('fail', (err) => {
    if (err.message === passed) {
      throw err;
    } else if (message) {
      expect(err.message).to.include(message, failed);
    }
    return false;
  });

  fn.call(this);
  cy.then(() => assert(false, passed));
});

Cypress.Commands.add('shouldThrow', { prevSubject: true }, function (fn, message) {
  const failed = `Expected to fail with "${message}"`;
  const passed = `${failed}, but it did not fail`;

  cy.on('fail', (err) => {
    if (err.message === passed) {
      throw err;
    } else if (message) {
      expect(err.message).to.include(message, failed);
    }
    return false;
  });

  fn.call(this);
  cy.then(() => assert(false, passed));
});
