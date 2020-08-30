import { transform } from '../../src/transform';

function expectEqualByLine(str1: string, str2: string) {
  const _str1 = str1.trim().split('\n').map(s => s.trim());
  const _str2 = str2.trim().split('\n').map(s => s.trim());

  _str1.forEach((line1, index) => {
    const line2 = _str2[index];
    if (line1 !== '' || line2 !== '') {
      expect(line1).equals(line2, `line ${index}`);
    }
  });
}

describe('transforms', () => {
  it('Simple', () => {
    cy.fixture('simple.feature').should(text => {
      cy.fixture('simple.feature.ts').should(script => {
        expectEqualByLine(transform(text), script);
      });
    });
  });

  it('And and But', () => {
    cy.fixture('and_but.feature').should(text => {
      cy.fixture('and_but.feature.ts').should(script => {
        expectEqualByLine(transform(text), script);
      });
    });
  });

  it('Background and Rules', () => {
    cy.fixture('background_rule.feature').should(text => {
      cy.fixture('background_rule.feature.ts').should(script => {
        expectEqualByLine(transform(text), script);
      });
    });
  });

  it('ScenarioOutline', () => {
    cy.fixture('outline.feature').should(text => {
      cy.fixture('outline.feature.ts').should(script => {
        expectEqualByLine(transform(text), script);
      });
    });
  });

  it('Rules and example', () => {
    cy.fixture('rules.feature').should(text => {
      cy.fixture('rules.feature.ts').should(script => {
        expectEqualByLine(transform(text), script);
      });
    });
  });

  it.skip('Data Tables', () => {
    cy.fixture('data-tables.feature').should(text => {
      cy.fixture('data-tables.feature.ts').should(script => {
        expectEqualByLine(transform(text), script);
      });
    });
  });

  it.skip('Attachments', () => {
    cy.fixture('attachments.feature').should(text => {
      cy.fixture('attachments.feature.ts').should(script => {
        expectEqualByLine(transform(text), script);
      });
    });
  });

  it('Tags and comments', () => {
    cy.fixture('tags_comments.feature').should(text => {
      cy.fixture('tags_comments.feature.ts').should(script => {
        expectEqualByLine(transform(text), script);
      });
    });
  });
});
