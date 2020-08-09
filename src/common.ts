import { Step } from './definitions';

const THE = '( )(a)(the)(of)(to)(in)(into)(for)(on)( )';

const TO = THE;
const OF = THE;
const ON = THE;
const IN = THE;
const FOR = THE;

const USER = `( )(user)(I)(they)(admin)( )`;
const ELEMENT = `( )(button)(element)(link)( )`;
const PAGE = `( )(page)(window)( )`;

export const setupCommon = () => {
  Step('*', `${THE}${USER} visit(s)/open(s) ${THE}{string}${PAGE}`, cy.visit);

  Step(
    '*',
    `${THE}${USER} scroll(s) ${TO}${THE}{word}${OF}${THE}${PAGE}`,
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

  Step(
    '*',
    `${THE}${USER} click(s) ${ON}${THE}{string}${ELEMENT}`,
    (content: string) => {
      cy.contains(content).click();
    }
  );

  Step(
    '*',
    `${THE}${USER} type(s) {string} ${IN}${THE}{string}${ELEMENT}`,
    (text: string, el: string) => {
      cy.get(el).first().type(text);
    }
  );

  // TODO: alais parameter
  Step(
    '*',
    `${THE}${USER} wait(s) ${FOR}${THE}{string}( to load)( to finish)`,
    (alias: string) => {
      cy.wait(alias);
    }
  );

  Step(
    '*',
    `${THE}${USER} (should )be ${ON}${THE}{string}${PAGE}`,
    (url: string) => {
      cy.url().should('contain', url);
    }
  );

  Step(
    '*',
    `${THE}${USER} (should )see(s) {string} ${IN}${THE}${PAGE} title`,
    (title: string) => {
      cy.title().should('include', title);
    }
  );

  Step('*', `${THE}${USER} (should )see(s) ${THE}{string}`, (el: string) => {
    cy.get(el).should('exist');
  });

  Step(
    '*',
    `${THE}{string}${ELEMENT}(should) has/have {string} as its value`,
    (el: string, val: string) => {
      cy.get(el).should('have.value', val);
    }
  );
};
