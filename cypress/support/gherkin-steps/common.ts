import { Step } from '../../../src/definitions';

const r = (str: string) => new RegExp(`^${str}$`, 'i');

const THE = '(?:the|a)';
const ON = '(?:on|in|into|for)';
const IS = `(?:be|is|am)`;
const HAVE = `(?:have|has)`;
const OF = `(?:of)`;
const TO = `(?:to)`;

const USER = `${ THE }?\\s?(?:user|I|the|admin|they)`;
const PAGE = `${ THE }?\\s?(?:page|window)`;
const ELEMENT = `${ THE }?\\s?(?:button|element|link|textbox|input)`;

const STRING = '"([^"]+)"';
const WORD = '(\\S+)';
// const rINT = '(\\d+)';

// const escapeRegExp = (s: string) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
// const re = (strings: TemplateStringsArray, ...values: any) => {
// 	return RegExp(strings[0] + values.map((v, i) => escapeRegExp(v) + strings[i+1]).join(""))
// };

Step('*', r(`${ USER }?\\s?(?:visit|open)[s]? ${ THE }?\\s?${ STRING }\\s?${ PAGE }?`), cy.visit);

Step(
  '*',
  r(`${ USER }?\\s?click[s]? ${ ON }?\\s?${ THE }?\\s?${ STRING }\\s?${ ELEMENT }?`),
  (content: string) => {
    cy.contains(content).click();
  }
);

Step(
  '*',
  r(`${ USER }?\\s?type[s]? ${ STRING } ${ ON }?\\s?${ THE }?\\s?${ STRING }\\s?${ ELEMENT }?`),
  (text: string, el: string) => {
    cy.get(el).first().type(text);
  }
);

// TODO: alias parameter
Step(
  '*',
  r(`${ USER }?\\s?wait[s]? ${ ON }?\\s?${ THE }?\\s?${ STRING }`),
  (alias: string) => {
    cy.wait(alias);
  }
);

Step(
  '*',
  r(`${ USER }?\\s?(?:should)?\\s${ IS } on ${ THE }?\\s?${ STRING }\\s?${ PAGE }?`),
  (url: string) => {
    cy.url().should('contain', url);
  }
);

Step(
  '*',
  r(`${ USER }?\\s?(?:should)?\\ssee[s]? ${ STRING } in the ${ PAGE }?\\s?title`),
  (title: string) => {
    cy.title().should('include', title);
  }
);

Step('*', 
  r(`${ USER }?\\s?(?:should)?\\ssee[s]? ${ THE }?\\s?${ STRING }\\s?${ ELEMENT }?`),
  (el: string) => {
    cy.get(el).should('exist');
});

Step(
  '*',
  r(`${ THE }?\\s?${ STRING }\\s?(?:${ ELEMENT })?\\s?(?:should)? ${ HAVE } ${ STRING } as its value`),
  (el: string, val: string) => {
    cy.get(el).should('have.value', val);
  }
);

Step(
  '*',
  r(`${ USER }?\\s?scroll[s]? ${ TO } ${ THE } ${ WORD }\\s?${ OF }?\\s?${ THE }?\\s?${ PAGE }?`),
  (direction: string) => {
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
