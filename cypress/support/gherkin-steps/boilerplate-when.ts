import { When } from "../../../src";

When(
  'I scroll to the {word} of the page', (direction: string) => {
    let windowObj: Window;
    cy.window()
      .then((win) => {
        windowObj = win;
        return cy.get('body');
      })
      .then((body) => {
        const { scrollHeight } = body[0];
        const px = direction === 'top' ? 0 : scrollHeight + 100;

        windowObj.scrollTo(0, px);
      });
  }
);

When(
  /^I (click|doubleclick) on the (?:link|button|element|container) "([^"]*)?"$/, (action: string, selector: string) => {
    if (action === 'click') {
      cy.get(selector).click();
    } else {
      cy.get(selector).dblclick();
    }
  }
);

// todo: method add/set
When(
  /^I (type) "([^"]*)?" to the (?:input|field|inputfield) "([^"]*)?"$/, (_method: string, value: string, selector: string) => {
    cy.get(selector).first().type(value);
  }
);

When(
  /^I clear the (?:input|field|inputfield) "([^"]*)?"$/, (selector: string) => {
    cy.get(selector).clear({ force: true });
  }
);

When(
  /^I pause for (\d+)ms$/, (ms: number) => {
    cy.wait(ms);
  }
);

When(
  /^I wait for "([^"]*)?"$/, (alias: string) => {
    cy.wait(alias);
  }
);

// When(
//   /^I set a cookie "([^"]*)?" with the content "([^"]*)?"$/,
//   setCookie
// );

// When(
//   /^I delete the cookie "([^"]*)?"$/,
//   deleteCookies
// );

When(
  /^I press "([^"]*)?"$/, (key: string) => {
    cy.focused().type(`{${key}}`);
  }
);

When(
  /^I scroll to the (?:link|button|element|container) "([^"]*)?"$/, (selector: string) => {
    cy.get(selector).scrollIntoView();
  }
);

// When(
//   /^I select the (\d+)(st|nd|rd|th) option for element "([^"]*)?"$/,
//   selectOptionByIndex
// );

// When(
//   /^I select the option with the (name|value|text) "([^"]*)?" for element "([^"]*)?"$/,
//   selectOption
// );

// When(
//   /^I move to element "([^"]*)?"(?: with an offset of (\d+),(\d+))*$/,
//   moveTo
// );