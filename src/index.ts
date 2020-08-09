import Parser from '@cucumber/gherkin/dist/src/Parser';
import AstBuilder from '@cucumber/gherkin/dist/src/AstBuilder';

import {
  Expression,
  ParameterTypeRegistry,
  CucumberExpressionGenerator,
  ExpressionFactory,
  ParameterType as _ParameterType
} from '@cucumber/cucumber-expressions';

type Matcher = string | RegExp;

interface Definition {
  type: string,
  matcher: Matcher,
  expression: Expression,
  implementation: Function,
  options: any
}

const nextId = (function incrementing() {
  let next = 0
  return () => (next++).toString()
})();

const definitions: Definition[] = [];

const parameterTypeRegistry = new ParameterTypeRegistry();
const cucumberExpressionGenerator = new CucumberExpressionGenerator(parameterTypeRegistry);
const expressionFactory = new ExpressionFactory(parameterTypeRegistry);

const Step = (type: string, matcher: Matcher, implementation: Function = () => {}, options = { log: true }) => {
  definitions.push({
    type: type.trim(),
    matcher,
    expression: expressionFactory.createExpression(matcher),
    implementation,
    options
  });
};

export const Given = Step.bind(null, 'Given');
export const When = Step.bind(null, 'When');
export const Then = Step.bind(null, 'Then');
export const And = Step.bind(null, 'And');
export const But = Step.bind(null, 'But');

export const feature = describe;
export const scenario = it;
export const background = beforeEach;

const resolve = (_type: string, text: string) => {
  return definitions.find(({ expression }) => {
    return expression.match(text);
  });
};

const generateHint = (type: string, text: string) => {
  const examples = cucumberExpressionGenerator.generateExpressions(text);
  const suggestions = examples.map(example => `${type}('${example.source}', (${example.parameterNames}) => {});`).join('\n');
  return `Missing Gherkin statment: ${type} ${text}

Suggestion(s):

${suggestions}

  `;
}

const isJquery = (obj: any) => !!(obj && obj.jquery && Cypress._.isFunction(obj.constructor))

const getElements = ($el: any) => {
  if (!$el && !$el.length) {
    return
  }

 $el = $el.toArray()

  if ($el.length === 1) {
    return $el[0]
  } else {
    return $el
  }
};

const execute = (_type: string, text: string, ..._args: any[]) => {
  const resolved = resolve(_type, text);
  if (resolved) {
    let args = resolved.expression.match(text).map(match => match.getValue(null));
    args = [...args, ..._args];

    const fn = resolved.implementation;

    const consoleProps = (value: any) => () => {
      return {
        Text: text,
        Function: fn.name || undefined,
        Args: args || [],
        Contents: fn.toString(),
        Yielded: isJquery(value) ? getElements(value) : value,
      }
    };

    let log = resolved.options.log;

    if (log) {
      cy.then(() => {
        log = Cypress.log({
          name: _type,
          message: `${_type}, ${text}`
        });
        log.snapshot('before', { at: 0 });
      });
    }
    
    let value = fn.apply(null, args);
    value = Cypress.isCy(value) ? value : cy.wrap(value);

    if (log) {
      return value.then((val: any) => {
        log.set({
          consoleProps: consoleProps(val)
        });

        log.snapshot('after', { at: 1 });   
        return val;
      });
    }

    return value;
  } else {
    // return Cypress.Promise.(new Error(generateHint(_type.trim(), text)));
    // return cy.then(() => {
      const err = new Error(generateHint(_type.trim(), text));
      // err.stack = undefined;
      throw err;
    // });
  }
};

// @ts-ignore
// Cypress.Commands.add('given', execute);

export const given = execute.bind(null, 'Given');
export const when = execute.bind(null, 'When');
export const then = execute.bind(null, 'Then');
export const and = execute.bind(null, 'And');
export const but = execute.bind(null, 'But');

export const ParameterType = ({
  name,
  typeName,
  regexp,
  transformer,
  useForSnippets,
  preferForRegexpMatch,
}: any) => {
  const parameterType = new _ParameterType(
    name,
    regexp,
    typeName,
    transformer,
    useForSnippets,
    preferForRegexpMatch
  );
  parameterTypeRegistry.defineParameterType(parameterType);
}

export const outline = (method: any, examples: any[]) => {
  const heading = examples.splice(0, 1)[0];
  const props: any = {};

  examples.forEach(row => {
    heading.forEach((key: string, i: number) => {
      props[key] = row[i];
    });
    method(props);
  });
};

const parser = new Parser(new AstBuilder(nextId));

const gherkinSteps = (steps: any[]) => () => {
  steps.forEach((step: any) => {
    const args = [step.dataTable, step.docString].filter(e => e);
    execute(step.keyword, step.text, ...args);
  });
};

export const gherkin = (text: string) => {
  const ast = parser.parse(text);
  console.log(ast);

  if (ast.feature) {
    const { name, children } = ast.feature;
    feature(name || '', () => {
      if (children) {
        children.forEach((child: any) => {
          if (child.value === 'scenario') {
            const { name, steps } = child.scenario;
            scenario(name, gherkinSteps(steps));
          } else  if (child.value === 'background') {
            const { steps } = child.background;
            beforeEach(gherkinSteps(steps));
          }
        });
      }
    });
  }
}

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
  Step('*', `${ THE }${ USER } visit(s)/open(s) ${ THE }{string}${ PAGE }`, cy.visit);

  Step('*', `${ THE }${ USER } scroll(s) ${ TO }${ THE }{word}${ OF }${ THE }${ PAGE }`, (direction: string) => {
    let windowObj: Window;
    cy.window()
        .then(win => {
            windowObj = win;
            return cy.get('body');
        })
        .then(body => {
            const { scrollHeight } = body[0];
            const px = direction === 'top'
                ? 0
                : scrollHeight + 100;

            windowObj.scrollTo(0, px);
        });
  });

  Step('*', `${ THE }${ USER } click(s) ${ ON }${ THE }{string}${ELEMENT}`, (content: string) => {
    cy.contains(content).click();
  });

  Step('*', `${ THE }${ USER } type(s) {string} ${ IN }${ THE }{string}${ELEMENT}`, (text: string, el: string) => {
    cy.get(el).first().type(text);
  });

  // TODO: alais parameter
  Step('*', `${ THE }${ USER } wait(s) ${ FOR }${ THE }{string}( to load)( to finish)`, (alias: string) => {
    cy.wait(alias);
  });

  Step('*', `${ THE }${ USER } (should )be ${ ON }${ THE }{string}${ PAGE }`, (url: string) => {
    cy.url().should('contain', url);
  });

  Step('*', `${ THE }${ USER } (should )see(s) {string} ${ IN }${ THE }${ PAGE } title`, (title: string) => {
    cy.title().should('include', title);
  });

  Step('*', `${ THE }${ USER } (should )see(s) ${ THE }{string}`, (el: string) => {
    cy.get(el).should('exist');
  });

  Step('*', `${ THE }{string}${ELEMENT}(should) has/have {string} as its value`, (el: string, val: string) => {
    cy.get(el).should('have.value', val);
  });
}

