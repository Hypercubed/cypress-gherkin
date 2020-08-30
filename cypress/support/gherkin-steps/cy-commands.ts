import { Step } from '../../../src/definitions';

Step('*',  /^I visit "([^"]*)?"$/, cy.visit);

Step('*', /^I (click|doubleclick) on the element "([^"]*)?"$/, (action: string, selector: string) => {
  if (action === 'click') {
    cy.get(selector).click();
  } else {
    cy.get(selector).dblclick();
  }
});

Step('*', 'I scroll to the {word} of the page', (direction: string) => {
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

Step('*', /^I type "([^"]*)?" in the element "([^"]*)?"$/, (value: string, selector: string) => {
  cy.get(selector).first().type(value);
});

Step('*', /^I clear the element "([^"]*)?"$/, (selector: string) => {
  cy.get(selector).clear({ force: true });
});

Step('*', /^I wait for (\d+)ms$/, (ms: number) => {
  cy.wait(ms);
});

Step('*', /^I wait for "([^"]*)?"$/, (alias: string) => {
  cy.wait(alias);
});

Step('*', /^I press "([^"]*)?"$/, (key: string) => {
  cy.focused().type(`{${key}}`);
});

Step('*', /^I scroll to the element "([^"]*)?"$/, (selector: string) => {
  cy.get(selector).scrollIntoView();
});