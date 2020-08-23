import Parser from '@cucumber/gherkin/dist/src/Parser';
import AstBuilder from '@cucumber/gherkin/dist/src/AstBuilder';

import { Incrementing, isJquery, getElements } from './utils';
import { resolve, getSuggestions } from './definitions';
import { Walker } from './ast-walker';

const nextId = Incrementing();

const parser = new Parser(new AstBuilder(nextId));

export const execute = (_type: string, text: string, ..._args: any[]) => {
  return cy.then(function () {
    // process aliases
    if (this.cypress_gherkin_hash) {
      const keys = Object.keys(this.cypress_gherkin_hash);
      const keysRegex = keys.map((heading: string) => new RegExp(`<${heading}>`, 'g'));

      keys.forEach((key: string, i: number) => {
        const re = keysRegex[i];
        text = (text || '').replace(re, this.cypress_gherkin_hash[key]);
      });
    }

    const resolved = resolve(_type, text);

    if (!resolved) {
      Cypress.log({
        name: _type,
        message: `${_type}, ${text}`,
        // @ts-ignore
        state: 'failed',
        ended: true,
        consoleProps: () => {
          return {
            Text: text,
            Suggestions: getSuggestions(_type.trim(), text),
            Test: this.test.clone(),
            Spec: Cypress.spec
          }
        }
      });

      throw new Error('Missing Gherkin statement');
    }

    let args = resolved.expression
      .match(text)
      .map((match) => match.getValue(null));

    if (_args && _args.length) {
      args = args.concat(_args);
    }

    const fn = resolved.implementation;

    const consoleProps = (val: any) => () => {
      return {
        Text: text,
        Function: fn.name || undefined,
        Args: args || [],
        Contents: fn.toString(),
        Yielded: isJquery(val) ? getElements(val) : val,
      };
    };

    let log = resolved.options.log;

    if (log) {
      log = Cypress.log({
        name: _type,
        message: `${_type}, ${text}`,
      });
      log.snapshot('before', { at: 0 });
    }

    let value = fn.apply(null, args);
    value = Cypress.isCy(value) ? value : Promise.resolve(value);

    if (log) {
      return value.then((val: any) => {
        log.set({
          consoleProps: consoleProps(val),
        });

        log.snapshot('after', { at: 1 });

        return val;
      });
    }

    return value;
  });
};

const walker = new Walker({
  visitFeature(feature, _index, _parent, next) {
    describe(feature.name || '', next);
  },
  visitStep(step, _index, _parent) {
    const args = [step.dataTable, step.docString].filter((e) => e);
    return execute(step.keyword || '*', step.text || '', ...args);
  },
  visitBackground(background, _index, _parent, next) {
    beforeEach(background.name || '', () => {
      next();
    });
  },
  visitExample(_row, _index, _parent, next) {
    next();
  },
  visitExamples(examples, _index, _parent, next) {
    it(examples.name || '', () => {
      next();
    });
  },
  visitScenarioOutline(scenario, _index, _parent, next) {
    describe(scenario.name || '', next);
  },
  visitScenario(scenario, _index, _parent, next) {
    // Note: must no return anything (see https://docs.cypress.io/guides/references/error-messages.html#Cypress-detected-that-you-invoked-one-or-more-cy-commands-but-returned-a-different-value)
    it(scenario.name || '', () => {
      next();
    });
  },
  visitRule(rule, _index, _parent, next) {
    describe(rule.name || '', next);
  },
});

export const gherkin = (text: string) => {
  const ast = parser.parse(text);
  walker.walk(ast);
};

gherkin.skip = (text: string) => {
  const ast = parser.parse(text);
  describe.skip(ast?.feature?.name || '', () => null);
};
