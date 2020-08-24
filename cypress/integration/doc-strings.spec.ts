import { When, Then, feature, scenario, when, then, gherkin } from '../../src/index';
import { messages } from '@cucumber/messages';

// type DocString = messages.GherkinDocument.Feature.Step.DocString;
const DocString = messages.GherkinDocument.Feature.Step.DocString;

function content(docString: any): string {
  return docString.content || docString;
}

let snippet: string | null;

const steps = {
  when: (dataString: any) => {
    snippet = content(dataString);
  },
  then: () => {
    expect(snippet).to.be.a('string');
  }
}

When('I use DocString like this', (arg) => steps.when(arg));

Then('I can interpret it as a string', () => steps.then());

describe('DocString', () => {
  beforeEach(() => {
    snippet = null;

    cy.spy(steps, 'when').as('When');
    cy.spy(steps, 'then').as('Then');
  });

  describe('Gherkin text', () => {
    beforeEach(() => {
      cy.stub(window, 'describe', (_name, fn) => fn()).as('describe');
      cy.stub(window, 'it', (_name, fn) => fn()).as('it');
      cy.stub(window, 'beforeEach', (_name, fn) => fn()).as('beforeEach');
    });

    it('runs gherkin text', () => {
      gherkin(`
        Feature: Using DocString in Gherkin text
          Scenario: DocString
            When I use DocString like this
            """
            <div>
              <h1>Hello</h1>
            </div>
            """
            Then I can interpret it as a string
      `);

      cy.get('@describe').should('callCount', 1);
      cy.get('@beforeEach').should('callCount', 0);
      cy.get('@it').should('callCount', 1);

      cy.get('@When').should('callCount', 1);
      cy.get('@Then').should('callCount', 1);

      cy.get('@When').should((_: any) => {
        const arg = _.firstCall.args[0];
        expect(arg).to.be.instanceOf(DocString);
        expect(content(arg)).to.eq('<div>\n  <h1>Hello</h1>\n</div>');
      });
      cy.get('@Then').should((_: any) => {
        expect(_.firstCall.args.length).to.equal(0);
      });
    });
  });

  describe('Gherkin syntax', () => {
    feature('Using DocString in Gherkin syntax', () => {
      scenario('DocString', () => {
        when('I use DocString like this', `
          <div>
            <h1>Hello</h1>
          </div>
        `);
        then('I can interpret it as a string');

        cy.get('@When').should('callCount', 1);
        cy.get('@Then').should('callCount', 1);
        cy.get('@When').should((_: any) => {
          const arg = _.firstCall.args[0];
          expect(arg).to.be.a('string');
          expect(arg).to.contain('\n          <div>\n            <h1>Hello</h1>\n          </div>\n');
        });
        cy.get('@Then').should((_: any) => {
          expect(_.firstCall.args.length).to.equal(0);
        });
      });
    });
  });
});
