import Parser from '@cucumber/gherkin/dist/src/Parser';
import AstBuilder from '@cucumber/gherkin/dist/src/AstBuilder';
import { messages } from '@cucumber/messages';

import { Incrementing, isJquery, getElements, includesSome } from './utils';
import { resolveAll, getSuggestions } from './definitions';
import { Walker } from './ast-walker';
import { ONLY, SKIP, TAGS } from './constants';

const Tag = messages.GherkinDocument.Feature.Tag;
type ITag = messages.GherkinDocument.Feature.ITag;

const parser = new Parser(new AstBuilder(Incrementing()));

export const execute = (_type: string, text: string, ..._args: any[]) => {
  return cy.then(function () {
    // process aliases
    if (this.cypress_gherkin_hash) {
      const keys = Object.keys(this.cypress_gherkin_hash);
      const keysRegex = keys.map(
        (heading: string) => new RegExp(`<${heading}>`, 'g')
      );

      keys.forEach((key: string, i: number) => {
        const re = keysRegex[i];
        text = (text || '').replace(re, this.cypress_gherkin_hash[key]);
      });
    }

    const resolved = resolveAll(_type, text);

    if (resolved.length === 0) {
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
            Spec: Cypress.spec,
          };
        },
      });

      throw new Error('Missing Gherkin statement');
    } else if (resolved.length > 1) {
      Cypress.log({
        name: _type,
        message: `${_type}, ${text}`,
        // @ts-ignore
        state: 'failed',
        ended: true,
        consoleProps: () => {
          return {
            Text: text,
            Matches: resolved,
            Test: this.test.clone(),
            Spec: Cypress.spec,
          };
        },
      });

      throw new Error('Multiple step definitions match');
    }

    const { expression, implementation, options } = resolved[0];

    const args = [
      ...expression.match(text).map((match) => match.getValue(null)),
      ..._args,
    ];

    const consoleProps = (val: any) => () => {
      return {
        Text: text,
        Function: implementation.name || undefined,
        Args: args || [],
        Contents: implementation.toString(),
        Yielded: isJquery(val) ? getElements(val) : val,
      };
    };

    let log = options.log;

    if (log) {
      log = Cypress.log({
        name: _type,
        message: `${_type}, ${text}`,
      });
      log.snapshot('before', { at: 0 });
    }

    let value = implementation.apply(this, args);
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

const getName = (name: string | undefined | null, tags: any[]) => {
  tags = (tags || []).filter((t) => !TAGS.includes(t || ''));
  return [name || '', ...tags].join(' ');
};

const invokeIt = (
  name: string | null | undefined,
  _tags: ITag[] | null | undefined,
  next: any
) => {
  const tags = (_tags || []).map((t) => t.name).filter(Boolean) as string[];

  // tslint:disable-next-line: ban-types
  let fn: Function = it;
  if (includesSome(tags, ONLY)) {
    fn = it.only;
  } else if (includesSome(tags, SKIP)) {
    fn = it.skip;
  }

  // Note: must no return anything
  // see https://docs.cypress.io/guides/references/error-messages.html#Cypress-detected-that-you-invoked-one-or-more-cy-commands-but-returned-a-different-value
  fn(getName(name, tags), () => {
    next();
  });
};

const invokeDescribe = (
  name: string | null | undefined,
  _tags: ITag[] | null | undefined,
  next: any
) => {
  const tags = (_tags || []).map((t) => t.name).filter(Boolean) as string[];

  // tslint:disable-next-line: ban-types
  let fn: Function = describe;
  if (includesSome(tags, ONLY)) {
    fn = describe.only;
  } else if (includesSome(tags, SKIP)) {
    fn = describe.skip;
  }

  fn(getName(name, tags), next);
};

const walker = new Walker({
  visitFeature(feature, _index, _parent, next) {
    invokeDescribe(feature.name, feature.tags, next);
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
    invokeIt(examples.name, examples.tags, next);
  },
  visitScenarioOutline(scenario, _index, _parent, next) {
    invokeDescribe(scenario.name, scenario.tags, next);
  },
  visitScenario(scenario, _index, _parent, next) {
    invokeIt(scenario.name, scenario.tags, next);
  },
  visitRule(rule, _index, _parent, next) {
    invokeDescribe(rule.name, null, next);
  },
});

export const gherkin = (text: string) => {
  const ast = parser.parse(text);
  walker.walk(ast);
};

gherkin.skip = (text: string) => {
  const ast = parser.parse(text);

  if (ast.feature) {
    ast.feature.tags = ast.feature.tags || [];
    ast.feature.tags.push(new Tag({ name: '@skip' }));
  }

  walker.walk(ast);
};

gherkin.only = (text: string) => {
  const ast = parser.parse(text);

  if (ast.feature) {
    ast.feature.tags = ast.feature.tags || [];
    ast.feature.tags.push(new Tag({ name: '@only' }));
  }

  walker.walk(ast);
};
