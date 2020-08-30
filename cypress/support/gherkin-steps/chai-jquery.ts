import { Step } from '../../../src/definitions';

Step('*', /^the element "([^"]*)?" has (attr|prop|css|data) "([^"]*)?" with value "([^"]*)?"$/, (selector: string, type: string,  prop: string, value: string) => {
  cy.get(selector).should(`have.${type}`, prop, value);
});

Step('*', /^the element "([^"]*)?" has (class|id|html|text|value) "([^"]*)?"$/, (selector: string, type: string, cls: string) => {
  cy.get(selector).should(`have.${type}`, cls);
});

Step('*', /^the element "([^"]*)?" is( not)* (visible|enabled|disabled|selected|checked|empty)$/, (selector: string, not: string, state: string) => {
  cy.get(selector).should(`${not ? 'not.' : ''}${state}`);
});

Step('*', /^the element "([^"]*)?" does( not)* exist$/, (selector: string, not: string) => {
  cy.get(selector).should(not ? 'not.exist' : 'exist');
});

Step('*', /^the element "([^"]*)?" exists$/, (selector: string) => {
  cy.get(selector).should('exist');
});

Step('*', /^the element "([^"]*)?" matches "([^"]*)?"$/, (selector: string, value: string) => {
  cy.get(selector).should(`to.match`, value);
});

Step('*', /^the element "([^"]*)?" contains "([^"]*)?"$/, (selector: string, text: string) => {
  cy.get(selector).should(`to.contain`, text);
});

Step('*', /^the element "([^"]*)?" has descendants "([^"]*)?"$/, (selector: string, descendants: string) => {
  cy.get(selector).should(`have.descendants`, descendants);
});