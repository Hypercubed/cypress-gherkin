import { Given } from "../../../src";

Given(
  /^I open the (?:url|site) "([^"]*)?"$/,
  cy.visit
);

Given(
  /^the (?:link|button|element|container|checkbox) "([^"]*)?" is( not)* (visible|enabled|selected|checked|empty)$/, (selector: string, not: string, state: string) => {
    cy.get(selector).should(`${not ? 'not.' : ''}${state}`);
  }
);

Given(
  /^the (?:link|button|element|container|checkbox) "([^"]*)?" does( not)* exist$/, (selector: string, not: string) => {
    cy.get(selector).should(not ? 'not.exist' : 'exist');
  }
);

Given(
  /^the title is( not)* "([^"]*)?"$/, (not: boolean, title: string) => {
    cy.title().should(not ? 'not.equal' : 'equal', title);
  }
);

Given(
  /^the (?:link|button|element|container|checkbox) "([^"]*)?"( not)* contains the text "([^"]*)?"$/, (selector: string, not: boolean, text: string) => {
    cy.get(selector).should(not ? 'not.contain' : 'contain', text);
  }
);

Given(
  /^the url is( not)* "([^"]*)?"$/, (not: boolean, url: string) => {
    cy.url().should(not ? 'not.equal' : 'equal', url);
  }
);

// Given(
//   /^the( css)* attribute "([^"]*)?" from element "([^"]*)?" is( not)* "([^"]*)?"$/,
//   checkProperty
// );

// Given(
//   /^the cookie "([^"]*)?" contains( not)* the value "([^"]*)?"$/,
//   checkCookieContent
// );

// Given(
//   /^the cookie "([^"]*)?" does( not)* exist$/,
//   checkCookieExists
// );

// Given(
//   /^the element "([^"]*)?" is( not)* ([\d]+)px (broad|tall)$/,
//   checkDimension
// );

// Given(
//   /^the element "([^"]*)?" is( not)* positioned at ([\d]+)px on the (x|y) axis$/,
//   checkOffset
// );
