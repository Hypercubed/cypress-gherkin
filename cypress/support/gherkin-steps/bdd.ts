import { Step } from '../../../src/definitions';

Step('*', /^the title should( not)* contain "([^"]*)?"$/, (not: boolean, title: string) => {
  cy.title().should(not ? 'not.contain' : 'contain', title);
});

Step('*', /^the title should( not)* be "([^"]*)?"$/, (not: boolean, title: string) => {
  cy.title().should(not ? 'not.equal' : 'equal', title);
});

Step('*', /^the title is( not)* "([^"]*)?"$/, (not: boolean, title: string) => {
  cy.title().should(not ? 'not.equal' : 'equal', title);
});

Step('*', /^the url should( not)* be "([^"]*)?"$/, (not: boolean, url: string) => {
  cy.url().should(not ? 'not.equal' : 'equal', url);
});

Step('*', /^the url should( not)* contain "([^"]*)?"$/, (not: boolean, url: string) => {
  cy.url().should(not ? 'not.contain' : 'contain', url);
});

Step('*', /^the url contains "([^"]*)?"$/, (url: string) => {
  cy.url().should('contain', url);
});