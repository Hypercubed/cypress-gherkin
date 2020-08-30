import { Then } from "../../../src";

Then(
  /^the title( not)* contains "([^"]*)?"$/, (not: boolean, title: string) => {
    cy.title().should(not ? 'not.contain' : 'contain', title);
  }
);

// Then(
//   /^the element "([^"]*)?" does( not)* appear exactly "([^"]*)?" times$/,
//   checkIfElementExists
// );

// Then(
//   /^the element "([^"]*)?" is( not)* within the viewport$/,
//   checkWithinViewport
// );

// Then(
//   /^the element "([^"]*)?"( not)* contains the same text as element "([^"]*)?"$/,
//   compareText
// );

// Then(
//   /^the (button|element) "([^"]*)?"( not)* matches the text "([^"]*)?"$/,
//   checkEqualsText
// );

Then(
  /^the (?:input|field|inputfield) "([^"]*)?"( not)* contains the text "([^"]*)?"$/, (selector: string, falseCase: boolean, expectedText: string) => {
    cy.get(selector).should(falseCase ? 'not.have.value' : 'have.value', expectedText)
  }
);

// Then(
//   /^the path is( not)* "([^"]*)?"$/,
//   checkURLPath
// );

Then(
  /^the url to( not)* contain "([^"]*)?"$/, (not: boolean, url: string) => {
    cy.url().should(not ? 'not.contain' : 'contain', url);
  }
);

// Then(
//   /^the( css)* attribute "([^"]*)?" from element "([^"]*)?" is( not)* "([^"]*)?"$/,
//   checkProperty
// );

// Then(
//   /^the font( css)* attribute "([^"]*)?" from element "([^"]*)?" is( not)* "([^"]*)?"$/,
//   checkFontProperty
// );

// Then(
//   /^the cookie "([^"]*)?"( not)* contains "([^"]*)?"$/,
//   checkCookieContent
// );

// Then(
//   /^the cookie "([^"]*)?"( not)* exists$/,
//   checkCookieExists
// );

// Then(
//   /^the element "([^"]*)?" is( not)* ([\d]+)px (broad|tall)$/,
//   checkDimension
// );

// Then(
//   /^the element "([^"]*)?" is( not)* positioned at ([\d+.?\d*]+)px on the (x|y) axis$/,
//   checkOffset
// );

// Then(
//   /^the element "([^"]*)?" (has|does not have) the class "([^"]*)?"$/,
//   checkClass
// );
